import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { MatchScoreMeter } from '../../components/common/MatchScoreMeter';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Sparkles,
  TrendingUp,
  FileCheck2,
  Briefcase,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.getAnalyticsOverview(),
      api.getRecommendations()
    ])
      .then(([analyticsRes, recRes]) => {
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
        if (recRes.success) setRecommendations(recRes.recommendations.slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout
      allowedRoles={['student']}
      title={`Welcome back, ${user?.name}`}
      subtitle="Track your verified skill readiness, application pipeline, and AI-recommended opportunities."
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Loading student dashboard analytics...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top 4 Quick Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Portfolio Completion</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.portfolioCompletion || 85}%
              </div>
              <div className="w-full bg-warm-border/60 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-teal-700 h-full rounded-full"
                  style={{ width: `${analytics?.portfolioCompletion || 85}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Assessed Skills</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.totalSkills || 8}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">
                <span className="text-teal-800 font-semibold">{analytics?.verifiedSkills || 4} verified</span> by audit
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Active Applications</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.activeApplicationsCount || 2}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">
                <span className="text-terracotta-700 font-semibold">{analytics?.shortlistedCount || 1} shortlisted</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Internship Progress</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.internshipProgress || 40}%
              </div>
              <div className="text-[11px] text-warm-muted truncate mt-1.5">
                {analytics?.activeInternshipTitle || 'TCS Web Intern'}
              </div>
            </div>
          </div>

          {/* Radar Chart & Assessment CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recharts Skill Radar Chart */}
            <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-warm-border">
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-warm-border">
                <div>
                  <h3 className="font-semibold text-warm-text text-sm">Competency Radar: Student vs Industry Demand</h3>
                  <p className="text-[11px] text-warm-muted mt-0.5">Calculated across verified assessment dimensions</p>
                </div>
                <Link to="/student/analysis" className="text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline">
                  Full Analysis &rarr;
                </Link>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={analytics?.radarSkills || []}>
                    <PolarGrid stroke="#E5E1D9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#667085', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#E5E1D9" />
                    <Radar
                      name="Your Assessed Score"
                      dataKey="studentScore"
                      stroke="#245C56"
                      fill="#245C56"
                      fillOpacity={0.25}
                    />
                    <Radar
                      name="Industry Benchmark"
                      dataKey="benchmark"
                      stroke="#B96D4D"
                      fill="#B96D4D"
                      fillOpacity={0.15}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E1D9',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: '#252B32'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 text-xs text-warm-muted pt-3 border-t border-warm-border">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-teal-700 rounded-full inline-block" />
                  <span className="text-warm-text font-medium">Your Assessed Profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-terracotta-600 rounded-full inline-block" />
                  <span className="text-warm-text font-medium">National Industry Benchmark</span>
                </div>
              </div>
            </div>

            {/* Assessment Quick Callout */}
            <div className="lg:col-span-5 bg-gov-navy text-white p-6 rounded-lg border border-gov-navy-light flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-terracotta-500/20 text-terracotta-200 border border-terracotta-400/30 mb-3">
                  <Target className="w-3 h-3 text-terracotta-300" />
                  Skill Calibration Available
                </div>
                <h3 className="font-semibold text-lg text-white leading-snug">Take Skill Assessment</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Evaluate your proficiency in Algorithms, Modern Web Development, System Architecture,
                  and Workplace Judgment. Scores immediately update your verified profile and recruitment rankings.
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Timed 16-question diagnostic test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant transparent gap percentages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct bridge course suggestions</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/student/assessment"
                  className="w-full block text-center py-2.5 rounded text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-colors"
                >
                  Start Assessment Now &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* AI Recommended Opportunities Section */}
          <div className="bg-white p-6 rounded-lg border border-warm-border">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-warm-border">
              <div>
                <h3 className="font-semibold text-warm-text text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-terracotta-600" />
                  <span>Personalized Opportunities (AI Weighted Matching)</span>
                </h3>
                <p className="text-[11px] text-warm-muted mt-0.5">
                  Opportunities ranked by compatibility with your verified skills and academic branch.
                </p>
              </div>
              <Link to="/student/recommendations" className="text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline">
                View All Recommendations &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-warm-border bg-warm-canvas/40 hover:bg-white hover:border-teal-700/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <StatusBadge status={rec.opportunity.type} />
                      <MatchScoreMeter score={rec.matchScore} size="sm" />
                    </div>
                    <h4 className="font-semibold text-warm-text text-sm line-clamp-1">{rec.opportunity.title}</h4>
                    <div className="text-xs text-warm-muted mt-0.5">{rec.opportunity.companyName}</div>

                    <div className="mt-3 text-[11px] text-warm-muted space-y-0.5">
                      <div>📍 {rec.opportunity.location} ({rec.opportunity.workMode})</div>
                      <div>💰 <strong className="text-warm-text">{rec.opportunity.stipendOrSalary}</strong></div>
                    </div>

                    <div className="mt-3 p-2.5 bg-teal-50/70 rounded border border-teal-200/60 text-[11px] text-teal-950 leading-snug">
                      {rec.matchExplanation}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-warm-border">
                    <Link
                      to="/internships"
                      className="w-full block text-center py-2 rounded text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800 transition-colors"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
