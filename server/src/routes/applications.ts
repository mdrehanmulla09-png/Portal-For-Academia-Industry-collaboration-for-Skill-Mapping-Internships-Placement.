import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { Application, ApplicationStatus } from '../types/shared';
import { RecommendationEngine } from '../services/recommendationEngine';

const router = Router();

// GET /api/applications/student - List all applications submitted by current student
router.get('/student', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Only students can view their application list.' });
    return;
  }

  const applications = db.get('applications').filter((a) => a.studentId === req.user?.userId);
  res.json({ success: true, applications });
});

// GET /api/applications/recruiter - List all applicants for recruiter's company
router.get('/recruiter', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'industry' && req.user?.role !== 'platform_admin') {
    res.status(403).json({ success: false, message: 'Only recruiters or admins can access applicant lists.' });
    return;
  }

  let applications = db.get('applications');

  if (req.user?.role === 'industry') {
    const industryProfile = db.get('industryProfiles').find((i) => i.userId === req.user?.userId);
    if (industryProfile) {
      // Find all opportunities owned by this company
      const companyOppIds = db.get('opportunities')
        .filter((o) => o.companyId === industryProfile.id || o.companyName.toLowerCase() === industryProfile.companyName.toLowerCase())
        .map((o) => o.id);

      applications = applications.filter((a) => companyOppIds.includes(a.opportunityId) || a.companyName.toLowerCase() === industryProfile.companyName.toLowerCase());
    }
  }

  res.json({ success: true, applications });
});

// POST /api/applications - Submit an application
router.post('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Only students can submit job/internship applications.' });
    return;
  }

  const { opportunityId, coverLetter, resumeUrl } = req.body;

  if (!opportunityId) {
    res.status(400).json({ success: false, message: 'Opportunity ID is required.' });
    return;
  }

  const opportunity = db.get('opportunities').find((o) => o.id === opportunityId);
  if (!opportunity) {
    res.status(404).json({ success: false, message: 'Opportunity not found.' });
    return;
  }

  // Prevent duplicate applications
  const existingApp = db.get('applications').find(
    (a) => a.studentId === req.user?.userId && a.opportunityId === opportunityId
  );
  if (existingApp) {
    res.status(409).json({ success: false, message: 'You have already applied for this opportunity.' });
    return;
  }

  const student = db.get('studentProfiles').find((s) => s.userId === req.user?.userId);
  if (!student) {
    res.status(400).json({ success: false, message: 'Student profile not found. Please complete profile first.' });
    return;
  }

  // Calculate live transparent skill match
  const evaluation = RecommendationEngine.evaluateOpportunity(student, opportunity);

  const newApp: Application = {
    id: `app-${Date.now()}`,
    opportunityId: opportunity.id,
    studentId: req.user.userId,
    studentName: student.fullName,
    studentEmail: req.user.email,
    institutionName: student.institutionName,
    branch: student.branch,
    opportunityTitle: opportunity.title,
    companyName: opportunity.companyName,
    opportunityType: opportunity.type,
    status: 'applied',
    appliedDate: new Date().toISOString(),
    resumeUrl: resumeUrl || student.resumeUrl || 'https://skillbridge.gov.in/docs/resumes/default-cv.pdf',
    skillMatchScore: evaluation.matchScore,
    matchingSkills: evaluation.matchingSkills,
    missingSkills: evaluation.missingSkills,
    coverLetter: coverLetter || '',
    timeline: [
      {
        status: 'applied',
        timestamp: new Date().toISOString(),
        note: 'Application successfully submitted via SkillBridge India portal.'
      }
    ]
  };

  const applications = db.get('applications');
  applications.unshift(newApp);

  // Send in-app notification to the recruiter
  const notifications = db.get('notifications');
  const industryProfile = db.get('industryProfiles').find(
    (i) => i.companyName.toLowerCase() === opportunity.companyName.toLowerCase()
  );

  if (industryProfile) {
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: industryProfile.userId,
      title: 'New Candidate Application',
      message: `${student.fullName} (${student.institutionName}, Match: ${evaluation.matchScore}%) applied for "${opportunity.title}".`,
      type: 'application',
      isRead: false,
      createdAt: new Date().toISOString(),
      linkUrl: '/recruiter/applicants'
    });
  }

  db.save();

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully!',
    application: newApp
  });
});

// PATCH /api/applications/:id/status - Recruiter updates application status
router.patch('/:id/status', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'industry' && req.user?.role !== 'platform_admin') {
    res.status(403).json({ success: false, message: 'Only authorized recruiters or admins can update candidate status.' });
    return;
  }

  const { id } = req.params;
  const { status, note, interviewDate, feedback } = req.body as {
    status: ApplicationStatus;
    note?: string;
    interviewDate?: string;
    feedback?: string;
  };

  const applications = db.get('applications');
  const app = applications.find((a) => a.id === id);

  if (!app) {
    res.status(404).json({ success: false, message: 'Application not found.' });
    return;
  }

  app.status = status;
  if (interviewDate) app.interviewDate = interviewDate;
  if (feedback) app.feedback = feedback;

  app.timeline.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${status.replace('_', ' ').toUpperCase()} by recruiter.`
  });

  // Notify student of status change
  const notifications = db.get('notifications');
  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: app.studentId,
    title: `Application Update: ${status.replace('_', ' ').toUpperCase()}`,
    message: `Your application for "${app.opportunityTitle}" at ${app.companyName} has moved to ${status.replace('_', ' ')}.`,
    type: 'application',
    isRead: false,
    createdAt: new Date().toISOString(),
    linkUrl: '/applications'
  });

  db.save();

  res.json({
    success: true,
    message: `Application status successfully updated to ${status}.`,
    application: app
  });
});

export default router;
