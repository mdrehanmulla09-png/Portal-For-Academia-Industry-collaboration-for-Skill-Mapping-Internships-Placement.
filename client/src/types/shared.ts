export type UserRole = 'student' | 'industry' | 'faculty' | 'institution_admin' | 'platform_admin';

export type OpportunityType = 
  | 'internship' 
  | 'job' 
  | 'apprenticeship' 
  | 'live_project' 
  | 'faculty_internship' 
  | 'industrial_training' 
  | 'fdp' 
  | 'consultancy' 
  | 'research_collaboration' 
  | 'mentorship';

export type WorkMode = 'remote' | 'hybrid' | 'on_site';

export type ApplicationStatus = 
  | 'applied' 
  | 'under_review' 
  | 'shortlisted' 
  | 'interview' 
  | 'selected' 
  | 'rejected' 
  | 'completed';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type SkillProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  institutionName: string;
  institutionId?: string;
  branch: string;
  degree: string;
  graduationYear: number;
  cgpa: number;
  careerInterests: string[];
  skills: {
    skill: string;
    level: SkillProficiencyLevel;
    verified: boolean;
    assessed: boolean;
    source: 'self_reported' | 'assessed' | 'credential_verified';
  }[];
  bio?: string;
  location?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioSlug?: string;
  portfolioCompletionPercentage: number;
}

export interface IndustryProfile {
  id: string;
  userId: string;
  companyName: string;
  cinNumber?: string;
  sector: string;
  website: string;
  headquarters: string;
  description: string;
  verifiedStatus: VerificationStatus;
  logoUrl?: string;
  contactPerson: string;
  contactDesignation: string;
}

export interface FacultyProfile {
  id: string;
  userId: string;
  fullName: string;
  institutionName: string;
  department: string;
  designation: string;
  qualification: string;
  specialization: string[];
  researchAreas: string[];
  experienceYears: number;
  availableForConsultancy: boolean;
  availableForGuestLectures: boolean;
}

export interface InstitutionProfile {
  id: string;
  userId: string;
  institutionName: string;
  aisheCode: string;
  type: 'Central University' | 'State University' | 'IIT' | 'NIT' | 'IIIT' | 'Private University' | 'Autonomous College';
  nirfRank?: number;
  state: string;
  city: string;
  departments: string[];
  placementContact: string;
  placementEmail: string;
  verifiedStatus: VerificationStatus;
}

export interface SkillRequirement {
  skill: string;
  requiredLevel: SkillProficiencyLevel;
  weight: number; // 1 to 5
}

export interface Opportunity {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  type: OpportunityType;
  description: string;
  requiredSkills: SkillRequirement[];
  preferredQualifications: string[];
  location: string;
  workMode: WorkMode;
  duration: string;
  stipendOrSalary: string;
  applicationDeadline: string;
  openings: number;
  eligibility: {
    minCgpa?: number;
    allowedBranches?: string[];
    allowedGradYears?: number[];
  };
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  institutionName: string;
  branch: string;
  opportunityTitle: string;
  companyName: string;
  opportunityType: OpportunityType;
  status: ApplicationStatus;
  appliedDate: string;
  resumeUrl: string;
  skillMatchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  coverLetter?: string;
  timeline: {
    status: ApplicationStatus;
    timestamp: string;
    note?: string;
  }[];
  interviewDate?: string;
  feedback?: string;
}

export interface AssessmentQuestion {
  id: string;
  section: 'technical' | 'soft_skills' | 'aptitude';
  category: string;
  question: string;
  options: string[];
  correctOptionIndex?: number;
  difficulty: SkillProficiencyLevel;
  associatedSkill: string;
}

export interface AssessmentResult {
  id: string;
  studentId: string;
  takenAt: string;
  overallScorePercentage: number;
  sectionScores: {
    technical: number;
    softSkills: number;
    aptitude: number;
  };
  assessedSkills: {
    skill: string;
    level: SkillProficiencyLevel;
    score: number;
  }[];
  strengths: string[];
  areasOfImprovement: string[];
  recommendedCareers: string[];
}

export interface RecommendationResult {
  opportunity: Opportunity;
  matchScore: number;
  compatibilityScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  isEligible: boolean;
  eligibilityIssues: string[];
  recommendedCourses: {
    title: string;
    provider: string;
    skillsCovered: string[];
    duration: string;
    url: string;
  }[];
  matchExplanation: string;
}

export interface LearningProgram {
  id: string;
  title: string;
  provider: string;
  type: 'certification' | 'workshop' | 'fdp' | 'masterclass' | 'industry_challenge';
  skillsCovered: string[];
  eligibility: string;
  duration: string;
  mode: WorkMode;
  deadline: string;
  certificationOffered: boolean;
  description: string;
  enrollmentCount: number;
  targetRole: string;
}

export interface InternshipProgressRecord {
  id: string;
  studentId: string;
  studentName: string;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  mentorName: string;
  mentorEmail: string;
  startDate: string;
  endDate: string;
  overallProgress: number; // percentage
  status: 'ongoing' | 'completed' | 'evaluated';
  weeklyLogs: {
    weekNumber: number;
    weekStartDate: string;
    tasksAccomplished: string;
    challengesFaced: string;
    learnings: string;
    deliverableLink?: string;
    submittedAt: string;
    mentorEvaluation?: {
      rating: number; // 1 to 5
      feedback: string;
      evaluatedAt: string;
      mentorName: string;
    };
  }[];
  completionCertificate?: {
    certificateId: string;
    issueDate: string;
    verificationCode: string;
    gradeOrPerformance: string;
    disclaimer: string;
  };
}

export interface CollaborationProposal {
  id: string;
  title: string;
  proposedByRole: 'faculty' | 'industry';
  proposerId: string;
  proposerName: string;
  proposerOrg: string;
  targetOrgName: string;
  type: 'joint_research' | 'curriculum_design' | 'live_project' | 'guest_lecture' | 'lab_sponsorship' | 'faculty_training';
  domain: string;
  budgetOrFunding?: string;
  objectives: string;
  deliverables: string[];
  expectedDuration: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  submittedDate: string;
  updatedDate: string;
  adminNotes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'recommendation' | 'internship' | 'verification' | 'collaboration' | 'system';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}
