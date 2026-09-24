import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

import { db } from './db/store';
import { seedDatabase } from './seed/seedData';

import authRoutes from './routes/auth';
import opportunityRoutes from './routes/opportunities';
import applicationRoutes from './routes/applications';
import recommendationRoutes from './routes/recommendations';
import assessmentRoutes from './routes/assessments';
import portfolioRoutes from './routes/portfolios';
import internshipRoutes from './routes/internships';
import collaborationRoutes from './routes/collaborations';
import learningRoutes from './routes/learning';
import analyticsRoutes from './routes/analytics';
import adminRoutes from './routes/admin';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static mock files if needed
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'SkillBridge India API',
    problemStatementId: 26044,
    timestamp: new Date().toISOString(),
    databaseUsersCount: db.get('users').length
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve compiled frontend production build
const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');
app.use(express.static(CLIENT_DIST));

// SPA catch-all fallback for React Router
app.get('*', (req: Request, res: Response) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  }
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Auto-seed if database is empty on start
const existingUsers = db.get('users');
if (!existingUsers || existingUsers.length === 0) {
  console.log('Database empty on first boot. Running auto-seeding...');
  seedDatabase();
}

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`  🇮🇳  SkillBridge India - Academia-Industry Collaboration Portal`);
  console.log(`  Problem Statement ID: 26044`);
  console.log(`  API Server running on: http://localhost:${PORT}`);
  console.log(`================================================================`);
});

export default app;
