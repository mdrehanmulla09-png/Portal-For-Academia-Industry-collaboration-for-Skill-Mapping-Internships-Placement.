import React from 'react';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { Shield, Target } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2EFE9] border border-[#E5E1D9] text-[#245C56] text-xs font-medium mb-3">
            <Shield className="w-3.5 h-3.5 text-[#B96D4D]" />
            National Innovation Framework • Problem Statement ID: 26044
          </div>
          <h1 className="text-3xl font-bold text-[#252B32] tracking-tight">
            About SkillBridge India
          </h1>
          <p className="text-sm text-[#667085] mt-2 leading-relaxed">
            Connecting Education, Skills, and Industry through a unified digital infrastructure designed
            to address India's academia-industry alignment challenges.
          </p>
        </div>

        {/* Problem Statement Context Box */}
        <div className="bg-white rounded-md border border-[#E5E1D9] p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="text-base font-bold text-[#252B32] flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#B96D4D]" />
            Context: Problem Statement ID 26044
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
            Every year, millions of higher education graduates emerge from Indian institutions,
            yet industries consistently report critical competency deficits in modern technologies such as
            cloud architecture, applied AI, embedded systems, and practical engineering problem-solving.
            Simultaneously, educational institutions operate without real-time market visibility,
            and academicians encounter structural barriers in establishing industrial research partnerships.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#E5E1D9]">
            <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
              <div className="text-xs font-bold text-[#245C56]">Objective Gap Analysis</div>
              <div className="text-xs text-[#667085] mt-1 leading-relaxed">
                Continuous benchmarking of student competencies against live industry criteria.
              </div>
            </div>
            <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
              <div className="text-xs font-bold text-[#B96D4D]">Verifiable Portfolios</div>
              <div className="text-xs text-[#667085] mt-1 leading-relaxed">
                Tamper-resistant digital profiles clearly distinguishing assessed ability from self-reported claims.
              </div>
            </div>
            <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E5E1D9]">
              <div className="text-xs font-bold text-[#2E6B4A]">Bilateral Research MoUs</div>
              <div className="text-xs text-[#667085] mt-1 leading-relaxed">
                Direct joint proposals, industrial faculty development programs, and guest lecture exchanges.
              </div>
            </div>
          </div>
        </div>

        {/* Four Pillar Architecture */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-bold text-[#252B32]">Four Pillars of the Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-md border border-[#E5E1D9] shadow-xs">
              <h3 className="font-semibold text-[#252B32] text-sm mb-1.5">1. Objective Competency Evaluation</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Rather than relying solely on static resumes, SkillBridge India offers standardized assessments
                across technical fields, soft skills, and analytical aptitude, computing clear confidence levels
                and transparent skill gap percentages.
              </p>
            </div>
            <div className="bg-white p-5 rounded-md border border-[#E5E1D9] shadow-xs">
              <h3 className="font-semibold text-[#252B32] text-sm mb-1.5">2. Explainable Recommendation Engine</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Our recommendation engine uses transparent mathematical weighting to show students exactly why
                opportunities were matched, highlighting missing skills and linking direct courses to close gaps.
              </p>
            </div>
            <div className="bg-white p-5 rounded-md border border-[#E5E1D9] shadow-xs">
              <h3 className="font-semibold text-[#252B32] text-sm mb-1.5">3. End-to-End Internship Tracking</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Internships transition from passive placements to structured learning experiences with weekly milestone
                submissions, industry mentor feedback, and verifiable digital completion credentials.
              </p>
            </div>
            <div className="bg-white p-5 rounded-md border border-[#E5E1D9] shadow-xs">
              <h3 className="font-semibold text-[#252B32] text-sm mb-1.5">4. Institutional Placement Insights</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Deans and placement coordinators gain department-level heatmaps showing specific technology
                shortages, empowering universities to dynamically update curricula based on market demand.
              </p>
            </div>
          </div>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="p-5 rounded-md bg-[#FCF6EC] border border-[#F0DFBE] text-xs text-[#965814] leading-relaxed">
          <strong>Notice Regarding National Evaluation:</strong> This portal has been engineered as a fully
          operational web prototype for Problem Statement ID 26044. All authentication, database records,
          recommendation weighting algorithms, and student workflows are fully functional for evaluators.
        </div>
      </main>

      <GovFooter />
    </div>
  );
};
