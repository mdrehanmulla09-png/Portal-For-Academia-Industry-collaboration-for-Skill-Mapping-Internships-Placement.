import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  BookOpen,
  FolderGit2,
  GraduationCap,
  PlusCircle,
  Users,
  Award,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getAnalyticsOverview()
      .then((res) => {
        if (res.success) setAnalytics(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout
      allowedRoles={['faculty']}
      title="Academician & Faculty Interface"
      subtitle={`Faculty command portal for ${analytics?.facultyName || 'Dr. Rajesh Verma'}. Manage joint industry research, FDPs, and guest lecture initiatives.`}
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Loading faculty dashboard...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Active Collaborations</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.activeCollaborations || 2}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">Joint corporate research</div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">FDP Residencies</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.fdpEnrollments || 3}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">AICTE & Industry aligned</div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Consultancy Invites</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.industryConsultancyInvites || 4}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">Active requests</div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Guest Lecture Requests</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.guestLectureRequests || 6}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">Campus invitations</div>
            </div>
          </div>

          {/* Collaborative Proposals Section */}
          <div className="bg-white p-6 rounded-lg border border-warm-border space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-warm-border">
              <div>
                <h3 className="font-semibold text-warm-text text-sm flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-teal-700" />
                  <span>My Submitted Bilateral Collaboration Proposals</span>
                </h3>
                <p className="text-[11px] text-warm-muted mt-0.5">
                  Proposals submitted to industry partners for co-funded research and curriculum modernizations.
                </p>
              </div>

              <Link
                to="/collaboration"
                className="px-4 py-2 rounded bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-white/80" />
                <span>Submit New Proposal</span>
              </Link>
            </div>

            <div className="space-y-3">
              {analytics?.proposalsList && analytics.proposalsList.length > 0 ? (
                analytics.proposalsList.map((p: any) => (
                  <div key={p.id} className="p-4 rounded-lg border border-warm-border bg-warm-canvas/40 hover:bg-white transition-all space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-warm-text text-sm">{p.title}</h4>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="text-warm-muted">
                      Partner: <strong className="text-warm-text">{p.targetOrgName}</strong> • Domain: <strong className="text-warm-text">{p.domain}</strong> • Funding: <strong className="text-warm-text">{p.budgetOrFunding}</strong>
                    </div>
                    <p className="text-warm-muted line-clamp-2 leading-relaxed">{p.objectives}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-warm-muted">
                  No proposals submitted under this account. Click above to submit.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
