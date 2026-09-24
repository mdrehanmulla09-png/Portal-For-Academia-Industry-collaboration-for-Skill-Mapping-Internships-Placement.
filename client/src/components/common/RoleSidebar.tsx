import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  FileCheck2,
  BarChart3,
  Sparkles,
  Briefcase,
  Layers,
  FileText,
  Clock,
  BookOpen,
  PlusCircle,
  Users,
  CheckSquare,
  School,
  Building2,
  ShieldCheck,
  History,
  FolderGit2
} from 'lucide-react';

export const RoleSidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
      isActive
        ? 'bg-[#245C56] text-white'
        : 'text-[#5C6470] hover:text-[#252B32] hover:bg-[#F2EFE9]'
    }`;

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-[#E5E1D9] min-h-[calc(100vh-100px)] p-4 flex flex-col justify-between no-print">
      <div className="space-y-6">
        {/* Active Workspace Persona Banner */}
        <div className="p-3 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
          <div className="text-[10px] uppercase font-semibold text-[#8C95A6] tracking-wider">
            Workspace
          </div>
          <div className="font-semibold text-[#252B32] text-xs capitalize mt-0.5">
            {role.replace('_', ' ')}
          </div>
          <div className="text-[11px] text-[#667085] truncate mt-0.5">{user.name}</div>
        </div>

        {/* STUDENT NAV */}
        {role === 'student' && (
          <nav className="space-y-1">
            <div className="text-[10px] font-semibold text-[#8C95A6] uppercase tracking-wider px-3 pb-1">
              Core Hub
            </div>
            <NavLink to="/student/dashboard" className={navItemClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/student/profile" className={navItemClass}>
              <UserCheck className="w-4 h-4" />
              <span>Academic Profile</span>
            </NavLink>
            <NavLink to="/student/assessment" className={navItemClass}>
              <FileCheck2 className="w-4 h-4" />
              <span>Skill Assessment</span>
            </NavLink>
            <NavLink to="/student/analysis" className={navItemClass}>
              <BarChart3 className="w-4 h-4" />
              <span>Skill Gap Analysis</span>
            </NavLink>
            <NavLink to="/student/recommendations" className={navItemClass}>
              <Sparkles className="w-4 h-4 text-[#B96D4D]" />
              <span>AI Recommendations</span>
            </NavLink>

            <div className="text-[10px] font-semibold text-[#8C95A6] uppercase tracking-wider px-3 pt-3 pb-1">
              Opportunities & Work
            </div>
            <NavLink to="/internships" className={navItemClass}>
              <Briefcase className="w-4 h-4" />
              <span>Find Internships</span>
            </NavLink>
            <NavLink to="/placements" className={navItemClass}>
              <Layers className="w-4 h-4" />
              <span>Graduate Placements</span>
            </NavLink>
            <NavLink to="/student/applications" className={navItemClass}>
              <History className="w-4 h-4" />
              <span>My Applications</span>
            </NavLink>
            <NavLink to="/student/portfolio" className={navItemClass}>
              <FileText className="w-4 h-4" />
              <span>Digital Portfolio</span>
            </NavLink>
            <NavLink to="/student/internship-tracker" className={navItemClass}>
              <Clock className="w-4 h-4" />
              <span>Internship Progress</span>
            </NavLink>
            <NavLink to="/learning" className={navItemClass}>
              <BookOpen className="w-4 h-4" />
              <span>Learning Programs</span>
            </NavLink>
          </nav>
        )}

        {/* INDUSTRY NAV */}
        {role === 'industry' && (
          <nav className="space-y-1">
            <div className="text-[10px] font-semibold text-[#8C95A6] uppercase tracking-wider px-3 pb-1">
              Recruitment Suite
            </div>
            <NavLink to="/industry/dashboard" className={navItemClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Talent Dashboard</span>
            </NavLink>
            <NavLink to="/industry/post-opportunity" className={navItemClass}>
              <PlusCircle className="w-4 h-4" />
              <span>Post Opportunity</span>
            </NavLink>
            <NavLink to="/industry/applicants" className={navItemClass}>
              <Users className="w-4 h-4" />
              <span>Applicant Pipeline</span>
            </NavLink>
            <NavLink to="/industry/internship-evaluations" className={navItemClass}>
              <CheckSquare className="w-4 h-4" />
              <span>Internship Mentorship</span>
            </NavLink>
            <NavLink to="/collaboration" className={navItemClass}>
              <FolderGit2 className="w-4 h-4" />
              <span>Campus Collaborations</span>
            </NavLink>
          </nav>
        )}

        {/* FACULTY NAV */}
        {role === 'faculty' && (
          <nav className="space-y-1">
            <div className="text-[10px] font-semibold text-[#8C95A6] uppercase tracking-wider px-3 pb-1">
              Academic Interface
            </div>
            <NavLink to="/faculty/dashboard" className={navItemClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Faculty Dashboard</span>
            </NavLink>
            <NavLink to="/faculty/proposals" className={navItemClass}>
              <PlusCircle className="w-4 h-4" />
              <span>Propose Collaboration</span>
            </NavLink>
            <NavLink to="/learning?type=fdp" className={navItemClass}>
              <BookOpen className="w-4 h-4" />
              <span>Faculty Dev (FDP)</span>
            </NavLink>
            <NavLink to="/collaboration" className={navItemClass}>
              <FolderGit2 className="w-4 h-4" />
              <span>Industry Partnerships</span>
            </NavLink>
          </nav>
        )}

        {/* INSTITUTION ADMIN NAV */}
        {role === 'institution_admin' && (
          <nav className="space-y-1">
            <div className="text-[10px] font-semibold text-[#8C95A6] uppercase tracking-wider px-3 pb-1">
              Institutional Command
            </div>
            <NavLink to="/institution/dashboard" className={navItemClass}>
              <School className="w-4 h-4" />
              <span>Institution Analytics</span>
            </NavLink>
            <NavLink to="/institution/skill-gaps" className={navItemClass}>
              <BarChart3 className="w-4 h-4" />
              <span>Department Skill Gaps</span>
            </NavLink>
            <NavLink to="/institution/placement-readiness" className={navItemClass}>
              <Layers className="w-4 h-4" />
              <span>Placement Readiness</span>
            </NavLink>
            <NavLink to="/collaboration" className={navItemClass}>
              <FolderGit2 className="w-4 h-4" />
              <span>MoU Collaborations</span>
            </NavLink>
          </nav>
        )}

        {/* PLATFORM ADMIN NAV */}
        {role === 'platform_admin' && (
          <nav className="space-y-1">
            <div className="text-[10px] font-semibold text-[#8C95A6] uppercase tracking-wider px-3 pb-1">
              Platform Governance
            </div>
            <NavLink to="/admin/dashboard" className={navItemClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Overview</span>
            </NavLink>
            <NavLink to="/admin/verifications" className={navItemClass}>
              <ShieldCheck className="w-4 h-4 text-[#B96D4D]" />
              <span>Verifications Queue</span>
            </NavLink>
            <NavLink to="/admin/users" className={navItemClass}>
              <Users className="w-4 h-4" />
              <span>User Directory</span>
            </NavLink>
            <NavLink to="/collaboration" className={navItemClass}>
              <Building2 className="w-4 h-4" />
              <span>Platform Partnerships</span>
            </NavLink>
          </nav>
        )}
      </div>

      {/* Quick Help Box */}
      <div className="p-3 bg-[#F2EFE9] rounded-md border border-[#E5E1D9] text-xs text-[#252B32]">
        <div className="font-medium flex items-center gap-1.5 text-[#245C56]">
          <Building2 className="w-3.5 h-3.5" />
          <span>Support Desk</span>
        </div>
        <p className="text-[11px] text-[#667085] mt-1">
          Toll-Free: 1800-11-26044
        </p>
      </div>
    </aside>
  );
};
