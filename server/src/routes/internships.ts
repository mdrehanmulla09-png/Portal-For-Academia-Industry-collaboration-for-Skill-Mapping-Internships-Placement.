import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { InternshipProgressRecord } from '../types/shared';

const router = Router();

// GET /api/internships/progress - Get active internship record
router.get('/progress', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const allRecords = db.get('internshipProgress');

  if (req.user?.role === 'student') {
    const record = allRecords.find((r) => r.studentId === req.user?.userId);
    res.json({ success: true, record: record || null });
    return;
  }

  if (req.user?.role === 'industry') {
    const records = allRecords.filter(
      (r) => r.mentorEmail.toLowerCase() === req.user?.email.toLowerCase() ||
             req.user?.name.toLowerCase().includes(r.mentorName.toLowerCase())
    );
    res.json({ success: true, records });
    return;
  }

  res.json({ success: true, records: allRecords });
});

// POST /api/internships/weekly-log - Student submits weekly progress log
router.post('/weekly-log', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Only students can submit weekly progress logs.' });
    return;
  }

  const { weekNumber, tasksAccomplished, challengesFaced, learnings, deliverableLink } = req.body;

  if (!weekNumber || !tasksAccomplished) {
    res.status(400).json({ success: false, message: 'Week number and tasks accomplished are required.' });
    return;
  }

  const records = db.get('internshipProgress');
  let record = records.find((r) => r.studentId === req.user?.userId);

  if (!record) {
    // Create new active internship record linked to student
    record = {
      id: `intern-${Date.now()}`,
      studentId: req.user.userId,
      studentName: req.user.name,
      opportunityId: 'opp-1',
      opportunityTitle: 'Full Stack Web Engineering Intern',
      companyName: 'Tata Consultancy Tech Solutions',
      mentorName: 'Priya Nair',
      mentorEmail: 'industry@skillbridge.gov.in',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-08-31',
      overallProgress: 20,
      status: 'ongoing',
      weeklyLogs: []
    };
    records.push(record);
  }

  const newLog = {
    weekNumber: Number(weekNumber),
    weekStartDate: new Date().toISOString().split('T')[0],
    tasksAccomplished,
    challengesFaced: challengesFaced || 'None reported',
    learnings: learnings || 'Practical hands-on domain engineering',
    deliverableLink: deliverableLink || '',
    submittedAt: new Date().toISOString()
  };

  record.weeklyLogs.push(newLog);
  record.overallProgress = Math.min(100, record.weeklyLogs.length * 20);

  // Notify mentor
  const notifications = db.get('notifications');
  const mentorUser = db.get('users').find((u) => u.email.toLowerCase() === record?.mentorEmail.toLowerCase());
  if (mentorUser) {
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: mentorUser.id,
      title: 'Weekly Progress Report Submitted',
      message: `${req.user.name} submitted Week ${weekNumber} progress report for evaluation.`,
      type: 'internship',
      isRead: false,
      createdAt: new Date().toISOString(),
      linkUrl: '/internship-tracker'
    });
  }

  db.save();

  res.status(201).json({
    success: true,
    message: `Week ${weekNumber} progress report submitted successfully.`,
    log: newLog,
    record
  });
});

// POST /api/internships/mentor-feedback - Mentor submits rating and review
router.post('/mentor-feedback', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'industry' && req.user?.role !== 'platform_admin') {
    res.status(403).json({ success: false, message: 'Only industry mentors can evaluate student logs.' });
    return;
  }

  const { recordId, weekNumber, rating, feedback } = req.body;

  const records = db.get('internshipProgress');
  const record = records.find((r) => r.id === recordId);

  if (!record) {
    res.status(404).json({ success: false, message: 'Internship record not found.' });
    return;
  }

  const log = record.weeklyLogs.find((l) => l.weekNumber === Number(weekNumber));
  if (!log) {
    res.status(404).json({ success: false, message: `Log for week ${weekNumber} not found.` });
    return;
  }

  log.mentorEvaluation = {
    rating: Number(rating) || 5,
    feedback: feedback || 'Satisfactory progress and milestone completion.',
    evaluatedAt: new Date().toISOString(),
    mentorName: req.user.name
  };

  // Notify student
  const notifications = db.get('notifications');
  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: record.studentId,
    title: 'Mentor Evaluation Added',
    message: `${req.user.name} reviewed your Week ${weekNumber} submission (${rating}/5 Stars).`,
    type: 'internship',
    isRead: false,
    createdAt: new Date().toISOString(),
    linkUrl: '/internship-tracker'
  });

  db.save();

  res.json({
    success: true,
    message: 'Mentor feedback submitted successfully.',
    record
  });
});

// POST /api/internships/complete - Issue verified digital completion record
router.post('/complete', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'industry' && req.user?.role !== 'platform_admin') {
    res.status(403).json({ success: false, message: 'Only mentors or platform administrators can authorize completion certificates.' });
    return;
  }

  const { recordId, grade } = req.body;
  const records = db.get('internshipProgress');
  const record = records.find((r) => r.id === recordId);

  if (!record) {
    res.status(404).json({ success: false, message: 'Internship record not found.' });
    return;
  }

  record.status = 'completed';
  record.overallProgress = 100;
  record.completionCertificate = {
    certificateId: `SB-CERT-${Date.now().toString(36).toUpperCase()}`,
    issueDate: new Date().toISOString().split('T')[0],
    verificationCode: `VERIFY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    gradeOrPerformance: grade || 'Grade A+ (Distinction)',
    disclaimer: 'This is a digital record generated through the SkillBridge India portal based on mentor evaluations. It is distinct from statutory academic degree credits.'
  };

  db.save();

  res.json({
    success: true,
    message: 'Internship completion authorized and digital certificate issued.',
    record
  });
});

export default router;
