import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  FileText,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Shield,
  Smartphone
} from 'lucide-react';

export interface DigiLockerDocument {
  id: string;
  title: string;
  category: string;
  issuer: string;
  issuedYear: string;
  uri: string;
  verifiedAt: string;
  status: 'verified';
  docType: 'degree' | 'marksheet' | 'skill_cert';
}

export interface DigiLockerAccount {
  connected: boolean;
  studentName: string;
  mobileMasked: string;
  aadhaarMasked: string;
  verifiedAt: string;
  documents: DigiLockerDocument[];
}

export const DEFAULT_DEMO_DOCUMENTS: DigiLockerDocument[] = [
  {
    id: 'DL-DOC-001',
    title: 'B.Tech Academic Record — Demo',
    category: 'Higher Education Degree / Marksheet',
    issuer: 'National Academic Depository (NAD) / Delhi Technological University',
    issuedYear: '2026',
    uri: 'in.gov.nad.degree.2026.00918',
    verifiedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'verified',
    docType: 'degree'
  },
  {
    id: 'DL-DOC-002',
    title: 'Class 12 Higher Secondary Certificate — Demo',
    category: 'Senior School Certificate Examination',
    issuer: 'Central Board of Secondary Education (CBSE)',
    issuedYear: '2022',
    uri: 'in.gov.cbse.hsc.2022.44192',
    verifiedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'verified',
    docType: 'marksheet'
  },
  {
    id: 'DL-DOC-003',
    title: 'Skill Certificate (NSQF Level 6) — Demo',
    category: 'Full Stack & Cloud Architecture Masterclass',
    issuer: 'National Skill Development Corporation (NSDC)',
    issuedYear: '2025',
    uri: 'in.gov.nsdc.nsqf6.2025.7721',
    verifiedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'verified',
    docType: 'skill_cert'
  }
];

interface DigiLockerDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: DigiLockerAccount) => void;
  onDisconnect?: () => void;
  currentAccount?: DigiLockerAccount | null;
  defaultStudentName?: string;
}

export const DigiLockerDemoModal: React.FC<DigiLockerDemoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onDisconnect,
  currentAccount,
  defaultStudentName = 'Rahul Sharma'
}) => {
  const [step, setStep] = useState<'input' | 'otp' | 'authenticating' | 'success'>(
    currentAccount?.connected ? 'success' : 'input'
  );

  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [otp, setOtp] = useState<string>('');
  const [consentChecked, setConsentChecked] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [authStageText, setAuthStageText] = useState<string>('Connecting to DigiLocker Gateway...');
  const [activeTab, setActiveTab] = useState<'details' | 'docs'>('details');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      setErrorMessage('Please enter a valid mobile number or demo Aadhaar ID.');
      return;
    }
    if (!consentChecked) {
      setErrorMessage('Please provide consent to authenticate with DigiLocker demo.');
      return;
    }

    setErrorMessage('');
    setStep('otp');
    setOtp('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Predefined demo OTP validation: 123456
    if (otp.trim() !== '123456') {
      setErrorMessage('Invalid Demo OTP. For this presentation demo, please enter 123456.');
      return;
    }

    // Begin authenticating animation simulation
    setStep('authenticating');
    setAuthStageText('Validating OTP with DigiLocker sandbox gateway...');

    setTimeout(() => {
      setAuthStageText('Querying National Academic Depository (NAD) mock registry...');
    }, 900);

    setTimeout(() => {
      setAuthStageText('Retrieving 3 authenticated digital academic certificates...');
    }, 1800);

    setTimeout(() => {
      const verifiedData: DigiLockerAccount = {
        connected: true,
        studentName: defaultStudentName || 'Rahul Sharma',
        mobileMasked: `+91 ${mobileNumber.slice(0, 2)}••••••${mobileNumber.slice(-2)}`,
        aadhaarMasked: '•••• •••• 8912',
        verifiedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        documents: DEFAULT_DEMO_DOCUMENTS
      };

      onSuccess(verifiedData);
      setStep('success');
    }, 2700);
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect this simulated DigiLocker account? You can reconnect anytime.')) {
      if (onDisconnect) onDisconnect();
      setStep('input');
      setOtp('');
      setErrorMessage('');
      onClose();
    }
  };

  const handleResetFlow = () => {
    setStep('input');
    setOtp('');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#252B32]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl border border-warm-border overflow-hidden animate-fadeIn">
        {/* DigiLocker Brand Header */}
        <div className="bg-[#1B2B3E] text-white p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#004085] border border-blue-400/40 flex items-center justify-center font-bold text-white text-xs shadow-inner">
              <span className="tracking-tighter">DL</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide">DigiLocker</h3>
                <span className="text-[10px] font-semibold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded">
                  Demo Simulation
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                National Academic Depository (NAD) Verification Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Simulation Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2 text-[11px] text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            <strong>Presentation Mode:</strong> Simulated authentication. No real government credentials or live servers are accessed.
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Identification Input */}
          {step === 'input' && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-warm-text text-sm">
                  Sign in with DigiLocker (Demo)
                </h4>
                <p className="text-warm-muted text-[11px] mt-0.5">
                  Enter your demo registered mobile number or mock Aadhaar ID to authenticate academic credentials.
                </p>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-warm-text block mb-1">
                  Mobile Number / Demo ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. 9876543210 or AADHAAR-DEMO"
                    className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none font-mono text-xs"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] bg-warm-canvas text-warm-muted border border-warm-border px-1.5 py-0.5 rounded font-mono">
                    Demo
                  </span>
                </div>
                <p className="text-[10px] text-warm-muted mt-1">
                  Prefilled with sample test number. You can leave it as is.
                </p>
              </div>

              <div className="p-3 bg-warm-canvas/60 rounded border border-warm-border text-[11px] text-warm-text space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded text-teal-700 focus:ring-teal-700"
                  />
                  <span className="leading-snug">
                    I grant consent to <strong>SkillBridge India</strong> to fetch my verified academic transcripts and skill certificates from the DigiLocker National Academic Depository (NAD) demo registry.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-warm-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded font-semibold text-warm-muted hover:text-warm-text hover:bg-warm-canvas transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Send Demo OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-warm-text text-sm">
                  Enter Demo OTP
                </h4>
                <p className="text-warm-muted text-[11px] mt-0.5">
                  A simulated OTP was dispatched to <strong>+91 ••••••{mobileNumber.slice(-4) || '3210'}</strong>
                </p>
              </div>

              {/* Realistic Demo OTP Prompt Hint */}
              <div className="p-3 rounded bg-teal-50/80 border border-teal-200 text-teal-950 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[11px]">Demo OTP Simulator Code</div>
                  <div className="text-[11px] mt-0.5">
                    Please enter predefined demo OTP: <strong className="font-mono text-sm text-teal-900 bg-white px-2 py-0.5 rounded border border-teal-300">123456</strong>
                  </div>
                  <div className="text-[10px] text-teal-800 mt-1">
                    (Tip: entering any other digits will demonstrate the invalid OTP error handling state).
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-warm-text block mb-1">
                  6-Digit OTP *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 123456"
                  className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none font-mono text-center tracking-widest text-base font-bold text-warm-text"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-warm-muted pt-1">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-teal-800 hover:underline font-semibold"
                >
                  &larr; Change Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="text-warm-muted hover:text-warm-text underline"
                >
                  Auto-fill Demo Code (123456)
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-warm-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded font-semibold text-warm-muted hover:text-warm-text hover:bg-warm-canvas transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Verify & Link Documents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Authenticating Simulation */}
          {step === 'authenticating' && (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-14 h-14 mx-auto">
                <RefreshCw className="w-14 h-14 text-teal-700 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-teal-800" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-warm-text text-sm">
                  DigiLocker Authentication in Progress
                </h4>
                <p className="text-xs text-warm-muted font-mono mt-1 transition-all">
                  {authStageText}
                </p>
              </div>
              <div className="w-48 bg-warm-border/60 h-1.5 rounded-full mx-auto overflow-hidden">
                <div className="bg-teal-700 h-full rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-[10px] text-warm-muted">
                Simulating secure Government of India OAuth 2.0 protocol handshake...
              </p>
            </div>
          )}

          {/* STEP 4: Success & Verified Summary */}
          {step === 'success' && (
            <div className="space-y-4 text-xs">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-900 text-[10px] font-semibold mb-1">
                  <ShieldCheck className="w-3 h-3 text-teal-700" />
                  DigiLocker Connected & Verified (Demo)
                </div>
                <h4 className="font-bold text-warm-text text-base">
                  {currentAccount?.studentName || defaultStudentName}
                </h4>
                <p className="text-[11px] text-warm-muted">
                  Simulated Aadhaar: <strong>{currentAccount?.aadhaarMasked || '•••• •••• 8912'}</strong> • Linked on {currentAccount?.verifiedAt || 'Today'}
                </p>
              </div>

              {/* Verified Documents Found from DigiLocker */}
              <div className="bg-warm-canvas/50 rounded-lg border border-warm-border p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-warm-text border-b border-warm-border pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                    <span>Imported Academic Awards ({DEFAULT_DEMO_DOCUMENTS.length})</span>
                  </span>
                  <span className="text-[10px] text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200 font-mono">
                    Audit Status: Cryptographically Signed
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {DEFAULT_DEMO_DOCUMENTS.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 bg-white rounded border border-warm-border flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-warm-text text-xs flex items-center gap-1.5">
                          <span>{doc.title}</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                            Verified
                          </span>
                        </div>
                        <div className="text-[10px] text-warm-muted">
                          {doc.issuer} • Class of {doc.issuedYear}
                        </div>
                        <div className="text-[9px] text-warm-muted/70 font-mono">
                          URI: {doc.uri}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-teal-50/70 border border-teal-200/70 text-[11px] text-teal-950 leading-relaxed">
                <strong>Credential Trust Verified:</strong> Your profile's verified skills have been calibrated against these DigiLocker awards with audit timestamps.
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-warm-border">
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-terracotta-800 hover:text-rose-700 text-xs font-semibold underline px-1"
                >
                  Disconnect DigiLocker Demo
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors"
                  >
                    Done & Return to Portfolio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
