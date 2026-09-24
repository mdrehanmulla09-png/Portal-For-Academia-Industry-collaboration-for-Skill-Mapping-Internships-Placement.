import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { LearningProgram, WorkMode } from '../types/shared';

const router = Router();

// GET /api/learning - Search and filter learning programs
router.get('/', (req: Request, res: Response): void => {
  const { type, mode, search, skill } = req.query as Record<string, string>;
  let programs = db.get('learningPrograms');

  if (type && type !== 'all') {
    programs = programs.filter((p) => p.type === type);
  }
  if (mode && mode !== 'all') {
    programs = programs.filter((p) => p.mode === (mode as WorkMode));
  }
  if (skill) {
    programs = programs.filter((p) =>
      p.skillsCovered.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }
  if (search) {
    const q = search.toLowerCase();
    programs = programs.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q) ||
        p.skillsCovered.some((s) => s.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, total: programs.length, programs });
});

// POST /api/learning/enroll - Enroll in a program
router.post('/enroll', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { programId } = req.body;
  const programs = db.get('learningPrograms');
  const program = programs.find((p) => p.id === programId);

  if (!program) {
    res.status(404).json({ success: false, message: 'Learning program not found.' });
    return;
  }

  program.enrollmentCount += 1;

  // Add notification
  const notifications = db.get('notifications');
  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: req.user!.userId,
    title: 'Program Enrollment Confirmed',
    message: `You are successfully registered for "${program.title}" by ${program.provider}. Access modules in your dashboard.`,
    type: 'system',
    isRead: false,
    createdAt: new Date().toISOString(),
    linkUrl: '/learning'
  });

  db.save();

  res.json({
    success: true,
    message: `Successfully enrolled in ${program.title}!`,
    program
  });
});

export default router;
