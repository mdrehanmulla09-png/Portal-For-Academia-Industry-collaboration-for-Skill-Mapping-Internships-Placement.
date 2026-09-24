import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { api } from '../../services/api';
import { AssessmentResult, StudentProfile } from '../../types/shared';
import { SkillBadge } from '../../components/common/SkillBadge';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle
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

export const SkillAnalysisPage: React.FC = () => {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [industryBenchmark, setIndustryBenchmark] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getAssessmentResults()
      .then((res) => {
        if (res.success) {
          setResult(res.result);
          setStudentProfile(res.studentProfile);
          setIndustryBenchmark(res.industryBenchmark);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout
      allowedRoles={['student']}
      title="Personalized Skill Gap & Proficiency Analysis"
      subtitle="Examine your verified competencies benchmarked against current national industry hiring criteria."
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Compiling assessment and skill gap metrics...
        </div>
      ) : !result ? (
        <div className="bg-white rounded-lg border border-warm-border p-12 text-center space-y-4">
          <Award className="w-12 h-12 text-terracotta-600 mx-auto" />
          <h3 className="font-semibold text-warm-text text-base">No Assessment Records Found</h3>
          <p className="text-xs text-warm-muted max-w-md mx-auto">
            Take the standardized 15-minute diagnostic assessment to generate your transparent skill proficiency chart and gap percentages.
          </p>
          <div>
            <Link
              to="/student/assessment"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800 transition-colors"
            >
              Take Assessment Now &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Score Banner */}
          <div className="bg-white rounded-lg border border-warm-border p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="md:col-span-1 text-center md:text-left border-b md:border-b-0 md:border-r border-warm-border pb-4 md:pb-0 pr-4">
                <div className="text-[11px] text-warm-muted font-semibold uppercase tracking-wider">
                  Overall Readiness Score
                </div>
                <div className="text-4xl font-black text-warm-text mt-1">
                  {result.overallScorePercentage}%
                </div>
                <div className="text-[11px] text-teal-800 font-semibold mt-1">
                  High Industry Compatibility
                </div>
                <div className="text-[10px] text-warm-muted mt-2">
                  Evaluated on {new Date(result.takenAt).toLocaleDateString()}
                </div>
              </div>

              {/* Breakdown by Section */}
              <div className="md:col-span-3 grid grid-cols-3 gap-4 text-center">
                <div className="p-3.5 bg-warm-canvas/50 rounded border border-warm-border">
                  <div className="text-xs font-semibold text-warm-text">Technical Depth</div>
                  <div className="text-xl font-bold text-teal-800 mt-1">
                    {result.sectionScores.technical}%
                  </div>
                  <div className="text-[10px] text-warm-muted mt-0.5">DSA, Web, DB, Cloud</div>
                </div>

                <div className="p-3.5 bg-warm-canvas/50 rounded border border-warm-border">
                  <div className="text-xs font-semibold text-warm-text">Soft Skills</div>
                  <div className="text-xl font-bold text-terracotta-700 mt-1">
                    {result.sectionScores.softSkills}%
                  </div>
                  <div className="text-[10px] text-warm-muted mt-0.5">Teamwork, Adaptability</div>
                </div>

                <div className="p-3.5 bg-warm-canvas/50 rounded border border-warm-border">
                  <div className="text-xs font-semibold text-warm-text">Logical Aptitude</div>
                  <div className="text-xl font-bold text-warm-text mt-1">
                    {result.sectionScores.aptitude}%
                  </div>
                  <div className="text-[10px] text-warm-muted mt-0.5">Reasoning & Computation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Proficiency Comparison Bar Chart */}
          <div className="bg-white p-6 rounded-lg border border-warm-border space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-warm-border pb-3">
              <div>
                <h3 className="font-semibold text-warm-text text-sm">
                  Competency Comparison: Your Assessed Score vs. Industry Hiring Threshold
                </h3>
                <p className="text-[11px] text-warm-muted mt-0.5">
                  Values represent normalized percentage mastery across high-frequency industry skills.
                </p>
              </div>
              <div className="text-[11px] text-warm-muted">
                Benchmark source: National Tech Consortium
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryBenchmark} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D9" />
                  <XAxis dataKey="skill" tick={{ fontSize: 11, fill: '#667085' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#667085' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E1D9',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: '#252B32'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar name="Your Assessed Score" dataKey="studentScore" fill="#245C56" radius={[3, 3, 0, 0]} />
                  <Bar name="Industry Benchmark Requirement" dataKey="requiredScore" fill="#B96D4D" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strengths & Areas of Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white p-6 rounded-lg border border-warm-border space-y-3">
              <div className="flex items-center gap-2 text-teal-900 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                <span>Identified Core Strengths</span>
              </div>
              <p className="text-xs text-warm-muted">Skills where your assessed proficiency exceeds benchmark standards:</p>
              <ul className="space-y-2 text-xs text-warm-text">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="p-3 bg-teal-50/50 rounded border border-teal-200/60 flex items-start gap-2">
                    <span className="text-teal-800 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas of Improvement */}
            <div className="bg-white p-6 rounded-lg border border-warm-border space-y-3">
              <div className="flex items-center gap-2 text-terracotta-900 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-terracotta-600" />
                <span>Targeted Skill Gaps & Areas to Improve</span>
              </div>
              <p className="text-xs text-warm-muted">Deficiencies that can be addressed via targeted micro-courses:</p>
              <ul className="space-y-2 text-xs text-warm-text">
                {result.areasOfImprovement.map((area, idx) => (
                  <li key={idx} className="p-3 bg-terracotta-50/50 rounded border border-terracotta-200/60 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-terracotta-700 font-bold">⚠</span>
                      <span>{area}</span>
                    </div>
                    <Link
                      to="/learning"
                      className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 hover:underline shrink-0"
                    >
                      Find Courses &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Career Paths */}
          <div className="bg-white p-6 rounded-lg border border-warm-border space-y-4">
            <h3 className="font-semibold text-warm-text text-sm">
              Aligned High-Growth Career Pathways
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.recommendedCareers.map((career, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-warm-border bg-warm-canvas/40 hover:bg-white hover:border-teal-700/50 transition-all flex items-center justify-between"
                >
                  <span className="font-semibold text-xs text-warm-text">{career}</span>
                  <Link to="/internships" className="text-xs text-teal-800 font-semibold hover:text-teal-950 hover:underline">
                    View Jobs &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
