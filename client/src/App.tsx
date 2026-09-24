import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { SkillDevelopmentPage } from './pages/public/SkillDevelopmentPage';
import { InternshipsPage } from './pages/public/InternshipsPage';
import { PlacementsPage } from './pages/public/PlacementsPage';
import { LearningProgramsPage } from './pages/public/LearningProgramsPage';
import { CollaborationPage } from './pages/public/CollaborationPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ContactHelpPage } from './pages/public/ContactHelpPage';
import { PublicPortfolioPage } from './pages/public/PublicPortfolioPage';

// Authenticated Pages
import { StudentDashboard } from './pages/authenticated/StudentDashboard';
import { StudentProfilePage } from './pages/authenticated/StudentProfilePage';
import { SkillAssessmentPage } from './pages/authenticated/SkillAssessmentPage';
import { SkillAnalysisPage } from './pages/authenticated/SkillAnalysisPage';
import { RecommendationsPage } from './pages/authenticated/RecommendationsPage';
import { ApplicationTrackingPage } from './pages/authenticated/ApplicationTrackingPage';
import { DigitalPortfolioPage } from './pages/authenticated/DigitalPortfolioPage';
import { InternshipTrackerPage } from './pages/authenticated/InternshipTrackerPage';
import { IndustryDashboard } from './pages/authenticated/IndustryDashboard';
import { RecruiterApplicantsPage } from './pages/authenticated/RecruiterApplicantsPage';
import { PostOpportunityPage } from './pages/authenticated/PostOpportunityPage';
import { FacultyDashboard } from './pages/authenticated/FacultyDashboard';
import { InstitutionDashboard } from './pages/authenticated/InstitutionDashboard';
import { AdminDashboard } from './pages/authenticated/AdminDashboard';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/skill-development" element={<SkillDevelopmentPage />} />
            <Route path="/internships" element={<InternshipsPage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/learning" element={<LearningProgramsPage />} />
            <Route path="/collaboration" element={<CollaborationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactHelpPage />} />
            <Route path="/portfolio/:slug" element={<PublicPortfolioPage />} />

            {/* Student Authenticated Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/assessment" element={<SkillAssessmentPage />} />
            <Route path="/student/analysis" element={<SkillAnalysisPage />} />
            <Route path="/student/recommendations" element={<RecommendationsPage />} />
            <Route path="/student/applications" element={<ApplicationTrackingPage />} />
            <Route path="/student/portfolio" element={<DigitalPortfolioPage />} />
            <Route path="/student/internship-tracker" element={<InternshipTrackerPage />} />

            {/* Industry Authenticated Routes */}
            <Route path="/industry/dashboard" element={<IndustryDashboard />} />
            <Route path="/industry/applicants" element={<RecruiterApplicantsPage />} />
            <Route path="/industry/post-opportunity" element={<PostOpportunityPage />} />
            <Route path="/industry/internship-evaluations" element={<InternshipTrackerPage />} />

            {/* Faculty Authenticated Routes */}
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/proposals" element={<CollaborationPage />} />

            {/* Institution Authenticated Routes */}
            <Route path="/institution/dashboard" element={<InstitutionDashboard />} />
            <Route path="/institution/skill-gaps" element={<InstitutionDashboard />} />
            <Route path="/institution/placement-readiness" element={<InstitutionDashboard />} />

            {/* Admin Authenticated Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/verifications" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
