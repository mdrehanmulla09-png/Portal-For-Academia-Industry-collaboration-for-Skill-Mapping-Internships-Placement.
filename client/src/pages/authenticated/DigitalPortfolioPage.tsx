import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { StudentProfile } from '../../types/shared';
import { SkillBadge } from '../../components/common/SkillBadge';
import {
  DigiLockerDemoModal,
  DigiLockerAccount
} from '../../components/common/DigiLockerDemoModal';
import {
  FileText,
  CheckCircle,
  CheckCircle2,
  Award,
  Share2,
  Printer,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  X,
  Upload,
  Shield
} from 'lucide-react';

export const DigitalPortfolioPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [portfolio, setPortfolio] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isDigiLockerModalOpen, setIsDigiLockerModalOpen] = useState<boolean>(false);

  // DigiLocker Demo state (persisted in localStorage for demo continuity)
  const [digiLockerAccount, setDigiLockerAccount] = useState<DigiLockerAccount | null>(() => {
    try {
      const saved = localStorage.getItem('skillbridge_digilocker_demo');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Request verification form
  const [credentialTitle, setCredentialTitle] = useState<string>('');
  const [issuingAuthority, setIssuingAuthority] = useState<string>('');
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [skillName, setSkillName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.getMyPortfolio();
      if (res.success) {
        setPortfolio(res.portfolio);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleCopyShareLink = () => {
    if (!portfolio?.portfolioSlug) return;
    const shareUrl = `${window.location.origin}/portfolio/${portfolio.portfolioSlug}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('Link Copied', 'Public portfolio link copied to clipboard!', 'success');
  };

  const handleDigiLockerSuccess = (account: DigiLockerAccount) => {
    setDigiLockerAccount(account);
    try {
      localStorage.setItem('skillbridge_digilocker_demo', JSON.stringify(account));
    } catch (e) {
      console.error(e);
    }
    showToast(
      'DigiLocker Connected (Demo)',
      'Successfully authenticated and retrieved verified academic records.',
      'success'
    );
  };

  const handleDigiLockerDisconnect = () => {
    setDigiLockerAccount(null);
    try {
      localStorage.removeItem('skillbridge_digilocker_demo');
    } catch (e) {
      console.error(e);
    }
    showToast(
      'DigiLocker Disconnected',
      'Demo DigiLocker session cleared successfully.',
      'info'
    );
  };

  const handleRequestVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialTitle) return;

    setIsSubmitting(true);
    try {
      const res = await api.requestCredentialVerification({
        credentialTitle,
        issuingAuthority,
        documentUrl,
        skillName
      });

      if (res.success) {
        showToast('Verification Requested', 'Credential submitted to Institution / Admin queue.', 'success');
        setIsVerifyModalOpen(false);
        setCredentialTitle('');
        setIssuingAuthority('');
        setDocumentUrl('');
        setSkillName('');
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not request verification', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      allowedRoles={['student']}
      title="Digital Portfolio & Verified Credentials"
      subtitle="Your authenticated digital record of verified academic projects, certifications, and competencies."
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Loading digital portfolio...
        </div>
      ) : !portfolio ? (
        <div className="bg-white rounded-lg border border-warm-border p-12 text-center text-xs text-warm-muted">
          Portfolio records not found.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="bg-white p-4 rounded-lg border border-warm-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-warm-text">Public Identifier:</span>
              <code className="text-xs bg-warm-canvas border border-warm-border px-2 py-0.5 rounded font-mono text-warm-text">
                /portfolio/{portfolio.portfolioSlug}
              </code>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* DigiLocker Demo Action Button / Status Badge */}
              {!digiLockerAccount?.connected ? (
                <button
                  onClick={() => setIsDigiLockerModalOpen(true)}
                  className="px-3.5 py-1.5 rounded border border-teal-700/60 bg-teal-50 text-xs font-semibold text-teal-900 hover:bg-teal-100 flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Verify with DigiLocker (Demo)</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-teal-50/70 border border-teal-200/80 px-2.5 py-1 rounded">
                  <button
                    onClick={() => setIsDigiLockerModalOpen(true)}
                    className="text-xs font-semibold text-teal-900 flex items-center gap-1 hover:underline"
                    title="View DigiLocker Connection Details"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                    <span>DigiLocker: Connected (Demo)</span>
                  </button>
                  <span className="text-warm-border">|</span>
                  <button
                    onClick={handleDigiLockerDisconnect}
                    className="text-[10px] text-warm-muted hover:text-terracotta-800 underline"
                  >
                    Disconnect
                  </button>
                </div>
              )}

              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1.5 rounded border border-warm-border bg-white text-xs font-semibold text-warm-text hover:bg-warm-canvas flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded border border-warm-border bg-white text-xs font-semibold text-warm-text hover:bg-warm-canvas flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={() => setIsVerifyModalOpen(true)}
                className="px-4 py-1.5 rounded bg-teal-700 text-xs font-semibold text-white hover:bg-teal-800 flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-white/80" />
                <span>Request Verification</span>
              </button>
            </div>
          </div>

          {/* Portfolio Container */}
          <div className="bg-white rounded-lg border border-warm-border p-8 space-y-6">
            {/* Header info */}
            <div className="pb-6 border-b border-warm-border flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-50 text-teal-900 border border-teal-200 text-[10px] font-semibold">
                    <ShieldCheck className="w-3 h-3 text-teal-700" />
                    Verified Digital Student Identity
                  </div>

                  {digiLockerAccount?.connected && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#004085]/10 text-[#004085] border border-[#004085]/30 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-[#004085]" />
                      DigiLocker Verified (Demo)
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-warm-text">{portfolio.fullName}</h2>
                <div className="text-xs text-warm-muted font-medium mt-0.5">
                  {portfolio.degree} in {portfolio.branch} • <strong className="text-warm-text">{portfolio.institutionName}</strong>
                </div>
                <div className="text-xs text-warm-muted mt-1">
                  CGPA: <strong className="text-warm-text">{portfolio.cgpa}</strong> • Graduation Year: <strong className="text-warm-text">{portfolio.graduationYear}</strong>
                </div>
              </div>

              <div className="p-3.5 bg-warm-canvas/50 rounded border border-warm-border text-right">
                <div className="text-[10px] text-warm-muted font-semibold uppercase tracking-wider">
                  Portfolio Completion
                </div>
                <div className="text-xl font-bold text-teal-800 mt-0.5">
                  {portfolio.portfolioCompletionPercentage}%
                </div>
              </div>
            </div>

            {/* DigiLocker Authenticated Documents (Demo Simulation) */}
            {digiLockerAccount?.connected && (
              <div className="space-y-3 p-5 rounded-lg bg-teal-50/30 border border-teal-200/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-teal-200/50">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-warm-text flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-700" />
                      <span>DigiLocker Academic Documents (Demo Simulation)</span>
                    </div>
                    <p className="text-[11px] text-warm-muted mt-0.5">
                      Authenticated credentials retrieved from the National Academic Depository (NAD) mock sandbox.
                    </p>
                  </div>
                  <span className="text-[10px] bg-white text-teal-900 border border-teal-200 font-mono px-2 py-0.5 rounded font-semibold self-start sm:self-auto">
                    Aadhaar: {digiLockerAccount.aadhaarMasked} • Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {digiLockerAccount.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-white rounded border border-warm-border hover:border-teal-700/40 transition-all flex flex-col justify-between space-y-2 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold text-teal-800 bg-teal-100/70 border border-teal-200 px-1.5 py-0.2 rounded">
                            Verified
                          </span>
                          <span className="text-[10px] font-mono text-warm-muted">{doc.issuedYear}</span>
                        </div>
                        <h4 className="font-semibold text-warm-text text-xs leading-snug">{doc.title}</h4>
                        <p className="text-[10px] text-warm-muted line-clamp-2">{doc.issuer}</p>
                      </div>

                      <div className="pt-2 border-t border-warm-border/60 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-warm-muted/70 text-[9px] truncate max-w-[120px]" title={doc.uri}>
                          {doc.uri}
                        </span>
                        <button
                          onClick={() => setIsDigiLockerModalOpen(true)}
                          className="text-teal-800 font-semibold hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills & Badges */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-warm-muted">
                Verified vs. Assessed vs. Self-Reported Skills
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {portfolio.skills.map((s, idx) => (
                  <SkillBadge
                    key={idx}
                    skill={s.skill}
                    level={s.level}
                    verified={s.verified}
                    assessed={s.assessed}
                    source={s.source}
                  />
                ))}
              </div>
            </div>

            {/* Verified Certifications Section */}
            <div className="space-y-3 pt-4 border-t border-warm-border">
              <div className="text-xs font-semibold uppercase tracking-wider text-warm-muted">
                Audited Certifications & Credentials
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-teal-50/40 rounded border border-teal-200/80 flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-xs text-teal-950">React Enterprise Architect Certified</div>
                    <div className="text-[11px] text-teal-900 mt-0.5">Meta / NPTEL • Audited by IIT Delhi</div>
                    <div className="text-[10px] text-warm-muted mt-1 font-mono">Credential ID: SB-META-2025-891</div>
                  </div>
                  <span className="text-[10px] bg-teal-100 text-teal-900 font-semibold px-2 py-0.5 rounded border border-teal-300">
                    Verified
                  </span>
                </div>

                <div className="p-4 bg-warm-canvas/40 rounded border border-warm-border flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-xs text-warm-text">AWS Cloud Practitioner</div>
                    <div className="text-[11px] text-warm-muted mt-0.5">Amazon Web Services • Pending Institutional Review</div>
                  </div>
                  <span className="text-[10px] bg-terracotta-50 text-terracotta-800 font-semibold px-2 py-0.5 rounded border border-terracotta-200">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="p-4 rounded bg-warm-canvas/50 border border-warm-border text-[11px] text-warm-muted leading-relaxed">
              <strong className="text-warm-text">Public Display Consent:</strong> When you share your public link, only your academic records, verified badges, and approved projects are displayed. Contact details, personal phone numbers, and unofficial files are withheld.
            </div>
          </div>

          {/* Request Verification Modal */}
          {isVerifyModalOpen && (
            <div className="fixed inset-0 z-50 bg-warm-text/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-warm-border">
                <div className="flex items-center justify-between pb-4 border-b border-warm-border">
                  <h3 className="font-semibold text-warm-text text-base">Request Credential Verification</h3>
                  <button
                    onClick={() => setIsVerifyModalOpen(false)}
                    className="p-1 text-warm-muted hover:text-warm-text rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleRequestVerification} className="py-4 space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-warm-text block mb-1">Certification Title *</label>
                    <input
                      type="text"
                      required
                      value={credentialTitle}
                      onChange={(e) => setCredentialTitle(e.target.value)}
                      placeholder="e.g. AWS Certified Solutions Architect Associate"
                      className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-warm-text block mb-1">Issuing Authority *</label>
                    <input
                      type="text"
                      required
                      value={issuingAuthority}
                      onChange={(e) => setIssuingAuthority(e.target.value)}
                      placeholder="e.g. Amazon Web Services / NPTEL / AICTE"
                      className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-warm-text block mb-1">Target Skill to Verify</label>
                    <input
                      type="text"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      placeholder="e.g. Docker & Kubernetes"
                      className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-warm-text block mb-1">Document / Certificate URL *</label>
                    <input
                      type="url"
                      required
                      value={documentUrl}
                      onChange={(e) => setDocumentUrl(e.target.value)}
                      placeholder="https://drive.google.com/... or verification link"
                      className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-warm-canvas/60 rounded border border-warm-border text-warm-text text-[11px] leading-relaxed">
                    <strong>Institutional Verification Workflow:</strong> Your submission will be queued for review by your institution's Placement Registrar and Platform Administrators. Once validated, the verified credential badge will activate automatically.
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-warm-border">
                    <button
                      type="button"
                      onClick={() => setIsVerifyModalOpen(false)}
                      className="px-4 py-2 rounded font-semibold text-warm-muted hover:text-warm-text hover:bg-warm-canvas"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded font-semibold bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-50 transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DigiLocker Demo Authentication Modal */}
          <DigiLockerDemoModal
            isOpen={isDigiLockerModalOpen}
            onClose={() => setIsDigiLockerModalOpen(false)}
            onSuccess={handleDigiLockerSuccess}
            onDisconnect={handleDigiLockerDisconnect}
            currentAccount={digiLockerAccount}
            defaultStudentName={portfolio?.fullName || 'Rahul Sharma'}
          />
        </div>
      )}
    </DashboardLayout>
  );
};
