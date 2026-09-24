import React, { useState } from 'react';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { GraduationCap, Building2, BookOpen, School, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'industry' | 'faculty' | 'institution'>('student');

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#252B32] tracking-tight">
            How SkillBridge India Works
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Operational workflows designed for each stakeholder in the higher education and industrial ecosystem.
          </p>
        </div>

        {/* Stakeholder Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-[#F2EFE9] border border-[#E5E1D9] rounded-md">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'student'
                  ? 'bg-[#245C56] text-white shadow-xs'
                  : 'text-[#5C6470] hover:text-[#252B32]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Workflow
            </button>
            <button
              onClick={() => setActiveTab('industry')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'industry'
                  ? 'bg-[#245C56] text-white shadow-xs'
                  : 'text-[#5C6470] hover:text-[#252B32]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Industry Workflow
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'faculty'
                  ? 'bg-[#245C56] text-white shadow-xs'
                  : 'text-[#5C6470] hover:text-[#252B32]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Faculty Workflow
            </button>
            <button
              onClick={() => setActiveTab('institution')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'institution'
                  ? 'bg-[#245C56] text-white shadow-xs'
                  : 'text-[#5C6470] hover:text-[#252B32]'
              }`}
            >
              <School className="w-4 h-4" />
              Institution Workflow
            </button>
          </div>
        </div>

        {/* Dynamic Workflow View */}
        <div className="bg-white rounded-md border border-[#E5E1D9] p-6 sm:p-8 shadow-xs">
          {activeTab === 'student' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5E1D9] pb-3">
                <h2 className="text-lg font-bold text-[#252B32]">Student Journey: Assessment to Verified Credential</h2>
                <p className="text-xs text-[#667085] mt-0.5">A transparent progression from diagnostic testing to career placements.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#245C56] uppercase tracking-wider">Step 01</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Diagnostic Assessment</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Complete standardized assessments covering DSA, web architectures, analytical aptitude, and core fundamentals.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#245C56] uppercase tracking-wider">Step 02</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Skill Gap Mapping</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Inspect personal radar analysis benchmarked against live industry criteria, pinpointing precise deficits.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#245C56] uppercase tracking-wider">Step 03</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Direct Applications</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Submit applications to verified openings where your profile score satisfies employer benchmark thresholds.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#245C56] uppercase tracking-wider">Step 04</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Verified Credential</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Record weekly milestone logs, receive employer evaluations, and export official verified portfolio credentials.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/student/assessment"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#245C56] hover:bg-[#1B4742] text-white text-xs font-medium transition-colors"
                >
                  Start Diagnostic Assessment <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'industry' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5E1D9] pb-3">
                <h2 className="text-lg font-bold text-[#252B32]">Industry Journey: Candidate Discovery to Certification</h2>
                <p className="text-xs text-[#667085] mt-0.5">Streamlined technical recruitment backed by verified academic profiles.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#B96D4D] uppercase tracking-wider">Step 01</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Post Opportunity</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Publish internships or full-time roles specifying required competencies and weighting priorities.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#B96D4D] uppercase tracking-wider">Step 02</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Screen Candidates</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Review pre-ranked applicants with transparent skill scores, bypassing manual resume filtering.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#B96D4D] uppercase tracking-wider">Step 03</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Manage Pipeline</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Shortlist, interview, and select candidates using structured candidate management tables.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#B96D4D] uppercase tracking-wider">Step 04</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Mentor & Validate</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Review weekly student logs and issue authenticated internship performance ratings.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#B96D4D] hover:bg-[#A35D3F] text-white text-xs font-medium transition-colors"
                >
                  Post Opportunity as Industry <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5E1D9] pb-3">
                <h2 className="text-lg font-bold text-[#252B32]">Faculty Journey: Bilateral Research & Professional Upskilling</h2>
                <p className="text-xs text-[#667085] mt-0.5">Bridging academic theory with live industrial research agendas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#2E6B4A] uppercase tracking-wider">Step 01</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Explore Demands</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Identify corporate technical problem statements seeking academic consultancy and co-investigation.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#2E6B4A] uppercase tracking-wider">Step 02</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Submit Joint MoUs</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Draft bilateral research proposals, patent collaborations, and industry-sponsored lab frameworks.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#2E6B4A] uppercase tracking-wider">Step 03</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">FDP Enrollment</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Participate in corporate-led Faculty Development Programs in semiconductors, AI, and cloud architecture.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#2E6B4A] uppercase tracking-wider">Step 04</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Curriculum Updates</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Infuse university syllabi with real industrial case studies and employer project briefs.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/collaboration"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#245C56] hover:bg-[#1B4742] text-white text-xs font-medium transition-colors"
                >
                  Propose Collaboration <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'institution' && (
            <div className="space-y-6">
              <div className="border-b border-[#E5E1D9] pb-3">
                <h2 className="text-lg font-bold text-[#252B32]">Institution Journey: Institutional Governance & Accreditation</h2>
                <p className="text-xs text-[#667085] mt-0.5">Empowering directors and deans with actionable skill readiness metrics.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#2C4A6F] uppercase tracking-wider">Step 01</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Cohort Onboarding</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Integrate student batches and departments directly with unique AISHE identification.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#2C4A6F] uppercase tracking-wider">Step 02</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Monitor Readiness</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Track real-time placement readiness scores and department-level competency deficits.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#2C4A6F] uppercase tracking-wider">Step 03</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Accreditation Audit</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Export verified internship milestone logs for NAAC, NIRF, and AICTE compliance reports.
                  </p>
                </div>
                <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
                  <div className="text-[10px] font-semibold text-[#2C4A6F] uppercase tracking-wider">Step 04</div>
                  <h3 className="font-semibold text-[#252B32] text-xs mt-1">Expand MoUs</h3>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Sign bilateral industry partnerships and sponsor technology centers of excellence.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/institution/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#245C56] hover:bg-[#1B4742] text-white text-xs font-medium transition-colors"
                >
                  View Institutional Analytics <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <GovFooter />
    </div>
  );
};
