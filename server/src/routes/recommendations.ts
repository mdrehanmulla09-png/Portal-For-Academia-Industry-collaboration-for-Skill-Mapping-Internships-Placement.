import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { RecommendationEngine } from '../services/recommendationEngine';
import { db } from '../db/store';

const router = Router();

// GET /api/recommendations - Get AI ranked recommendations for current student
router.get('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Recommendations are customized for student profiles.' });
    return;
  }

  const { type } = req.query as { type?: string };
  const recommendations = RecommendationEngine.getRecommendationsForStudent(req.user.userId, type);

  const student = db.get('studentProfiles').find((s) => s.userId === req.user?.userId);

  res.json({
    success: true,
    total: recommendations.length,
    studentSkills: student?.skills || [],
    recommendations
  });
});

export default router;
