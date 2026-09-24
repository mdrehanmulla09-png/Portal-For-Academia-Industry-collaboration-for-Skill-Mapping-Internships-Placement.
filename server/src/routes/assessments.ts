import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { AssessmentResult, SkillProficiencyLevel } from '../types/shared';

const router = Router();

// GET /api/assessments/questions - Get assessment questions
router.get('/questions', (req: Request, res: Response): void => {
  const questions = db.get('assessmentQuestions');
  // Don't expose correct answers to the client directly
  const sanitized = questions.map(({ correctOptionIndex, ...rest }) => rest);

  res.json({
    success: true,
    total: sanitized.length,
    questions: sanitized
  });
});

// GET /api/assessments/my-results - Get latest assessment result and skill gap analysis
router.get('/my-results', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Only students can access assessment results.' });
    return;
  }

  const results = db.get('assessmentResults').filter((r) => r.studentId === req.user?.userId);
  const latest = results[results.length - 1] || null;
  const student = db.get('studentProfiles').find((s) => s.userId === req.user?.userId);

  // Calculate industry benchmark gap for student
  const industryBenchmark = [
    { skill: 'React.js', requiredScore: 85, studentScore: student?.skills.find((s) => s.skill.includes('React'))?.level === 'advanced' ? 95 : 70 },
    { skill: 'Node.js', requiredScore: 80, studentScore: student?.skills.find((s) => s.skill.includes('Node'))?.level === 'advanced' ? 90 : 65 },
    { skill: 'TypeScript', requiredScore: 75, studentScore: student?.skills.find((s) => s.skill.includes('TypeScript'))?.level === 'intermediate' ? 80 : 50 },
    { skill: 'SQL & Database Design', requiredScore: 80, studentScore: student?.skills.find((s) => s.skill.includes('SQL'))?.level === 'intermediate' ? 80 : 45 },
    { skill: 'Docker & Kubernetes', requiredScore: 75, studentScore: student?.skills.find((s) => s.skill.includes('Docker'))?.level === 'intermediate' ? 70 : 40 },
    { skill: 'Problem Solving & DSA', requiredScore: 85, studentScore: student?.skills.find((s) => s.skill.includes('DSA'))?.level === 'advanced' ? 92 : 60 }
  ];

  res.json({
    success: true,
    result: latest,
    studentProfile: student,
    industryBenchmark
  });
});

// POST /api/assessments/submit - Submit answers and compute verified skill score
router.post('/submit', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({ success: false, message: 'Only students can submit assessments.' });
    return;
  }

  const { answers } = req.body as { answers: Record<string, number> }; // questionId -> selectedOptionIndex

  if (!answers || Object.keys(answers).length === 0) {
    res.status(400).json({ success: false, message: 'No assessment answers provided.' });
    return;
  }

  const questions = db.get('assessmentQuestions');
  let technicalCorrect = 0;
  let technicalTotal = 0;
  let softCorrect = 0;
  let softTotal = 0;
  let aptitudeCorrect = 0;
  let aptitudeTotal = 0;

  const skillScoreMap: Record<string, { correct: number; total: number }> = {};

  for (const q of questions) {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctOptionIndex;

    if (!skillScoreMap[q.associatedSkill]) {
      skillScoreMap[q.associatedSkill] = { correct: 0, total: 0 };
    }
    skillScoreMap[q.associatedSkill].total += 1;
    if (isCorrect) skillScoreMap[q.associatedSkill].correct += 1;

    if (q.section === 'technical') {
      technicalTotal += 1;
      if (isCorrect) technicalCorrect += 1;
    } else if (q.section === 'soft_skills') {
      softTotal += 1;
      if (isCorrect) softCorrect += 1;
    } else if (q.section === 'aptitude') {
      aptitudeTotal += 1;
      if (isCorrect) aptitudeCorrect += 1;
    }
  }

  const techScore = technicalTotal > 0 ? Math.round((technicalCorrect / technicalTotal) * 100) : 80;
  const softScore = softTotal > 0 ? Math.round((softCorrect / softTotal) * 100) : 85;
  const aptScore = aptitudeTotal > 0 ? Math.round((aptitudeCorrect / aptitudeTotal) * 100) : 85;
  const overall = Math.round((techScore * 0.5) + (softScore * 0.25) + (aptScore * 0.25));

  const assessedSkills = Object.entries(skillScoreMap).map(([skill, stat]) => {
    const percentage = Math.round((stat.correct / stat.total) * 100);
    let level: SkillProficiencyLevel = 'beginner';
    if (percentage >= 80) level = 'advanced';
    else if (percentage >= 50) level = 'intermediate';

    return {
      skill,
      level,
      score: percentage
    };
  });

  const strengths = assessedSkills.filter((s) => s.level === 'advanced').map((s) => s.skill);
  const areasOfImprovement = assessedSkills.filter((s) => s.level === 'beginner').map((s) => s.skill);

  const newResult: AssessmentResult = {
    id: `res-${Date.now()}`,
    studentId: req.user.userId,
    takenAt: new Date().toISOString(),
    overallScorePercentage: overall,
    sectionScores: {
      technical: techScore,
      softSkills: softScore,
      aptitude: aptScore
    },
    assessedSkills,
    strengths: strengths.length > 0 ? strengths : ['General Technical Fundamentals'],
    areasOfImprovement: areasOfImprovement.length > 0 ? areasOfImprovement : ['Advanced Cloud Optimization'],
    recommendedCareers: [
      overall >= 80 ? 'Full Stack Software Engineer' : 'Junior Web Developer',
      techScore >= 80 ? 'Backend Systems Specialist' : 'Quality Assurance Analyst',
      aptScore >= 80 ? 'Data & Analytics Engineer' : 'Technical Support Engineer'
    ]
  };

  const results = db.get('assessmentResults');
  results.push(newResult);

  // Update student profile skills with 'assessed' status
  const studentProfiles = db.get('studentProfiles');
  const student = studentProfiles.find((s) => s.userId === req.user?.userId);
  if (student) {
    for (const evaluated of assessedSkills) {
      const existing = student.skills.find((s) => s.skill.toLowerCase() === evaluated.skill.toLowerCase());
      if (existing) {
        existing.level = evaluated.level;
        existing.assessed = true;
        if (!existing.verified) existing.source = 'assessed';
      } else {
        student.skills.push({
          skill: evaluated.skill,
          level: evaluated.level,
          verified: false,
          assessed: true,
          source: 'assessed'
        });
      }
    }
    student.portfolioCompletionPercentage = Math.min(100, student.portfolioCompletionPercentage + 15);
  }

  // Add notification
  const notifications = db.get('notifications');
  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: req.user.userId,
    title: 'Skill Assessment Completed',
    message: `Assessment evaluated! Overall readiness score: ${overall}%. Your skill profile and recommended opportunities have been updated.`,
    type: 'system',
    isRead: false,
    createdAt: new Date().toISOString(),
    linkUrl: '/skill-analysis'
  });

  db.save();

  res.status(201).json({
    success: true,
    message: 'Assessment evaluated successfully.',
    result: newResult
  });
});

export default router;
