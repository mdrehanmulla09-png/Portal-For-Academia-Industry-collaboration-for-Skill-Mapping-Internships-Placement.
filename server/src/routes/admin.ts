import { Router, Response } from 'express';
import { db } from '../db/store';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { VerificationStatus } from '../types/shared';

const router = Router();

// GET /api/admin/verifications - List verification requests
router.get('/verifications', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'platform_admin' && req.user?.role !== 'institution_admin') {
    res.status(403).json({ success: false, message: 'Administrative privileges required.' });
    return;
  }

  const { status, type } = req.query as { status?: VerificationStatus; type?: string };
  let requests = db.get('verificationRequests');

  if (status && status !== ('all' as any)) {
    requests = requests.filter((r) => r.status === status);
  }
  if (type && type !== 'all') {
    requests = requests.filter((r) => r.type === type);
  }

  res.json({ success: true, total: requests.length, requests });
});

// POST /api/admin/verifications/:id/decision - Approve or Reject
router.post('/verifications/:id/decision', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'platform_admin' && req.user?.role !== 'institution_admin') {
    res.status(403).json({ success: false, message: 'Administrative privileges required.' });
    return;
  }

  const { id } = req.params;
  const { decision, remarks } = req.body as { decision: VerificationStatus; remarks?: string };

  const requests = db.get('verificationRequests');
  const request = requests.find((r) => r.id === id);

  if (!request) {
    res.status(404).json({ success: false, message: 'Verification request not found.' });
    return;
  }

  request.status = decision;
  request.reviewedAt = new Date().toISOString();
  request.reviewedBy = req.user.name;
  if (remarks) request.remarks = remarks;

  // If approving organization, mark industry profile as verified
  if (decision === 'verified' && request.type === 'organization') {
    const industries = db.get('industryProfiles');
    const ind = industries.find((i) => i.id === request.targetId);
    if (ind) {
      ind.verifiedStatus = 'verified';
    }
  }

  // If approving student credential, mark skill as verified
  if (decision === 'verified' && request.type === 'student_credential') {
    const students = db.get('studentProfiles');
    const student = students.find((s) => s.id === request.targetId || s.userId === request.targetId);
    if (student) {
      // mark matched skills as verified
      student.skills.forEach((s) => {
        if (request.details.toLowerCase().includes(s.skill.toLowerCase())) {
          s.verified = true;
          s.source = 'credential_verified';
        }
      });
    }
  }

  // Send notification to requester
  const notifications = db.get('notifications');
  const user = db.get('users').find((u) => u.email.toLowerCase() === request.requesterEmail.toLowerCase());
  if (user) {
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: `Verification Request ${decision.toUpperCase()}`,
      message: `Your verification request for "${request.targetName}" was marked as ${decision}. ${remarks || ''}`,
      type: 'verification',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  db.save();

  res.json({
    success: true,
    message: `Request successfully marked as ${decision}.`,
    request
  });
});

// GET /api/admin/users - User management list
router.get('/users', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'platform_admin') {
    res.status(403).json({ success: false, message: 'Platform admin privileges required.' });
    return;
  }

  const users = db.get('users').map(({ ...rest }) => rest);
  res.json({ success: true, total: users.length, users });
});

export default router;
