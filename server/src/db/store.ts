import fs from 'fs';
import path from 'path';
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
  LearningProgram,
  InternshipProgressRecord,
  CollaborationProposal,
  NotificationItem,
  VerificationStatus
} from '../types/shared';

export interface VerificationRequest {
  id: string;
  type: 'organization' | 'student_credential' | 'faculty_affiliation';
  targetId: string;
  targetName: string;
  requesterEmail: string;
  documentUrl?: string;
  details: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  remarks?: string;
}

export interface DatabaseSchema {
  users: User[];
  studentProfiles: StudentProfile[];
  industryProfiles: IndustryProfile[];
  facultyProfiles: FacultyProfile[];
  institutionProfiles: InstitutionProfile[];
  opportunities: Opportunity[];
  applications: Application[];
  assessmentQuestions: AssessmentQuestion[];
  assessmentResults: AssessmentResult[];
  learningPrograms: LearningProgram[];
  internshipProgress: InternshipProgressRecord[];
  collaborationProposals: CollaborationProposal[];
  notifications: NotificationItem[];
  verificationRequests: VerificationRequest[];
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

export class DataStore {
  private data: DatabaseSchema;
  private isMemoryOnly: boolean = false;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn('Could not read persistent db.json, initializing in-memory store', err);
      this.isMemoryOnly = true;
    }

    return {
      users: [],
      studentProfiles: [],
      industryProfiles: [],
      facultyProfiles: [],
      institutionProfiles: [],
      opportunities: [],
      applications: [],
      assessmentQuestions: [],
      assessmentResults: [],
      learningPrograms: [],
      internshipProgress: [],
      collaborationProposals: [],
      notifications: [],
      verificationRequests: []
    };
  }

  public save(): void {
    if (this.isMemoryOnly) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    return this.data[collection];
  }

  public resetWith(initial: DatabaseSchema): void {
    this.data = initial;
    this.save();
  }
}

export const db = new DataStore();
