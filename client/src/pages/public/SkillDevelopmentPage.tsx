import React from 'react';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Code2,
  Users2,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  BarChart2
} from 'lucide-react';

export const SkillDevelopmentPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2EFE9] border border-[#E5E1D9] text-[#245C56] text-xs font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B96D4D]" />
            National Competency Framework
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#252B32] tracking-tight">
            Standardized Skill Assessment & Gap Diagnosis
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1.5 leading-relaxed">
            Move beyond self-reported claims. Evaluate technical capabilities, workplace soft skills, and analytical aptitude
            against validated industry job competencies.
          </p>
          <div className="mt-5">
            <Link
              to={user ? '/student/assessment' : '/login'}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md text-xs font-medium bg-[#245C56] hover:bg-[#1B4742] text-white transition-colors shadow-xs"
            >
              Take Diagnostic Assessment <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Three Diagnostic Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Dimension 1: Technical */}
          <div className="bg-white rounded-md border border-[#E5E1D9] p-5 shadow-xs">
            <div className="w-8 h-8 rounded bg-[#EBF2F1] text-[#245C56] flex items-center justify-center mb-3">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-[#252B32] text-sm mb-1.5">Technical Competencies</h3>
            <p className="text-xs text-[#667085] leading-relaxed mb-3">
              Standardized problem-solving across core engineering domains:
            </p>
            <ul className="text-xs text-[#667085] space-y-1 font-medium">
              <li>• Data Structures & Algorithms</li>
              <li>• Full Stack Web Engineering</li>
              <li>• Cloud Systems & Containerization</li>
              <li>• Machine Learning & Data Science</li>
              <li>• Relational & Distributed Databases</li>
            </ul>
          </div>

          {/* Dimension 2: Soft Skills */}
          <div className="bg-white rounded-md border border-[#E5E1D9] p-5 shadow-xs">
            <div className="w-8 h-8 rounded bg-[#F8F1EE] text-[#B96D4D] flex items-center justify-center mb-3">
              <Users2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-[#252B32] text-sm mb-1.5">Workplace & Soft Skills</h3>
            <p className="text-xs text-[#667085] leading-relaxed mb-3">
              Situational judgment scenarios evaluating collaborative readiness:
            </p>
            <ul className="text-xs text-[#667085] space-y-1 font-medium">
              <li>• Collaborative Team Escalation</li>
              <li>• Technical Trade-Off Communication</li>
              <li>• Stakeholder Interaction</li>
              <li>• Adaptability to Changing Scope</li>
              <li>• Milestone & Time Accountability</li>
            </ul>
          </div>

          {/* Dimension 3: Aptitude */}
          <div className="bg-white rounded-md border border-[#E5E1D9] p-5 shadow-xs">
            <div className="w-8 h-8 rounded bg-[#F0F5F2] text-[#2E6B4A] flex items-center justify-center mb-3">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-[#252B32] text-sm mb-1.5">Analytical Aptitude</h3>
            <p className="text-xs text-[#667085] leading-relaxed mb-3">
              Evaluating logical reasoning and quantitative capacity:
            </p>
            <ul className="text-xs text-[#667085] space-y-1 font-medium">
              <li>• Deductive & Inductive Reasoning</li>
              <li>• Numerical Scale Computation</li>
              <li>• Cohort Data Interpretation</li>
              <li>• Pattern & Computational Logic</li>
              <li>• Formal Fallacy Detection</li>
            </ul>
          </div>
        </div>

        {/* Explainable Gap Analysis Feature Callout */}
        <div className="bg-white rounded-md border border-[#E5E1D9] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#245C56]">
                <BarChart2 className="w-4 h-4" />
                <span>Deterministic Gap Mapping</span>
              </div>
              <h2 className="text-base font-bold text-[#252B32]">How Skill Gap Analysis Works</h2>
              <p className="text-xs text-[#667085] max-w-xl leading-relaxed">
                Upon completing the diagnostic assessment, the portal generates a multi-axial radar map comparing your tested score
                against live industry requirements, detailing exact deficits and linking bridging courses.
              </p>
            </div>
            <Link
              to={user ? '/student/analysis' : '/login'}
              className="px-4 py-2 rounded-md text-xs font-medium bg-[#F2EFE9] text-[#252B32] border border-[#D0CBC0] hover:bg-[#E5E1D9] transition-colors whitespace-nowrap"
            >
              View Gap Analysis Interface &rarr;
            </Link>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
};
