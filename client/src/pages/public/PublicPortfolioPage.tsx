import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { api } from '../../services/api';
import { StudentProfile } from '../../types/shared';
import { SkillBadge } from '../../components/common/SkillBadge';
import {
  GraduationCap,
  Award,
  CheckCircle,
  Printer,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { DigiLockerAccount } from '../../components/common/DigiLockerDemoModal';

export const PublicPortfolioPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<Partial<StudentProfile> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [digiLockerAccount] = useState<DigiLockerAccount | null>(() => {
    try {
      const saved = localStorage.getItem('skillbridge_digilocker_demo');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getPublicPortfolio(slug)
      .then((res) => {
        if (res.success) {
          setProfile(res.portfolio);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
        <GovHeader />
        <div className="flex-1 flex items-center justify-center p-8 text-xs text-[#667085] font-medium">
          Loading digital student portfolio...
        </div>
        <GovFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
        <GovHeader />
        <div className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center text-center p-6">
          <FileText className="w-10 h-10 text-[#8C95A6] mb-2" />
          <h2 className="text-base font-bold text-[#252B32]">Portfolio Not Found</h2>
          <p className="text-xs text-[#667085] mt-1">The requested public portfolio slug does not exist or has been made private.</p>
          <Link to="/" className="mt-3 text-xs font-semibold text-[#245C56] hover:underline">Return to Home</Link>
        </div>
        <GovFooter />
      </div>
    );
  }

  const verifiedSkills = profile.skills?.filter((s) => s.verified) || [];
  const assessedSkills = profile.skills?.filter((s) => s.assessed && !s.verified) || [];
  const selfReportedSkills = profile.skills?.filter((s) => !s.verified && !s.assessed) || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Print Bar */}
        <div className="no-print flex items-center justify-between pb-3 mb-6 border-b border-[#E5E1D9]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-[#F0F5F2] text-[#2E6B4A] border border-[#D1E3D8] px-2.5 py-0.5 rounded font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified Public Digital Record
            </span>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#D0CBC0] bg-white text-xs font-medium text-[#252B32] hover:bg-[#F2EFE9] shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print PDF</span>
          </button>
        </div>

        {/* Portfolio Document Container */}
        <div className="bg-white rounded-md border border-[#E5E1D9] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Profile Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E1D9]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-md bg-[#245C56] text-white flex items-center justify-center font-bold text-lg">
                {profile.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-[#252B32]">{profile.fullName}</h1>
                  {digiLockerAccount?.connected && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#004085] bg-[#004085]/10 border border-[#004085]/30 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3 text-[#004085]" />
                      DigiLocker Verified (Demo)
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#667085] flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#8C95A6]" />
                  <span>{profile.branch} • {profile.institutionName}</span>
                </div>
                <div className="text-[11px] text-[#8C95A6] mt-0.5">
                  Institutional ID: <code>{(profile as any).aisheId || profile.institutionId || 'U-0109-IITD'}</code> • Batch {profile.graduationYear}
                </div>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-[#E5E1D9] sm:pl-4">
              <div className="text-[10px] uppercase font-semibold text-[#8C95A6] tracking-wider">
                Overall Diagnostic Score
              </div>
              <div className="text-2xl font-bold text-[#245C56] mt-0.5">
                {profile.portfolioCompletionPercentage ? `${Math.round(profile.portfolioCompletionPercentage)}%` : '88%'}
              </div>
              <div className="text-[10px] text-[#2E6B4A] font-medium">Top 5% Cohort Percentile</div>
            </div>
          </div>

          {/* Bio / Objective */}
          {profile.bio && (
            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#8C95A6] mb-1">
                Candidate Statement
              </h2>
              <p className="text-xs text-[#667085] leading-relaxed bg-[#F7F6F2] p-3 rounded-md border border-[#E5E1D9]">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Verified Credentials & Skills Breakdown */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#8C95A6]">
              Assessed & Audited Skill Competencies
            </h2>

            {/* 1. Institutionally Verified */}
            {verifiedSkills.length > 0 && (
              <div className="p-3.5 rounded-md bg-[#F0F5F2] border border-[#D1E3D8] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E6B4A]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Institutionally Audited & Verified Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {verifiedSkills.map((s, idx) => (
                    <SkillBadge
                      key={idx}
                      skill={s.skill}
                      level={s.level}
                      verified={true}
                      source={s.source}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2. Platform Assessed */}
            {assessedSkills.length > 0 && (
              <div className="p-3.5 rounded-md bg-[#EBF2F1] border border-[#CCE0DE] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#245C56]">
                  <Award className="w-3.5 h-3.5" />
                  <span>Platform Diagnostic Assessed Competencies</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {assessedSkills.map((s, idx) => (
                    <SkillBadge
                      key={idx}
                      skill={s.skill}
                      level={s.level}
                      assessed={true}
                      source={s.source}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3. Self-reported */}
            {selfReportedSkills.length > 0 && (
              <div className="p-3.5 rounded-md bg-[#F7F6F2] border border-[#E5E1D9] space-y-1.5">
                <div className="text-xs font-semibold text-[#667085]">
                  Self-Reported Proficiencies
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selfReportedSkills.map((s, idx) => (
                    <SkillBadge
                      key={idx}
                      skill={s.skill}
                      level={s.level}
                      source="self_reported"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DigiLocker Authenticated Documents (Demo Simulation) */}
          {digiLockerAccount?.connected && (
            <div className="space-y-3 pt-3 border-t border-[#E5E1D9]">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#8C95A6] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#245C56]" />
                  <span>DigiLocker Authenticated Documents (Demo Simulation)</span>
                </h2>
                <span className="text-[9px] font-mono text-[#004085] bg-[#004085]/10 px-2 py-0.5 rounded border border-[#004085]/20 font-semibold">
                  NAD Registry Linked
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {digiLockerAccount.documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-md border border-[#E5E1D9] bg-[#F7F6F2] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-[#245C56] bg-white border border-[#E5E1D9] px-1.5 py-0.2 rounded">
                        Verified
                      </span>
                      <span className="text-[10px] font-mono text-[#8C95A6]">{doc.issuedYear}</span>
                    </div>
                    <div className="font-semibold text-xs text-[#252B32]">{doc.title}</div>
                    <div className="text-[10px] text-[#667085] line-clamp-2">{doc.issuer}</div>
                    <div className="text-[9px] font-mono text-[#8C95A6] pt-1 truncate">{doc.uri}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Projects Highlight */}
          <div className="space-y-3 pt-3 border-t border-[#E5E1D9]">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#8C95A6]">Featured Technical Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-md border border-[#E5E1D9] bg-[#F7F6F2]">
                <div className="font-semibold text-xs text-[#252B32]">Distributed Micro-Frontend Portal</div>
                <div className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                  High-throughput citizen access dashboard built with React, TypeScript, and Docker container clusters.
                </div>
                <div className="mt-2 flex gap-1">
                  <span className="text-[9px] bg-white border border-[#E5E1D9] text-[#5C6470] px-1.5 py-0.5 rounded font-mono">React</span>
                  <span className="text-[9px] bg-white border border-[#E5E1D9] text-[#5C6470] px-1.5 py-0.5 rounded font-mono">Node.js</span>
                </div>
              </div>

              <div className="p-3.5 rounded-md border border-[#E5E1D9] bg-[#F7F6F2]">
                <div className="font-semibold text-xs text-[#252B32]">Multilingual Indic Speech Processor</div>
                <div className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                  Edge AI acoustic model optimized for Hindi and regional voice query translation.
                </div>
                <div className="mt-2 flex gap-1">
                  <span className="text-[9px] bg-white border border-[#E5E1D9] text-[#5C6470] px-1.5 py-0.5 rounded font-mono">Python</span>
                  <span className="text-[9px] bg-white border border-[#E5E1D9] text-[#5C6470] px-1.5 py-0.5 rounded font-mono">PyTorch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Verification Seal */}
          <div className="pt-4 border-t border-[#E5E1D9] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-[11px] text-[#8C95A6] leading-relaxed">
              Record Hash: <code className="text-[#5C6470] font-mono">0x78ab92e3401c90</code> • Authenticated on SkillBridge India.
            </div>
            <div className="text-[10px] bg-[#F2EFE9] text-[#5C6470] px-2.5 py-1 rounded font-medium border border-[#E5E1D9]">
              Problem Statement ID: 26044
            </div>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
};
