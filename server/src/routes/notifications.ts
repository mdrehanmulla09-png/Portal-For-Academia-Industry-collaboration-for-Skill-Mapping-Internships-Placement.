import { Router, Response } from 'express';
import { db } from '../db/store';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/notifications - List user's notifications
router.get('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const notifications = db.get('notifications').filter((n) => n.userId === req.user?.userId);
  res.json({
    success: true,
    total: notifications.length,
    unreadCount: notifications.filter((n) => !n.isRead).length,
    notifications
  });
});

// PATCH /api/notifications/:id/read - Mark one as read
router.patch('/:id/read', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const notifications = db.get('notifications');
  const notif = notifications.find((n) => n.id === id && n.userId === req.user?.userId);

  if (notif) {
    notif.isRead = true;
    db.save();
  }

  res.json({ success: true, notification: notif });
});

// POST /api/notifications/mark-all-read - Mark all as read
router.post('/mark-all-read', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const notifications = db.get('notifications');
  notifications
    .filter((n) => n.userId === req.user?.userId)
    .forEach((n) => { n.isRead = true; });

  db.save();
  res.json({ success: true, message: 'All notifications marked as read.' });
});

export default router;
