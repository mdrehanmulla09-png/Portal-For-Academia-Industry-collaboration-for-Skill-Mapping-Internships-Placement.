import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { initialUsers } from '../db/initialData';
import { generateToken, comparePassword, hashPassword } from '../utils/auth';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { User, UserRole, StudentProfile, IndustryProfile, FacultyProfile, InstitutionProfile } from '../types/shared';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Demo quick-login accounts
const DEMO_EMAILS: Record<UserRole, string> = {
  student: 'student@skillbridge.gov.in',
  industry: 'industry@skillbridge.gov.in',
  faculty: 'faculty@skillbridge.gov.in',
  institution_admin: 'institution@skillbridge.gov.in',
  platform_admin: 'admin@skillbridge.gov.in'
};

// POST /api/auth/demo-login
router.post('/demo-login', async (req: Request, res: Response): Promise<void> => {
  const { role } = req.body as { role: UserRole };
  const targetEmail = DEMO_EMAILS[role];

  if (!targetEmail) {
    res.status(400).json({ success: false, message: 'Invalid demo role requested.' });
    return;
  }

  const users = db.get('users');
  const user = users.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase());

  if (!user) {
    res.status(404).json({ success: false, message: 'Demo user not found. Please re-seed database.' });
    return;
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      isVerified: user.isVerified
    }
  });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required.' });
    return;
  }

  const users = db.get('users');
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  // Find password hash from initialUsers or default
  const initialMatch = initialUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  const hash = initialMatch?.passwordHash || '$2a$10$wT8mQyv79PzI5R1eB5x2seR8a9W2vB5C7D9E1F3G5H7I9J1K3L5M6';

  const isMatch = await comparePassword(password, hash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      isVerified: user.isVerified
    }
  });
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, phone, profileData } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ success: false, message: 'Missing required registration fields.' });
    return;
  }

  const users = db.get('users');
  const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    return;
  }

  const newUserId = `user-${Date.now()}`;
  const newUser: User = {
    id: newUserId,
    name,
    email,
    role,
    phone,
    isVerified: role === 'student', // Students verified by email, orgs require admin verification
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  // Create role-specific profile
  if (role === 'student') {
    const studentProfiles = db.get('studentProfiles');
    const newProfile: StudentProfile = {
      id: `sp-${Date.now()}`,
      userId: newUserId,
      fullName: name,
      institutionName: profileData?.institutionName || 'Indian Institute of Technology',
      branch: profileData?.branch || 'Computer Science & Engineering',
      degree: profileData?.degree || 'B.Tech',
      graduationYear: profileData?.graduationYear || 2026,
      cgpa: profileData?.cgpa || 8.0,
      careerInterests: profileData?.careerInterests || ['Software Engineering'],
      skills: profileData?.skills || [
        { skill: 'Problem Solving & DSA', level: 'intermediate', verified: false, assessed: false, source: 'self_reported' },
        { skill: 'Communication', level: 'intermediate', verified: false, assessed: false, source: 'self_reported' }
      ],
      bio: profileData?.bio || 'Undergraduate student on SkillBridge India.',
      portfolioSlug: name.toLowerCase().replace(/\s+/g, '-'),
      portfolioCompletionPercentage: 50
    };
    studentProfiles.push(newProfile);
  } else if (role === 'industry') {
    const industryProfiles = db.get('industryProfiles');
    const newProfile: IndustryProfile = {
      id: `ind-${Date.now()}`,
      userId: newUserId,
      companyName: profileData?.companyName || name,
      cinNumber: profileData?.cinNumber || '',
      sector: profileData?.sector || 'Information Technology',
      website: profileData?.website || 'https://example.in',
      headquarters: profileData?.headquarters || 'Mumbai, India',
      description: profileData?.description || 'Registered industry partner on SkillBridge India portal.',
      verifiedStatus: 'pending',
      contactPerson: name,
      contactDesignation: profileData?.designation || 'Hiring Lead'
    };
    industryProfiles.push(newProfile);

    // Queue verification request
    const verificationRequests = db.get('verificationRequests');
    verificationRequests.push({
      id: `vr-${Date.now()}`,
      type: 'organization',
      targetId: newProfile.id,
      targetName: newProfile.companyName,
      requesterEmail: email,
      details: `New industry registration for ${newProfile.companyName}. Pending MCA/CIN validation.`,
      status: 'pending',
      submittedAt: new Date().toISOString()
    });
  }

  db.save();

  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name
  });

  res.status(201).json({
    success: true,
    token,
    user: newUser
  });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const users = db.get('users');
  const user = users.find((u) => u.id === req.user?.userId);

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  // Attach profile based on role
  let profile = null;
  if (user.role === 'student') {
    profile = db.get('studentProfiles').find((s) => s.userId === user.id);
  } else if (user.role === 'industry') {
    profile = db.get('industryProfiles').find((i) => i.userId === user.id);
  } else if (user.role === 'faculty') {
    profile = db.get('facultyProfiles').find((f) => f.userId === user.id);
  } else if (user.role === 'institution_admin') {
    profile = db.get('institutionProfiles').find((inst) => inst.userId === user.id);
  }

  res.json({
    success: true,
    user,
    profile
  });
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Successfully logged out.' });
});

export default router;
