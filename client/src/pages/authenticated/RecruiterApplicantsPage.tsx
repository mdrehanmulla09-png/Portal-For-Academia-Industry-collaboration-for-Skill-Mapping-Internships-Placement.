import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { api } from '../../services/api';
import { Application, ApplicationStatus } from '../../types/shared';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MatchScoreMeter } from '../../components/common/MatchScoreMeter';
import { useNotifications } from '../../context/NotificationContext';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  FileText,
  UserCheck
} from 'lucide-react';

export const RecruiterApplicantsPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await api.getRecruiterApplicants();
      if (res.success) {
        setApplicants(res.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus, note?: string) => {
    try {
      const res = await api.updateApplicationStatus(appId, newStatus, note);
      if (res.success) {
        showToast('Candidate Updated', `Application moved to ${newStatus.replace('_', ' ').toUpperCase()}.`, 'success');
        setApplicants((prev) =>
          prev.map((a) => (a.id === appId ? res.application : a))
        );
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not update status', 'error');
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        app.studentName.toLowerCase().includes(q) ||
        app.opportunityTitle.toLowerCase().includes(q) ||
        app.institutionName.toLowerCase().includes(q) ||
        app.branch.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <DashboardLayout
      allowedRoles={['industry', 'platform_admin']}
      title="Candidate Pipeline & Applicant Review"
      subtitle="Evaluate student applicants pre-screened with transparent skill compatibility scores and verified portfolios."
    >
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-lg border border-warm-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 text-warm-muted absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, college, or role..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-warm-border rounded focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-warm-muted">Pipeline Stage:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-warm-border rounded bg-white focus:border-teal-700 focus:outline-none font-medium"
            >
              <option value="all">All Candidates ({applicants.length})</option>
              <option value="applied">Applied</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview Scheduled</option>
              <option value="selected">Selected / Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="py-16 text-center text-xs text-warm-muted font-medium">
            Loading candidate records...
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="bg-white rounded-lg border border-warm-border p-12 text-center text-xs text-warm-muted">
            No applicants found matching filter criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg border border-warm-border p-6 hover:border-warm-muted/50 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-warm-border">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-warm-text text-base">{app.studentName}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="text-xs text-warm-muted font-medium">
                      {app.branch} • <strong className="text-warm-text">{app.institutionName}</strong>
                    </div>
                    <div className="text-[11px] text-warm-muted mt-0.5">
                      Applied for: <strong className="text-warm-text">{app.opportunityTitle}</strong> ({new Date(app.appliedDate).toLocaleDateString()})
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <MatchScoreMeter score={app.skillMatchScore} />
                  </div>
                </div>

                {/* Candidate Skill Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-teal-50/40 rounded border border-teal-200/60">
                    <div className="font-semibold text-teal-950 mb-1">Matching Verified Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {app.matchingSkills.map((sk, idx) => (
                        <span key={idx} className="bg-white border border-teal-200 text-teal-800 px-2 py-0.5 rounded text-[10px] font-medium">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-terracotta-50/40 rounded border border-terracotta-200/60">
                    <div className="font-semibold text-terracotta-950 mb-1">Identified Gaps for Role</div>
                    <div className="flex flex-wrap gap-1">
                      {app.missingSkills.length === 0 ? (
                        <span className="text-[10px] text-warm-muted">None detected</span>
                      ) : (
                        app.missingSkills.map((sk, idx) => (
                          <span key={idx} className="bg-white border border-terracotta-200 text-terracotta-800 px-2 py-0.5 rounded text-[10px] font-medium">
                            ⚠ {sk}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Cover statement if provided */}
                {app.coverLetter && (
                  <div className="p-3 bg-warm-canvas/50 rounded border border-warm-border text-xs text-warm-text leading-relaxed">
                    <strong>Applicant Statement:</strong> "{app.coverLetter}"
                  </div>
                )}

                {/* Recruiter Action Buttons */}
                <div className="pt-3 border-t border-warm-border flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Resume / Verified Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Pipeline transition buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {app.status !== 'shortlisted' && app.status !== 'interview' && app.status !== 'selected' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'shortlisted', 'Candidate shortlisted based on skill match.')}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-warm-canvas text-warm-text hover:bg-warm-border/60 border border-warm-border transition-colors"
                      >
                        Shortlist
                      </button>
                    )}

                    {app.status !== 'interview' && app.status !== 'selected' && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            app.id,
                            'interview',
                            'Technical interview invitation dispatched for next week.'
                          )
                        }
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-warm-canvas text-warm-text hover:bg-warm-border/60 border border-warm-border transition-colors"
                      >
                        Schedule Interview
                      </button>
                    )}

                    {app.status !== 'selected' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'selected', 'Official offer letter generated.')}
                        className="px-4 py-1.5 rounded text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-colors"
                      >
                        Make Final Offer
                      </button>
                    )}

                    {app.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'rejected', 'Candidate not moving forward at this time.')}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-warm-canvas text-terracotta-800 hover:bg-rose-50 border border-warm-border hover:border-terracotta-300 transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
