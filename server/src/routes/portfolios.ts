import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { StudentProfile } from '../types/shared';

const router = Router();

// GET /api/portfolios/me - Get current student's portfolio
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Only students have student portfolios.' });
    return;
  }

  const student = db.get('studentProfiles').find((s) => s.userId === req.user?.userId);
  if (!student) {
    res.status(404).json({ success: false, message: 'Portfolio not found.' });
    return;
  }

  // Also include past applications and certifications
  const applications = db.get('applications').filter((a) => a.studentId === req.user?.userId);
  const internship = db.get('internshipProgress').find((i) => i.studentId === req.user?.userId);

  res.json({
    success: true,
    portfolio: student,
    applications,
    internship
  });
});

// PUT /api/portfolios/me - Update student portfolio details
router.put('/me', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const profiles = db.get('studentProfiles');
  const index = profiles.findIndex((s) => s.userId === req.user?.userId);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Portfolio not found.' });
    return;
  }

  profiles[index] = {
    ...profiles[index],
    ...req.body,
    userId: req.user.userId // ensure immutability
  };

  db.save();

  res.json({
    success: true,
    message: 'Digital portfolio updated successfully.',
    portfolio: profiles[index]
  });
});

// POST /api/portfolios/request-verification - Request institutional/platform credential verification
router.post('/request-verification', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Only students can request credential verification.' });
    return;
  }

  const { credentialTitle, issuingAuthority, documentUrl, skillName } = req.body;

  if (!credentialTitle) {
    res.status(400).json({ success: false, message: 'Credential title is required.' });
    return;
  }

  const student = db.get('studentProfiles').find((s) => s.userId === req.user?.userId);

  const verificationRequests = db.get('verificationRequests');
  const newReq = {
    id: `vr-${Date.now()}`,
    type: 'student_credential' as const,
    targetId: student?.id || req.user.userId,
    targetName: `${student?.fullName || 'Student'} - ${credentialTitle}`,
    requesterEmail: req.user.email,
    documentUrl: documentUrl || 'https://skillbridge.gov.in/docs/verify/credential-sample.pdf',
    details: `Credential: ${credentialTitle} issued by ${issuingAuthority || 'Authorized Body'}. Associated Skill: ${skillName || 'Technical'}`,
    status: 'pending' as const,
    submittedAt: new Date().toISOString()
  };

  verificationRequests.unshift(newReq);
  db.save();

  res.status(201).json({
    success: true,
    message: 'Verification request submitted. Status is pending review by Institution / Platform Admin.',
    request: newReq
  });
});

// GET /api/portfolios/public/:slug - Public view of student portfolio
router.get('/public/:slug', (req: Request, res: Response): void => {
  const { slug } = req.params;
  const student = db.get('studentProfiles').find(
    (s) => s.portfolioSlug?.toLowerCase() === slug.toLowerCase() || s.id === slug
  );

  if (!student) {
    res.status(404).json({ success: false, message: 'Public portfolio not found.' });
    return;
  }

  // Privacy-conscious public projection (omit phone, email)
  const sanitized = {
    fullName: student.fullName,
    institutionName: student.institutionName,
    branch: student.branch,
    degree: student.degree,
    graduationYear: student.graduationYear,
    careerInterests: student.careerInterests,
    skills: student.skills,
    bio: student.bio,
    location: student.location,
    githubUrl: student.githubUrl,
    linkedinUrl: student.linkedinUrl,
    portfolioCompletionPercentage: student.portfolioCompletionPercentage
  };

  res.json({
    success: true,
    portfolio: sanitized
  });
});

export default router;
