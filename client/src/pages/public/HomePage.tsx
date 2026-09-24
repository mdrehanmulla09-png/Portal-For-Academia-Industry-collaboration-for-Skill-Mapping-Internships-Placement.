import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Opportunity, LearningProgram } from '../../types/shared';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Briefcase,
  GraduationCap,
  Building2,
  Users,
  Award,
  ArrowRight,
  Shield,
  BookOpen,
  Sparkles
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [featuredOpps, setFeaturedOpps] = useState<Opportunity[]>([]);
  const [featuredPrograms, setFeaturedPrograms] = useState<LearningProgram[]>([]);

  useEffect(() => {
    api.getOpportunities({ limit: '4' })
      .then((res) => { if (res.success) setFeaturedOpps(res.opportunities); })
      .catch(console.error);

    api.getLearningPrograms({ limit: '3' })
      .then((res) => { if (res.success) setFeaturedPrograms(res.programs); })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      {/* 1. Editorial Hero Section */}
      <section className="bg-white border-b border-[#E5E1D9] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F2EFE9] border border-[#E5E1D9] text-[#245C56] text-xs font-medium">
                <Shield className="w-3.5 h-3.5 text-[#B96D4D]" />
                <span>Problem Statement ID: 26044 • Innovation Prototype</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#252B32] tracking-tight leading-[1.18]">
                Connecting Higher Education with Modern Industrial Demand.
              </h1>

              <p className="text-sm sm:text-base text-[#667085] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A unified national digital platform connecting students, academicians, educational
                institutions, and industries. Benchmark skill gaps, access accredited industry training,
                build verified digital portfolios, and secure high-impact internships and placements.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  to="/internships"
                  className="px-4 py-2.5 rounded-md text-xs sm:text-sm font-medium bg-[#245C56] hover:bg-[#1B4742] text-white transition-colors shadow-xs flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Explore Opportunities
                </Link>
                <Link
                  to={user ? '/student/assessment' : '/login'}
                  className="px-4 py-2.5 rounded-md text-xs sm:text-sm font-medium bg-white hover:bg-[#F2EFE9] text-[#252B32] border border-[#D0CBC0] transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#245C56]" />
                  Assess Your Skills
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-md text-xs sm:text-sm font-medium bg-[#B96D4D] hover:bg-[#A35D3F] text-white transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Register as Industry
                </Link>
              </div>

              {/* Evaluator Fast Switcher Banner */}
              <div className="pt-4 border-t border-[#E5E1D9]">
                <div className="text-[11px] text-[#667085] font-medium mb-2">
                  ⚡ <strong>Evaluation Fast Pass:</strong> One-click instant login as any persona:
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                  <button
                    onClick={() => { demoLogin('student'); navigate('/student/dashboard'); }}
                    className="px-2.5 py-1 text-xs rounded-md bg-[#F7F6F2] hover:bg-[#EBF2F1] text-[#245C56] border border-[#CCE0DE] font-medium transition-colors"
                  >
                    Student (Arjun Sharma)
                  </button>
                  <button
                    onClick={() => { demoLogin('industry'); navigate('/industry/dashboard'); }}
                    className="px-2.5 py-1 text-xs rounded-md bg-[#F7F6F2] hover:bg-[#EBF2F1] text-[#245C56] border border-[#CCE0DE] font-medium transition-colors"
                  >
                    Industry (TCS Tech)
                  </button>
                  <button
                    onClick={() => { demoLogin('faculty'); navigate('/faculty/dashboard'); }}
                    className="px-2.5 py-1 text-xs rounded-md bg-[#F7F6F2] hover:bg-[#EBF2F1] text-[#245C56] border border-[#CCE0DE] font-medium transition-colors"
                  >
                    Faculty (Dr. Verma)
                  </button>
                  <button
                    onClick={() => { demoLogin('institution_admin'); navigate('/institution/dashboard'); }}
                    className="px-2.5 py-1 text-xs rounded-md bg-[#F7F6F2] hover:bg-[#EBF2F1] text-[#245C56] border border-[#CCE0DE] font-medium transition-colors"
                  >
                    Institution Admin
                  </button>
                  <button
                    onClick={() => { demoLogin('platform_admin'); navigate('/admin/dashboard'); }}
                    className="px-2.5 py-1 text-xs rounded-md bg-[#F7F6F2] hover:bg-[#EBF2F1] text-[#245C56] border border-[#CCE0DE] font-medium transition-colors"
                  >
                    Platform Admin
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Diagnostic Match Preview */}
            <div className="lg:col-span-5">
              <div className="bg-[#F7F6F2] rounded-lg p-5 border border-[#E5E1D9] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D9]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#245C56] text-white flex items-center justify-center font-bold text-xs">
                      AI
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#252B32]">Skill Compatibility Engine</div>
                      <div className="text-[10px] text-[#667085]">Deterministic Weighted Matcher</div>
                    </div>
                  </div>
                  <span className="text-xs bg-[#EBF2F1] text-[#245C56] font-semibold px-2 py-0.5 rounded border border-[#CCE0DE]">
                    94% Compatible
                  </span>
                </div>

                <div className="space-y-3 bg-white p-4 rounded-md border border-[#E5E1D9]">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-[#8C95A6] tracking-wider">
                      Recommended Opportunity
                    </div>
                    <div className="font-semibold text-[#252B32] text-sm mt-0.5">
                      Full Stack Web Engineering Intern
                    </div>
                    <div className="text-xs text-[#667085]">Tata Consultancy Tech Solutions • Bengaluru (Hybrid)</div>
                  </div>

                  {/* Skill Alignment Badges */}
                  <div>
                    <div className="text-[11px] font-medium text-[#667085] mb-1.5">Skill Alignment:</div>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#F0F5F2] text-[#2E6B4A] border border-[#D1E3D8] font-medium">
                        ✓ React.js (Advanced)
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#F0F5F2] text-[#2E6B4A] border border-[#D1E3D8] font-medium">
                        ✓ Node.js (Advanced)
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#F0F5F2] text-[#2E6B4A] border border-[#D1E3D8] font-medium">
                        ✓ TypeScript (Interm.)
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#FCF6EC] text-[#965814] border border-[#F0DFBE] font-medium">
                        ⚠ Docker (15% Deficit)
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#F7F6F2] border border-[#E5E1D9] text-[11px] text-[#667085] leading-relaxed">
                    <strong>Transparent Criterion:</strong> Candidate exceeds core UI and API benchmarks. Enrolling in the recommended 2-week containerization module bridges the deficit.
                  </div>
                </div>

                <Link
                  to="/skill-development"
                  className="w-full block text-center py-2 rounded-md text-xs font-medium bg-[#245C56] hover:bg-[#1B4742] text-white transition-colors"
                >
                  Explore Skill Diagnostic Assessment &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. National Statistics Data Bar */}
      <section className="bg-[#F7F6F2] border-b border-[#E5E1D9] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-[#E5E1D9]">
            <div className="pt-2 md:pt-0">
              <div className="text-2xl font-bold text-[#252B32]">10,000+</div>
              <div className="text-xs text-[#667085] mt-0.5">Student Portfolios</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl font-bold text-[#245C56]">500+</div>
              <div className="text-xs text-[#667085] mt-0.5">Industry Partners</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl font-bold text-[#B96D4D]">250+</div>
              <div className="text-xs text-[#667085] mt-0.5">Accredited Institutions</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl font-bold text-[#2E6B4A]">92.4%</div>
              <div className="text-xs text-[#667085] mt-0.5">Verified Internship Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (Sequential 4 Steps) */}
      <section className="py-12 bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#252B32]">
              How SkillBridge India Operates
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              A transparent, 4-step pipeline synchronizing academic curricula with live industrial demand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Skill Assessment',
                desc: 'Complete standardized technical and aptitude diagnostics to construct your authenticated competency score.'
              },
              {
                step: '02',
                title: 'Gap Mapping',
                desc: 'Our deterministic weighted model benchmarks your score against verified industry job criteria.'
              },
              {
                step: '03',
                title: 'Apply & Upskill',
                desc: 'Submit direct applications to vetted internship openings and enroll in bridging curriculum tracks.'
              },
              {
                step: '04',
                title: 'Verified Record',
                desc: 'Log weekly milestone reports, obtain mentor evaluations, and earn authenticated digital credentials.'
              }
            ].map((st) => (
              <div key={st.step} className="bg-white p-5 rounded-md border border-[#E5E1D9] shadow-xs">
                <div className="w-8 h-8 rounded bg-[#F2EFE9] text-[#245C56] flex items-center justify-center font-bold text-xs mb-3 border border-[#E5E1D9]">
                  {st.step}
                </div>
                <h3 className="font-semibold text-[#252B32] text-sm mb-1">{st.title}</h3>
                <p className="text-xs text-[#667085] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Four Stakeholders Hub */}
      <section className="py-12 bg-white border-y border-[#E5E1D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#252B32]">
              Unified Portal for All Stakeholders
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Dedicated interfaces tailored for students, recruitment partners, academicians, and institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Student Card */}
            <div className="p-5 rounded-md border border-[#E5E1D9] bg-[#F7F6F2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded bg-[#EBF2F1] text-[#245C56] flex items-center justify-center mb-3">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[#252B32] text-sm mb-2">For Students</h3>
                <ul className="text-xs text-[#667085] space-y-1.5 mb-4">
                  <li>• Objective skill gap diagnosis</li>
                  <li>• Explainable match recommendations</li>
                  <li>• Shareable verified digital portfolio</li>
                  <li>• Structured internship milestone log</li>
                </ul>
              </div>
              <Link
                to="/internships"
                className="text-xs text-[#245C56] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Find Internships &rarr;
              </Link>
            </div>

            {/* Industry Card */}
            <div className="p-5 rounded-md border border-[#E5E1D9] bg-[#F7F6F2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded bg-[#F8F1EE] text-[#B96D4D] flex items-center justify-center mb-3">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[#252B32] text-sm mb-2">For Industry</h3>
                <ul className="text-xs text-[#667085] space-y-1.5 mb-4">
                  <li>• Pre-assessed candidates with scores</li>
                  <li>• Post internships & campus openings</li>
                  <li>• Integrated candidate review table</li>
                  <li>• Mentor interns & issue evaluations</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="text-xs text-[#B96D4D] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Post Opportunities &rarr;
              </Link>
            </div>

            {/* Faculty Card */}
            <div className="p-5 rounded-md border border-[#E5E1D9] bg-[#F7F6F2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded bg-[#F0F5F2] text-[#2E6B4A] flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[#252B32] text-sm mb-2">For Academicians</h3>
                <ul className="text-xs text-[#667085] space-y-1.5 mb-4">
                  <li>• Faculty Development Programs (FDPs)</li>
                  <li>• Joint industry research proposals</li>
                  <li>• Industrial residency partnerships</li>
                  <li>• Guest lectures & consultancy</li>
                </ul>
              </div>
              <Link
                to="/collaboration"
                className="text-xs text-[#2E6B4A] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Propose Collaboration &rarr;
              </Link>
            </div>

            {/* Institution Card */}
            <div className="p-5 rounded-md border border-[#E5E1D9] bg-[#F7F6F2] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded bg-[#F0F4F8] text-[#2C4A6F] flex items-center justify-center mb-3">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[#252B32] text-sm mb-2">For Institutions</h3>
                <ul className="text-xs text-[#667085] space-y-1.5 mb-4">
                  <li>• Department skill gap heatmaps</li>
                  <li>• Placement readiness tracking</li>
                  <li>• NAAC / NIRF audit data exports</li>
                  <li>• Active MoU collaboration pipeline</li>
                </ul>
              </div>
              <Link
                to="/how-it-works"
                className="text-xs text-[#2C4A6F] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Institutional Overview &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Opportunities */}
      <section className="py-12 bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#252B32]">Featured Opportunities</h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Verified internships and graduate openings from leading technology employers.
              </p>
            </div>
            <Link
              to="/internships"
              className="text-xs font-semibold text-[#245C56] hover:underline inline-flex items-center gap-1"
            >
              View All Opportunities &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredOpps.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-md border border-[#E5E1D9] p-5 shadow-xs hover:border-[#D0CBC0] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <StatusBadge status={opp.type} />
                    <span className="text-[10px] text-[#8C95A6]">
                      Deadline: {opp.applicationDeadline}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[#252B32] text-sm leading-snug line-clamp-2">
                    {opp.title}
                  </h3>
                  <div className="text-xs text-[#667085] mt-1 font-medium">{opp.companyName}</div>

                  <div className="mt-3 text-xs text-[#667085] space-y-0.5">
                    <div>📍 {opp.location} ({opp.workMode})</div>
                    <div>💰 <strong className="text-[#252B32]">{opp.stipendOrSalary}</strong></div>
                  </div>

                  {/* Required skills */}
                  <div className="mt-3">
                    <div className="text-[10px] font-semibold text-[#8C95A6] uppercase tracking-wider mb-1">
                      Required Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {opp.requiredSkills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-[#F2EFE9] text-[#5C6470] px-1.5 py-0.5 rounded font-medium"
                        >
                          {s.skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E1D9]">
                  <Link
                    to="/internships"
                    className="w-full block text-center py-1.5 rounded-md text-xs font-medium bg-[#245C56] hover:bg-[#1B4742] text-white transition-colors"
                  >
                    View Details & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Learning Programs */}
      <section className="py-12 bg-white border-t border-[#E5E1D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#252B32]">Accredited Industry Courses</h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Targeted curricula designed by corporate partners to bridge critical skill gaps.
              </p>
            </div>
            <Link
              to="/learning"
              className="text-xs font-semibold text-[#245C56] hover:underline inline-flex items-center gap-1"
            >
              Browse All Programs &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-[#F7F6F2] rounded-md border border-[#E5E1D9] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-semibold uppercase bg-[#EBF2F1] text-[#245C56] border border-[#CCE0DE] px-2 py-0.5 rounded">
                      {prog.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#8C95A6]">{prog.duration}</span>
                  </div>
                  <h3 className="font-semibold text-[#252B32] text-sm leading-snug">{prog.title}</h3>
                  <div className="text-xs text-[#667085] mt-1 font-medium">{prog.provider}</div>
                  <p className="text-xs text-[#667085] mt-2.5 line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {prog.skillsCovered.slice(0, 3).map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-white border border-[#E5E1D9] text-[#5C6470] px-1.5 py-0.5 rounded"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E1D9] flex items-center justify-between">
                  <span className="text-xs text-[#667085]">
                    {prog.enrollmentCount.toLocaleString()} Enrolled
                  </span>
                  <Link
                    to="/learning"
                    className="text-xs font-semibold text-[#245C56] hover:underline"
                  >
                    Register Now &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GovFooter />
    </div>
  );
};
