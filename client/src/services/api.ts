import {
  User,
  StudentProfile,
  IndustryProfile,
  FacultyProfile,
  InstitutionProfile,
  Opportunity,
  Application,
  AssessmentQuestion,
  AssessmentResult,
  RecommendationResult,
  LearningProgram,
  InternshipProgressRecord,
  CollaborationProposal,
  NotificationItem,
  UserRole,
  VerificationStatus,
  ApplicationStatus
} from '../types/shared';

const API_BASE = '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('skillbridge_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `API error: ${res.statusText}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  demoLogin: (role: UserRole) =>
    request<{ success: boolean; token: string; user: User }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role })
    }),

  register: (payload: { name: string; email: string; password: string; role: UserRole; phone?: string; profileData?: any }) =>
    request<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () =>
    request<{ success: boolean; user: User; profile: any }>('/auth/me'),

  logout: () => {
    localStorage.removeItem('skillbridge_token');
    return request<{ success: boolean }>('/auth/logout', { method: 'POST' });
  },

  // Opportunities
  getOpportunities: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ success: boolean; total: number; page: number; totalPages: number; opportunities: Opportunity[] }>(
      `/opportunities?${query}`
    );
  },

  getOpportunityById: (id: string) =>
    request<{ success: boolean; opportunity: Opportunity }>(`/opportunities/${id}`),

  createOpportunity: (data: Partial<Opportunity>) =>
    request<{ success: boolean; message: string; opportunity: Opportunity }>('/opportunities', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Applications
  getStudentApplications: () =>
    request<{ success: boolean; applications: Application[] }>('/applications/student'),

  getRecruiterApplicants: () =>
    request<{ success: boolean; applications: Application[] }>('/applications/recruiter'),

  applyForOpportunity: (opportunityId: string, coverLetter?: string, resumeUrl?: string) =>
    request<{ success: boolean; message: string; application: Application }>('/applications', {
      method: 'POST',
      body: JSON.stringify({ opportunityId, coverLetter, resumeUrl })
    }),

  updateApplicationStatus: (id: string, status: ApplicationStatus, note?: string, interviewDate?: string, feedback?: string) =>
    request<{ success: boolean; message: string; application: Application }>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note, interviewDate, feedback })
    }),

  // Recommendations
  getRecommendations: (type?: string) => {
    const query = type ? `?type=${type}` : '';
    return request<{ success: boolean; total: number; studentSkills: any[]; recommendations: RecommendationResult[] }>(
      `/recommendations${query}`
    );
  },

  // Assessments
  getAssessmentQuestions: () =>
    request<{ success: boolean; total: number; questions: AssessmentQuestion[] }>('/assessments/questions'),

  getAssessmentResults: () =>
    request<{ success: boolean; result: AssessmentResult | null; studentProfile: StudentProfile; industryBenchmark: any[] }>(
      '/assessments/my-results'
    ),

  submitAssessment: (answers: Record<string, number>) =>
    request<{ success: boolean; message: string; result: AssessmentResult }>('/assessments/submit', {
      method: 'POST',
      body: JSON.stringify({ answers })
    }),

  // Portfolios
  getMyPortfolio: () =>
    request<{ success: boolean; portfolio: StudentProfile; applications: Application[]; internship?: InternshipProgressRecord }>(
      '/portfolios/me'
    ),

  updateMyPortfolio: (data: Partial<StudentProfile>) =>
    request<{ success: boolean; message: string; portfolio: StudentProfile }>('/portfolios/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  requestCredentialVerification: (data: { credentialTitle: string; issuingAuthority: string; documentUrl?: string; skillName?: string }) =>
    request<{ success: boolean; message: string; request: any }>('/portfolios/request-verification', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getPublicPortfolio: (slug: string) =>
    request<{ success: boolean; portfolio: Partial<StudentProfile> }>(`/portfolios/public/${slug}`),

  // Internships
  getInternshipProgress: () =>
    request<{ success: boolean; record?: InternshipProgressRecord; records?: InternshipProgressRecord[] }>(
      '/internships/progress'
    ),

  submitWeeklyLog: (log: { weekNumber: number; tasksAccomplished: string; challengesFaced?: string; learnings?: string; deliverableLink?: string }) =>
    request<{ success: boolean; message: string; log: any; record: InternshipProgressRecord }>('/internships/weekly-log', {
      method: 'POST',
      body: JSON.stringify(log)
    }),

  submitMentorFeedback: (data: { recordId: string; weekNumber: number; rating: number; feedback: string }) =>
    request<{ success: boolean; message: string; record: InternshipProgressRecord }>('/internships/mentor-feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  completeInternship: (recordId: string, grade?: string) =>
    request<{ success: boolean; message: string; record: InternshipProgressRecord }>('/internships/complete', {
      method: 'POST',
      body: JSON.stringify({ recordId, grade })
    }),

  // Collaborations
  getCollaborations: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ success: boolean; total: number; proposals: CollaborationProposal[] }>(
      `/collaborations?${query}`
    );
  },

  submitCollaboration: (data: Partial<CollaborationProposal>) =>
    request<{ success: boolean; message: string; proposal: CollaborationProposal }>('/collaborations', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateCollaborationStatus: (id: string, status: string, adminNotes?: string) =>
    request<{ success: boolean; message: string; proposal: CollaborationProposal }>(`/collaborations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes })
    }),

  // Learning Programs
  getLearningPrograms: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ success: boolean; total: number; programs: LearningProgram[] }>(
      `/learning?${query}`
    );
  },

  enrollInLearningProgram: (programId: string) =>
    request<{ success: boolean; message: string; program: LearningProgram }>('/learning/enroll', {
      method: 'POST',
      body: JSON.stringify({ programId })
    }),

  // Analytics
  getAnalyticsOverview: () =>
    request<{ success: boolean; role: UserRole; data: any }>('/analytics/overview'),

  // Admin
  getAdminVerifications: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ success: boolean; total: number; requests: any[] }>(`/admin/verifications?${query}`);
  },

  submitVerificationDecision: (id: string, decision: VerificationStatus, remarks?: string) =>
    request<{ success: boolean; message: string; request: any }>(`/admin/verifications/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, remarks })
    }),

  getAdminUsers: () =>
    request<{ success: boolean; total: number; users: User[] }>('/admin/users'),

  // Notifications
  getNotifications: () =>
    request<{ success: boolean; total: number; unreadCount: number; notifications: NotificationItem[] }>('/notifications'),

  markNotificationRead: (id: string) =>
    request<{ success: boolean; notification: NotificationItem }>(`/notifications/${id}/read`, {
      method: 'PATCH'
    }),

  markAllNotificationsRead: () =>
    request<{ success: boolean; message: string }>('/notifications/mark-all-read', {
      method: 'POST'
    })
};
