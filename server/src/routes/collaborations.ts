import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { CollaborationProposal } from '../types/shared';

const router = Router();

// GET /api/collaborations - List proposals with optional filters
router.get('/', (req: Request, res: Response): void => {
  const { status, type, domain } = req.query as Record<string, string>;
  let proposals = db.get('collaborationProposals');

  if (status && status !== 'all') {
    proposals = proposals.filter((p) => p.status === status);
  }
  if (type && type !== 'all') {
    proposals = proposals.filter((p) => p.type === type);
  }
  if (domain) {
    proposals = proposals.filter((p) => p.domain.toLowerCase().includes(domain.toLowerCase()));
  }

  res.json({ success: true, total: proposals.length, proposals });
});

// POST /api/collaborations - Submit proposal (Faculty or Industry)
router.post('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'faculty' && req.user?.role !== 'industry' && req.user?.role !== 'platform_admin') {
    res.status(403).json({ success: false, message: 'Only faculty members, industries, or admins can submit collaboration proposals.' });
    return;
  }

  const { title, targetOrgName, type, domain, budgetOrFunding, objectives, deliverables, expectedDuration } = req.body;

  if (!title || !targetOrgName || !objectives) {
    res.status(400).json({ success: false, message: 'Title, target organization, and objectives are required.' });
    return;
  }

  let proposerOrg = 'Academic Institution';
  if (req.user.role === 'faculty') {
    const fac = db.get('facultyProfiles').find((f) => f.userId === req.user?.userId);
    if (fac) proposerOrg = fac.institutionName;
  } else if (req.user.role === 'industry') {
    const ind = db.get('industryProfiles').find((i) => i.userId === req.user?.userId);
    if (ind) proposerOrg = ind.companyName;
  }

  const newProposal: CollaborationProposal = {
    id: `collab-${Date.now()}`,
    title,
    proposedByRole: req.user.role === 'faculty' ? 'faculty' : 'industry',
    proposerId: req.user.userId,
    proposerName: req.user.name,
    proposerOrg,
    targetOrgName,
    type: type || 'joint_research',
    domain: domain || 'Emerging Technology',
    budgetOrFunding: budgetOrFunding || 'Mutually agreed co-funding',
    objectives,
    deliverables: Array.isArray(deliverables) ? deliverables : [deliverables],
    expectedDuration: expectedDuration || '12 Months',
    status: 'submitted',
    submittedDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  };

  const proposals = db.get('collaborationProposals');
  proposals.unshift(newProposal);
  db.save();

  res.status(201).json({
    success: true,
    message: 'Collaboration proposal submitted successfully for institutional review.',
    proposal: newProposal
  });
});

// PATCH /api/collaborations/:id/status - Update proposal lifecycle status
router.patch('/:id/status', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const proposals = db.get('collaborationProposals');
  const proposal = proposals.find((p) => p.id === id);

  if (!proposal) {
    res.status(404).json({ success: false, message: 'Proposal not found.' });
    return;
  }

  proposal.status = status;
  proposal.updatedDate = new Date().toISOString();
  if (adminNotes) proposal.adminNotes = adminNotes;

  // Add notification to proposer
  const notifications = db.get('notifications');
  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: proposal.proposerId,
    title: 'Collaboration Proposal Status Update',
    message: `Your proposal "${proposal.title}" has been updated to "${status.replace('_', ' ').toUpperCase()}".`,
    type: 'collaboration',
    isRead: false,
    createdAt: new Date().toISOString(),
    linkUrl: '/collaboration'
  });

  db.save();

  res.json({
    success: true,
    message: `Collaboration proposal status changed to ${status}.`,
    proposal
  });
});

export default router;
