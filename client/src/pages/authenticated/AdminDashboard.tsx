import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';
import { VerificationStatus, User } from '../../types/shared';
import {
  Shield,
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Activity,
  FileCheck2,
  Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useNotifications();
  const [analytics, setAnalytics] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'verifications' | 'users'>('verifications');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, verifyRes, usersRes] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getAdminVerifications(),
        api.getAdminUsers()
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (verifyRes.success) setVerifications(verifyRes.requests);
      if (usersRes.success) setUsersList(usersRes.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDecision = async (reqId: string, decision: VerificationStatus) => {
    const remarks = prompt(
      `Enter verification audit remarks for ${decision.toUpperCase()} (optional):`,
      decision === 'verified' ? 'Approved after registry verification.' : 'Insufficient supporting documentation.'
    );

    try {
      const res = await api.submitVerificationDecision(reqId, decision, remarks || undefined);
      if (res.success) {
        showToast('Verification Recorded', `Marked as ${decision.toUpperCase()}. Notification sent to requester.`, 'success');
        setVerifications((prev) =>
          prev.map((v) => (v.id === reqId ? res.request : v))
        );
      }
    } catch (err: any) {
      showToast('Action Failed', err.message || 'Could not update verification', 'error');
    }
  };

  return (
    <DashboardLayout
      allowedRoles={['platform_admin', 'institution_admin']}
      title="National Platform Administration & Verification Hub"
      subtitle="Oversight of organization vetting, student credential authentication, and national portal audit trails."
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Loading platform administration data...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Total Registered Users</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.totalUsers || 18}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">Across all 5 roles</div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Pending Verifications</div>
              <div className="text-2xl font-bold text-terracotta-700 mt-1">
                {verifications.filter((v) => v.status === 'pending').length}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">Awaiting nodal approval</div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">Active Opportunities</div>
              <div className="text-2xl font-bold text-warm-text mt-1">
                {analytics?.totalOpportunities || 15}
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">Jobs & internships</div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-warm-border">
              <div className="text-[11px] text-warm-muted uppercase tracking-wider font-semibold">System Health Score</div>
              <div className="text-2xl font-bold text-teal-800 mt-1">
                {analytics?.platformHealthScore || 99.4}%
              </div>
              <div className="text-[11px] text-warm-muted mt-1.5">Zero downtime recorded</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-warm-border gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('verifications')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'verifications'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-warm-muted hover:text-warm-text'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-terracotta-600" />
              <span>Verification Queue ({verifications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'users'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-warm-muted hover:text-warm-text'
              }`}
            >
              <Users className="w-4 h-4 text-teal-700" />
              <span>Platform User Directory ({usersList.length})</span>
            </button>
          </div>

          {/* Tab 1: Verification Queue */}
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <div className="text-xs text-warm-muted">
                Authorized platform administrators verify company legal entities (CIN/MCA registry) and student certificate documents.
              </div>

              <div className="space-y-3">
                {verifications.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-lg border border-warm-border p-6 hover:border-warm-muted/40 transition-all space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-warm-border">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold uppercase bg-warm-canvas text-warm-text border border-warm-border px-2 py-0.5 rounded">
                            {req.type.replace('_', ' ')}
                          </span>
                          <StatusBadge status={req.status} />
                        </div>
                        <h4 className="font-semibold text-warm-text text-sm">{req.targetName}</h4>
                        <div className="text-[11px] text-warm-muted mt-0.5">
                          Requester Email: <strong className="text-warm-text">{req.requesterEmail}</strong> • Submitted on {new Date(req.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Action buttons */}
                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecision(req.id, 'verified')}
                            className="px-3.5 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Verify</span>
                          </button>
                          <button
                            onClick={() => handleDecision(req.id, 'rejected')}
                            className="px-3.5 py-1.5 rounded bg-warm-canvas text-terracotta-800 hover:bg-rose-50 font-semibold border border-warm-border hover:border-terracotta-300 flex items-center gap-1.5 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-right text-[11px] text-warm-muted">
                          <div>Reviewed by <strong className="text-warm-text">{req.reviewedBy}</strong></div>
                          <div>Remarks: {req.remarks || 'None'}</div>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-warm-canvas/60 rounded border border-warm-border text-warm-text leading-relaxed">
                      <strong>Verification Details:</strong> {req.details}
                    </div>

                    {req.documentUrl && (
                      <div>
                        <a
                          href={req.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-teal-800 hover:text-teal-950 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Inspect Submitted Verification Proof Document</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: User Directory */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg border border-warm-border overflow-hidden text-xs">
              <div className="p-4 bg-warm-canvas border-b border-warm-border font-semibold text-warm-text flex items-center justify-between">
                <span>Registered National Stakeholders Directory</span>
                <span className="text-[11px] text-warm-muted font-normal">{usersList.length} Active Records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-warm-canvas/50 border-b border-warm-border text-warm-muted text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3 font-semibold">Name</th>
                      <th className="p-3 font-semibold">Email</th>
                      <th className="p-3 font-semibold">Role</th>
                      <th className="p-3 font-semibold">Contact</th>
                      <th className="p-3 font-semibold">Verification Status</th>
                      <th className="p-3 font-semibold">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-border/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-warm-canvas/40 transition-colors">
                        <td className="p-3 font-semibold text-warm-text">{u.name}</td>
                        <td className="p-3 text-warm-muted font-mono text-[11px]">{u.email}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-warm-canvas text-warm-text border border-warm-border">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-warm-muted">{u.phone || 'N/A'}</td>
                        <td className="p-3">
                          {u.isVerified ? (
                            <span className="text-teal-800 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                          ) : (
                            <span className="text-terracotta-700 font-medium">Pending</span>
                          )}
                        </td>
                        <td className="p-3 text-warm-muted font-mono text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};
