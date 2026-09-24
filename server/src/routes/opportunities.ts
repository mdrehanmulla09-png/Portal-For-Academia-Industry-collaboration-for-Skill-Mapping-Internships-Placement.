import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { Opportunity, OpportunityType, WorkMode } from '../types/shared';
import { RecommendationEngine } from '../services/recommendationEngine';

const router = Router();

// GET /api/opportunities - public and authenticated search/filter
router.get('/', (req: Request, res: Response): void => {
  const {
    type,
    search,
    workMode,
    location,
    skill,
    minCgpa,
    page = '1',
    limit = '20'
  } = req.query as Record<string, string>;

  let opportunities = db.get('opportunities').filter((o) => o.status === 'active');

  if (type && type !== 'all') {
    opportunities = opportunities.filter((o) => o.type === (type as OpportunityType));
  }

  if (workMode && workMode !== 'all') {
    opportunities = opportunities.filter((o) => o.workMode === (workMode as WorkMode));
  }

  if (location) {
    opportunities = opportunities.filter((o) =>
      o.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (skill) {
    opportunities = opportunities.filter((o) =>
      o.requiredSkills.some((s) => s.skill.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  if (search) {
    const q = search.toLowerCase();
    opportunities = opportunities.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.companyName.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.requiredSkills.some((s) => s.skill.toLowerCase().includes(q))
    );
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const total = opportunities.length;
  const paginated = opportunities.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    opportunities: paginated
  });
});

// GET /api/opportunities/:id
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const opportunity = db.get('opportunities').find((o) => o.id === id);

  if (!opportunity) {
    res.status(404).json({ success: false, message: 'Opportunity not found.' });
    return;
  }

  res.json({
    success: true,
    opportunity
  });
});

// POST /api/opportunities (Industry or Platform Admin)
router.post('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'industry' && req.user?.role !== 'platform_admin') {
    res.status(403).json({ success: false, message: 'Only industry recruiters or admins can post opportunities.' });
    return;
  }

  const {
    title,
    type,
    description,
    requiredSkills,
    preferredQualifications,
    location,
    workMode,
    duration,
    stipendOrSalary,
    applicationDeadline,
    openings,
    eligibility
  } = req.body;

  if (!title || !type || !requiredSkills) {
    res.status(400).json({ success: false, message: 'Title, type, and required skills are mandatory.' });
    return;
  }

  // Get company details
  let companyName = 'Partner Industry';
  let companyId = 'ind-custom';
  let companyLogo = undefined;

  if (req.user?.role === 'industry') {
    const industryProfile = db.get('industryProfiles').find((i) => i.userId === req.user?.userId);
    if (industryProfile) {
      companyName = industryProfile.companyName;
      companyId = industryProfile.id;
      companyLogo = industryProfile.logoUrl;
    }
  }

  const newOpp: Opportunity = {
    id: `opp-${Date.now()}`,
    title,
    companyId,
    companyName,
    companyLogo,
    type,
    description: description || '',
    requiredSkills: requiredSkills || [],
    preferredQualifications: preferredQualifications || [],
    location: location || 'India / Remote',
    workMode: workMode || 'hybrid',
    duration: duration || '3-6 Months',
    stipendOrSalary: stipendOrSalary || 'Competitive',
    applicationDeadline: applicationDeadline || '2026-12-31',
    openings: openings || 5,
    eligibility: eligibility || {},
    status: 'active',
    createdAt: new Date().toISOString()
  };

  const opportunities = db.get('opportunities');
  opportunities.unshift(newOpp);
  db.save();

  res.status(201).json({
    success: true,
    message: 'Opportunity posted successfully.',
    opportunity: newOpp
  });
});

// PUT /api/opportunities/:id
router.put('/:id', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const opportunities = db.get('opportunities');
  const index = opportunities.findIndex((o) => o.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Opportunity not found.' });
    return;
  }

  opportunities[index] = {
    ...opportunities[index],
    ...req.body,
    id // preserve id
  };

  db.save();

  res.json({
    success: true,
    message: 'Opportunity updated successfully.',
    opportunity: opportunities[index]
  });
});

export default router;
