import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Users,
  Briefcase,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const IndustryDashboard: React.FC = () => {
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
      allowedRoles={['industry']}
      title="Industry Recruitment & Talent Dashboard"
      subtitle={`Enterprise workspace for ${analytics?.companyName || 'Industry Partner'}. Manage candidate funnels, postings, and internship milestones.`}
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Loading talent acquisition analytics...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top 4 Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Active Listings</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.activeListingsCount || 4}
              </div>
              <Link to="/industry/post-opportunity" className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 hover:underline mt-2 inline-block">
                + Post New Role
              </Link>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Total Applicants</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.totalApplicantsCount || 18}
              </div>
              <Link to="/industry/applicants" className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 hover:underline mt-2 inline-block">
                View Candidate Funnel &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Shortlisted Candidates</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.shortlistedCount || 6}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">Ready for technical interviews</div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Offers Accepted</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.selectedCount || 3}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">Active verified interns</div>
            </div>
          </div>

          {/* Charts: Recruitment Funnel & High Demand Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel Pipeline */}
            <div className="bg-white p-6 rounded-lg border border-warm-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-warm-border">
                <h3 className="font-semibold text-warm-text text-sm">Applicant Progression Pipeline</h3>
                <span className="text-[10px] text-warm-muted font-mono uppercase bg-warm-canvas px-2 py-0.5 rounded border border-warm-border">Live Cohort</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.pipelineData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D9" />
                    <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#667085' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#667085' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E1D9',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: '#252B32'
                      }}
                    />
                    <Bar dataKey="count" fill="#245C56" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill Demand Distribution */}
            <div className="bg-white p-6 rounded-lg border border-warm-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-warm-border">
                <h3 className="font-semibold text-warm-text text-sm">In-Demand Technology Frequency</h3>
                <span className="text-[10px] text-warm-muted font-mono uppercase bg-warm-canvas px-2 py-0.5 rounded border border-warm-border">Company Index</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.skillDemand || []} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D9" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#667085' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#667085' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E1D9',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: '#252B32'
                      }}
                    />
                    <Bar dataKey="demandScore" fill="#B96D4D" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="p-6 bg-white rounded-lg border border-warm-border flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-warm-text text-sm">Need to recruit talent for upcoming projects?</h3>
              <p className="text-xs text-warm-muted mt-0.5">
                Publish internships, entry-level jobs, or live student capstones with automated skill compatibility scoring.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/industry/post-opportunity"
                className="px-4 py-2 rounded bg-teal-700 text-xs font-semibold text-white hover:bg-teal-800 transition-colors"
              >
                Post New Opportunity &rarr;
              </Link>
              <Link
                to="/industry/applicants"
                className="px-4 py-2 rounded bg-white border border-warm-border text-xs font-semibold text-warm-text hover:bg-warm-canvas transition-colors"
              >
                Manage Candidates
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
