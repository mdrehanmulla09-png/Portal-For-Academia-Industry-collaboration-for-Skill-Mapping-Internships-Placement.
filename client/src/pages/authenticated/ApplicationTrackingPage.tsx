import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { api } from '../../services/api';
import { Application } from '../../types/shared';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MatchScoreMeter } from '../../components/common/MatchScoreMeter';
import {
  History,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ApplicationTrackingPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getStudentApplications()
      .then((res) => {
        if (res.success) setApplications(res.applications);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout
      allowedRoles={['student']}
      title="Application Tracking & Recruitment Pipeline"
      subtitle="Monitor real-time review progress, interview schedules, and recruiter evaluation feedback."
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Loading submitted applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg border border-warm-border p-12 text-center space-y-3">
          <History className="w-12 h-12 text-warm-muted/40 mx-auto" />
          <h3 className="font-semibold text-warm-text text-base">No Applications Submitted Yet</h3>
          <p className="text-xs text-warm-muted max-w-sm mx-auto">
            Explore verified opportunities in the internship catalog or check personalized recommendations.
          </p>
          <div className="pt-2">
            <Link
              to="/internships"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors"
            >
              Explore Opportunities &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg border border-warm-border p-6 space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-warm-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-warm-canvas text-warm-text border border-warm-border">
                      {app.opportunityType}
                    </span>
                    <span className="text-xs text-warm-muted">
                      Applied: {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-warm-text">{app.opportunityTitle}</h3>
                  <div className="text-xs text-warm-muted font-medium">{app.companyName}</div>
                </div>

                <div className="flex items-center gap-4">
                  <MatchScoreMeter score={app.skillMatchScore} />
                  <StatusBadge status={app.status} />
                </div>
              </div>

              {/* Status Stepper Progression Bar */}
              <div>
                <div className="text-[10px] uppercase font-semibold text-warm-muted tracking-wider mb-3">
                  Progress Pipeline
                </div>
                <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-medium">
                  {['applied', 'under_review', 'shortlisted', 'interview', 'selected'].map((step, idx) => {
                    const stepOrder = ['applied', 'under_review', 'shortlisted', 'interview', 'selected'];
                    const currentIdx = stepOrder.indexOf(app.status);
                    const thisIdx = stepOrder.indexOf(step);
                    const isPassed = thisIdx <= currentIdx;
                    const isCurrent = app.status === step;

                    return (
                      <div
                        key={step}
                        className={`p-2 rounded border transition-all ${
                          isCurrent
                            ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                            : isPassed
                            ? 'bg-teal-50 text-teal-900 border-teal-200'
                            : 'bg-warm-canvas text-warm-muted border-warm-border'
                        }`}
                      >
                        <div className="text-[9px] uppercase font-mono opacity-80">Step 0{idx + 1}</div>
                        <div className="capitalize mt-0.5">{step.replace('_', ' ')}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scheduled Interview Callout if any */}
              {app.interviewDate && (
                <div className="p-4 rounded bg-terracotta-50/60 border border-terracotta-200/80 flex items-center justify-between text-xs text-terracotta-950">
                  <div className="flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-terracotta-700" />
                    <span>Interview Scheduled: {new Date(app.interviewDate).toLocaleString()}</span>
                  </div>
                  <span className="text-[11px] font-medium text-terracotta-800">
                    Check email for secure video meeting link
                  </span>
                </div>
              )}

              {/* Timeline Audit Logs */}
              <div>
                <div className="text-[10px] uppercase font-semibold text-warm-muted tracking-wider mb-2">
                  Timeline Activity Log
                </div>
                <div className="space-y-2">
                  {app.timeline.map((entry, idx) => (
                    <div key={idx} className="p-3 rounded bg-warm-canvas/40 text-xs flex items-start justify-between gap-4 border border-warm-border">
                      <div>
                        <span className="font-semibold text-warm-text uppercase text-[10px] bg-warm-canvas border border-warm-border px-1.5 py-0.5 rounded mr-2">
                          {entry.status.replace('_', ' ')}
                        </span>
                        <span className="text-warm-muted">{entry.note || 'Status updated.'}</span>
                      </div>
                      <span className="text-[10px] text-warm-muted shrink-0 font-mono">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
