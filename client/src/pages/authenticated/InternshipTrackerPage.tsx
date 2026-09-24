import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { InternshipProgressRecord } from '../../types/shared';
import {
  Clock,
  CheckCircle2,
  Star,
  PlusCircle,
  Award,
  ExternalLink,
  X,
  FileText,
  User,
  Shield,
  Printer
} from 'lucide-react';

export const InternshipTrackerPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [record, setRecord] = useState<InternshipProgressRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // New weekly log form
  const [weekNumber, setWeekNumber] = useState<number>(4);
  const [tasksAccomplished, setTasksAccomplished] = useState<string>('');
  const [challengesFaced, setChallengesFaced] = useState<string>('');
  const [learnings, setLearnings] = useState<string>('');
  const [deliverableLink, setDeliverableLink] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchInternship = async () => {
    setLoading(true);
    try {
      const res = await api.getInternshipProgress();
      if (res.success && res.record) {
        setRecord(res.record);
        if (res.record.weeklyLogs) {
          setWeekNumber(res.record.weeklyLogs.length + 1);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternship();
  }, []);

  const handleSubmitWeeklyLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasksAccomplished) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitWeeklyLog({
        weekNumber: Number(weekNumber),
        tasksAccomplished,
        challengesFaced,
        learnings,
        deliverableLink
      });

      if (res.success) {
        showToast('Weekly Log Submitted', `Week ${weekNumber} report transmitted to mentor!`, 'success');
        setIsLogModalOpen(false);
        setTasksAccomplished('');
        setChallengesFaced('');
        setLearnings('');
        setDeliverableLink('');
        fetchInternship();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not submit log', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      allowedRoles={['student', 'industry']}
      title="Internship Progress & Mentorship Tracker"
      subtitle="Log weekly deliverables, review industry mentor evaluations, and earn authenticated completion records."
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Loading internship progress records...
        </div>
      ) : !record ? (
        <div className="bg-white rounded-lg border border-warm-border p-12 text-center space-y-3">
          <Clock className="w-12 h-12 text-warm-muted/40 mx-auto" />
          <h3 className="font-semibold text-warm-text text-base">No Active Internship Found</h3>
          <p className="text-xs text-warm-muted max-w-sm mx-auto">
            Once an application is selected by an employer, your active internship tracker will activate here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Progress Card */}
          <div className="bg-white rounded-lg border border-warm-border p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-warm-border">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-50 text-teal-900 border border-teal-200 text-[10px] font-semibold mb-1">
                  Active Internship Program
                </div>
                <h2 className="text-xl font-bold text-warm-text">{record.opportunityTitle}</h2>
                <div className="text-xs text-warm-muted font-medium">{record.companyName}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="px-4 py-2 rounded bg-teal-700 text-xs font-semibold text-white hover:bg-teal-800 flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-white/80" />
                  <span>Submit Weekly Log</span>
                </button>
              </div>
            </div>

            {/* Metrics & Mentor */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-warm-canvas/50 rounded border border-warm-border">
                <div className="text-warm-muted font-semibold text-[10px] uppercase tracking-wider">Assigned Mentor</div>
                <div className="font-semibold text-warm-text mt-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-700" />
                  <span>{record.mentorName}</span>
                </div>
                <div className="text-[11px] text-warm-muted mt-0.5">{record.mentorEmail}</div>
              </div>

              <div className="p-3.5 bg-warm-canvas/50 rounded border border-warm-border">
                <div className="text-warm-muted font-semibold text-[10px] uppercase tracking-wider">Program Dates</div>
                <div className="font-semibold text-warm-text mt-1">
                  {record.startDate} &rarr; {record.endDate}
                </div>
                <div className="text-[11px] text-warm-muted capitalize mt-0.5">Status: {record.status}</div>
              </div>

              <div className="p-3.5 bg-warm-canvas/50 rounded border border-warm-border">
                <div className="flex items-center justify-between text-[10px] font-semibold text-warm-muted uppercase tracking-wider">
                  <span>Milestone Completion</span>
                  <span className="text-teal-800 font-bold">{record.overallProgress}%</span>
                </div>
                <div className="w-full bg-warm-border/60 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-teal-700 h-full rounded-full transition-all duration-300"
                    style={{ width: `${record.overallProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress Logs Feed */}
          <div className="space-y-4">
            <h3 className="font-semibold text-warm-text text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Weekly Reports & Mentor Evaluations</span>
            </h3>

            {record.weeklyLogs.map((log) => (
              <div
                key={log.weekNumber}
                className="bg-white rounded-lg border border-warm-border p-6 hover:border-warm-muted/40 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-warm-border">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded bg-gov-navy text-white font-bold text-xs flex items-center justify-center">
                      W{log.weekNumber}
                    </span>
                    <div>
                      <h4 className="font-semibold text-warm-text text-sm">Week {log.weekNumber} Progress Report</h4>
                      <div className="text-[10px] text-warm-muted">
                        Submitted on: {new Date(log.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {log.deliverableLink && (
                    <a
                      href={log.deliverableLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Deliverable</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-warm-canvas/40 rounded border border-warm-border">
                    <div className="font-semibold text-warm-text mb-1">Tasks Accomplished:</div>
                    <p className="text-warm-muted leading-relaxed">{log.tasksAccomplished}</p>
                  </div>

                  <div className="p-3 bg-warm-canvas/40 rounded border border-warm-border">
                    <div className="font-semibold text-warm-text mb-1">Key Learnings:</div>
                    <p className="text-warm-muted leading-relaxed">{log.learnings}</p>
                  </div>

                  <div className="p-3 bg-warm-canvas/40 rounded border border-warm-border">
                    <div className="font-semibold text-warm-text mb-1">Challenges & Resolution:</div>
                    <p className="text-warm-muted leading-relaxed">{log.challengesFaced}</p>
                  </div>
                </div>

                {/* Mentor Evaluation Feedback Box */}
                {log.mentorEvaluation ? (
                  <div className="p-3.5 rounded bg-teal-50/60 border border-teal-200/70 text-xs text-teal-950 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold flex items-center gap-1.5 text-teal-900">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>
                          Mentor Evaluation ({log.mentorEvaluation.rating}/5 Stars) — {log.mentorEvaluation.mentorName}
                        </span>
                      </div>
                      <span className="text-[10px] text-warm-muted">
                        {new Date(log.mentorEvaluation.evaluatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-warm-text leading-relaxed pt-1">
                      "{log.mentorEvaluation.feedback}"
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-warm-canvas/50 rounded border border-warm-border text-xs text-warm-muted flex items-center gap-2">
                    <Clock className="w-4 h-4 text-terracotta-600" />
                    <span>Pending mentor review for Week {log.weekNumber}.</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Completion Certificate Section */}
          {record.completionCertificate ? (
            <div className="bg-white rounded-lg border-2 border-teal-700 p-8 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-warm-border">
                <div className="flex items-center gap-2 text-teal-900 font-bold">
                  <Award className="w-5 h-5 text-terracotta-600" />
                  <span className="text-base">Authenticated Digital Internship Completion Record</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded border border-warm-border text-xs font-semibold text-warm-text hover:bg-warm-canvas flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>

              <div className="p-6 bg-warm-canvas/50 rounded border border-warm-border text-center space-y-3">
                <div className="text-xs uppercase font-mono text-warm-muted">
                  Certificate ID: {record.completionCertificate.certificateId}
                </div>
                <h3 className="text-xl font-bold text-warm-text">
                  Certificate of Internship Completion
                </h3>
                <p className="text-xs text-warm-muted max-w-lg mx-auto leading-relaxed">
                  This certifies that <strong className="text-warm-text">{record.studentName}</strong> has satisfactorily completed the
                  prescribed internship milestones for <strong className="text-warm-text">{record.opportunityTitle}</strong> at{' '}
                  <strong className="text-warm-text">{record.companyName}</strong>.
                </p>
                <div className="font-semibold text-teal-800 text-sm pt-2">
                  Performance: {record.completionCertificate.gradeOrPerformance}
                </div>
                <div className="text-[10px] text-warm-muted font-mono">
                  Verification Code: {record.completionCertificate.verificationCode} • Issued on {record.completionCertificate.issueDate}
                </div>
              </div>

              <div className="p-3 bg-warm-canvas/60 rounded border border-warm-border text-[11px] text-warm-muted">
                <strong className="text-warm-text">Integrity Disclaimer:</strong> {record.completionCertificate.disclaimer}
              </div>
            </div>
          ) : null}

          {/* Log Submission Modal */}
          {isLogModalOpen && (
            <div className="fixed inset-0 z-50 bg-warm-text/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-warm-border">
                <div className="flex items-center justify-between pb-4 border-b border-warm-border">
                  <h3 className="font-semibold text-warm-text text-base">Submit Weekly Progress Report</h3>
                  <button
                    onClick={() => setIsLogModalOpen(false)}
                    className="p-1 text-warm-muted hover:text-warm-text"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitWeeklyLog} className="py-4 space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-warm-text block mb-1">Week Number *</label>
                    <input
                      type="number"
                      min="1"
                      max="52"
                      required
                      value={weekNumber}
                      onChange={(e) => setWeekNumber(Number(e.target.value))}
                      className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-warm-text block mb-1">Tasks & Milestones Accomplished *</label>
                    <textarea
                      rows={3}
                      required
                      value={tasksAccomplished}
                      onChange={(e) => setTasksAccomplished(e.target.value)}
                      placeholder="Detail specific feature development, modules built, or technical tasks solved..."
                      className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-warm-text block mb-1">Challenges & Problem Solving</label>
                    <textarea
                      rows={2}
                      value={challengesFaced}
                      onChange={(e) => setChallengesFaced(e.target.value)}
                      placeholder="Roadblocks encountered and how you diagnosed or overcame them..."
                      className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-warm-text block mb-1">Key Technical Learnings</label>
                    <textarea
                      rows={2}
                      value={learnings}
                      onChange={(e) => setLearnings(e.target.value)}
                      placeholder="New frameworks, architectural patterns, or tools mastered..."
                      className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-warm-text block mb-1">Deliverable Link / PR URL</label>
                    <input
                      type="url"
                      value={deliverableLink}
                      onChange={(e) => setDeliverableLink(e.target.value)}
                      placeholder="https://github.com/.../pull/..."
                      className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-warm-border">
                    <button
                      type="button"
                      onClick={() => setIsLogModalOpen(false)}
                      className="px-4 py-2 rounded font-semibold text-warm-muted hover:text-warm-text hover:bg-warm-canvas"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded font-semibold bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-50 transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};
