# SkillBridge India 🇮🇳
### Government of India Academia–Industry Collaboration Portal
**Problem Statement ID:** 26044  
**Tagline:** *Connecting Education, Skills and Industry.*

---

## 📌 Executive Summary

**SkillBridge India** is a national-grade digital collaboration platform engineered to solve the acute misalignment between university curricula and contemporary industrial demand (Problem Statement ID: 26044). 

The platform unifies four key stakeholder groups—**Students**, **Industries/Recruiters**, **Academicians/Faculty**, and **Educational Institutions**—delivering objective skill diagnostic assessments, an explainable weighted opportunity recommendation engine, verified digital student portfolios, structured weekly internship milestone tracking with mentor evaluations, and bilateral research MoUs.

> **Evaluation Notice:** SkillBridge India is developed as a fully functional web platform prototype for national innovation evaluation. It features live authentication, role-based dashboards, transparent algorithms, working forms, and realistic Indian demo data.

---

## 🏛️ System Architecture & Technology Stack

```
skillbridge-india/
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/common/  # GovHeader, GovFooter, RoleSidebar, StatusBadge, MatchScoreMeter
│   │   ├── context/            # AuthContext (with 1-click Demo Switcher), NotificationContext
│   │   ├── pages/public/       # 11 Public Pages (Home, About, How It Works, Catalogs, etc.)
│   │   ├── pages/authenticated/# 13 Role Dashboards & Workflows (Student, Industry, Faculty, Admin)
│   │   └── services/           # api.ts (Centralized REST API client)
├── server/                     # Backend API & AI Recommendation Engine (Express + TypeScript)
│   ├── src/
│   │   ├── db/                 # DataStore (Dual-adapter: Atlas/In-Memory JSON self-bootstrapper)
│   │   ├── middleware/         # RBAC Authorization & JWT Session Verification
│   │   ├── routes/             # REST Endpoints (Auth, Opportunities, Applications, Assessments, etc.)
│   │   ├── services/           # recommendationEngine.ts (Deterministic Weighted Matcher)
│   │   └── seed/               # seedData.ts (Comprehensive pre-seeded Indian demo dataset)
├── shared/                     # Shared TypeScript interfaces & types
└── package.json                # Root orchestration scripts
```

### Frontend Stack
* **Framework:** React.js 18 with TypeScript
* **Build Tool:** Vite 5
* **Styling & UI Kit:** Tailwind CSS with Government of India palette (Navy Blue `#0B2545`, Saffron `#FF671F`, India Green `#046A38`), responsive for desktop, tablet, and mobile
* **Icons:** Lucide React
* **Data Visualization & Charts:** Recharts (Radar charts for skill analysis, Bar charts for pipeline funnels and department gap heatmaps)
* **Routing:** React Router v6
* **Accessibility:** Top toolbar with font resize (A-, A, A+), high-contrast toggle, and multilingual indicators

### Backend Stack
* **Runtime:** Node.js v24 LTS with TypeScript
* **Framework:** Express.js with modular RESTful routing
* **Authentication:** JWT tokens with HTTP-only cookies and Bearer headers, bcryptjs password hashing
* **Role-Based Access Control (RBAC):** Backend middleware guards (`student`, `industry`, `faculty`, `institution_admin`, `platform_admin`)
* **Database & Persistence:** Mongoose / MongoDB architecture with self-bootstrapping fallback store (`db.json`) ensuring instant, zero-friction local testing without mandatory cloud credentials
* **Validation:** Zod schemas & strict type-checking

---

## 🧠 AI Recommendation Engine: Weighted Skill-Matching Model

Unlike black-box recommendation models, SkillBridge India implements an **explainable, transparent mathematical scoring engine**:

$$\text{Skill Match Score} = \sum_{s \in S_{\text{req}}} w_s \cdot \text{Compatibility}(s, S_{\text{student}}) \times \text{TrustMultiplier}$$

### Algorithm Parameters:
1. **Required Technical Competencies:** Each opportunity defines target skills with weights $w_s \in [1, 5]$.
2. **Proficiency Levels:** Beginner ($1$), Intermediate ($2$), Advanced ($3$). If candidate proficiency meets or exceeds requirement, full credit is awarded; otherwise, proportional partial credit is computed.
3. **Verification Trust Multiplier:** Verified credentials receive a $1.0\times$ trust multiplier; unverified self-reported skills receive $0.95\times$.
4. **Eligibility Isolation:** CGPA, Branch of Study, and Graduation Year eligibility are checked independently from skill compatibility to avoid opaque disqualifications.
5. **Explainability Output:** Every recommendation provides:
   - Match percentage (0–100%)
   - List of matching skills
   - List of missing skills (gaps)
   - Direct course recommendations to close identified skill gaps
   - Human-readable natural language justification

---

## 👥 User Roles & Pre-Configured Demo Accounts

SkillBridge India includes an instant **One-Click Evaluator Switcher** on the top bar and Login page:

| Role | Demo Email | Password | Persona & Context |
| :--- | :--- | :--- | :--- |
| **Student** | `student@skillbridge.gov.in` | `password123` | **Arjun Sharma** (IIT Delhi, B.Tech CSE, 8.85 CGPA) |
| **Industry Recruiter** | `industry@skillbridge.gov.in` | `password123` | **Priya Nair** (Tata Consultancy Tech Solutions) |
| **Faculty / Academician** | `faculty@skillbridge.gov.in` | `password123` | **Dr. Rajesh Verma** (Prof & Head of AI, IIT Delhi) |
| **Institution Admin** | `institution@skillbridge.gov.in` | `password123` | **Prof. S. Ramanathan** (Director Placements, NIT Warangal) |
| **Platform Admin** | `admin@skillbridge.gov.in` | `password123` | **National Nodal Officer** (Ministry Level) |

---

## 📋 Comprehensive Page Directory (All 27 Pages Implemented)

### Public Pages
1. **Home / Landing Page** (`/`): Government-style hero, problem statement banner, live statistics counters, 4-step workflow, stakeholder hub, and featured listings.
2. **About the Portal** (`/about`): Problem Statement ID 26044 context, four-pillar architecture, and national impact.
3. **How It Works** (`/how-it-works`): Interactive workflow steppers for Students, Industry, Faculty, and Institutions.
4. **Skill Development** (`/skill-development`): Competency dimensions, confidence levels, and distinction between assessed and verified skills.
5. **Internship Opportunities** (`/internships`): Filterable catalog (Remote/Hybrid/Onsite, Duration, Stipend, Skills) with 1-click apply modal.
6. **Placement Opportunities** (`/placements`): Entry-level graduate jobs, salary ranges, and application modals.
7. **Industry Learning Programs** (`/learning`): Masterclasses, certification bootcamps, and hackathons with instant enrollment.
8. **Academia–Industry Collaboration** (`/collaboration`): Bilateral research proposals showcase and new proposal submission modal.
9. **Login** (`/login`): Standard credentials form + prominent 1-click Evaluator Fast-Pass demo buttons.
10. **Registration** (`/register`): Role-specific onboarding with tailored branch, institution, and corporate CIN fields.
11. **Contact and Help** (`/contact`): Citizen helpdesk, grievance ticketing, and FAQs.
12. **Public Digital Portfolio** (`/portfolio/:slug`): Shareable public student profile with verified credential seals and PDF print layout.

### Authenticated Role Dashboards
13. **Student Dashboard** (`/student/dashboard`): Recharts radar chart, skill readiness index, active applications count, and recommended jobs.
14. **Student Academic Profile** (`/student/profile`): Edit CGPA, graduation year, resume link, and manage self-reported skills.
15. **Skill Assessment Module** (`/student/assessment`): 16-question timed diagnostic test across Technical, Soft Skills, and Aptitude with live timer.
16. **Skill Gap Analysis** (`/student/analysis`): Recharts bar chart comparing student proficiency against industry demand thresholds.
17. **Career Recommendations** (`/student/recommendations`): AI-ranked opportunities with explainable reasoning and bridging courses.
18. **Application Tracking** (`/student/applications`): Visual timeline stepper (Applied → Under Review → Shortlisted → Interview → Selected).
19. **Digital Portfolio Manager** (`/student/portfolio`): Verified credentials manager with institutional verification request modal and share link.
20. **Internship Progress Tracker** (`/student/internship-tracker`): Weekly milestone log submissions, mentor 1-5 star ratings, and digital completion certificate.
21. **Industry Talent Dashboard** (`/industry/dashboard`): Recruitment funnel charts, candidate progression stats, and skill demand frequency graphs.
22. **Recruiter Applicant Management** (`/industry/applicants`): Candidate review with transparent match scores, resume links, and 1-click shortlisting/offer actions.
23. **Post Opportunity** (`/industry/post-opportunity`): Form to publish internships or jobs with weighted skill priorities.
24. **Faculty Dashboard** (`/faculty/dashboard`): Collaborative research tracking, FDP enrollments, and joint research proposals.
25. **Institution Dashboard** (`/institution/dashboard`): Department placement readiness index, campus skill gap deficit heatmap, and exportable audit report.
26. **Platform Admin Dashboard** (`/admin/dashboard`): Organization vetting queue, student credential verification decisions, and user directory.

---

## ⚡ Quick Start & Execution Instructions

### Prerequisites
* **Node.js** (v18+ or v24 LTS recommended)
* **npm** (v9+)

### Installation
From the project root:
```bash
npm run install:all
```
*(Or navigate to `server` and `client` and run `npm install` in each).*

### Database Seeding
To populate the database with the pre-configured Indian demo dataset:
```bash
npm run seed
```

### Running the Application

#### Option A: One-Click Launch (Windows)
Double-click `start.bat` in the project root directory, or run from PowerShell:
```powershell
.\start.ps1
```
This automatically launches both the backend and frontend servers in separate windows and opens your browser directly.

#### Option B: Manual Terminal Launch
Open two terminal windows:

**Terminal 1 (Backend API & AI Engine):**
```bash
npm run server
# Runs Express on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
# Runs Vite dev server on http://localhost:5173
```

Now open **http://localhost:5173** in your web browser.

---

## 🧪 Automated Testing & Verification

A dedicated end-to-end integration test suite is included to verify all core workflows:
```bash
cd server
node testSuite.js
```
The suite automatically validates:
* API health check & Problem Statement ID 26044
* Authentication for all 5 roles
* Opportunity querying & filtering
* Deterministic AI recommendation score computation
* Skill assessment submission & grading
* Privacy-safe public portfolio sanitization
* Student application submission & recruiter shortlisting
* Internship progress logging & mentor feedback
* Admin credential verification approvals

---

## 🌐 Production Deployment Guide

### Frontend (Vercel / Netlify)
1. Set the root directory to `client`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend-api.onrender.com`.

### Backend (Render / AWS EC2 / Railway)
1. Set root directory to `server`.
2. Build command: `npm run build`.
3. Start command: `npm start` (runs `node dist/server.js`).
4. Configure `.env` variables from `.env.example` including `JWT_SECRET` and `CLIENT_ORIGIN`.
5. Connect MongoDB Atlas URI via `MONGODB_URI` environment variable.

---

## 📜 License & Acknowledgments

Engineered for the **Government of India Academia–Industry Collaboration Portal Competition** (Problem Statement ID: 26044). Built with public-sector design ethics, transparent algorithmic explainability, and accessible digital standards.
