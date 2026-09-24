import React, { useState, useEffect } from 'react';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { CollaborationProposal } from '../../types/shared';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  PlusCircle,
  X
} from 'lucide-react';

export const CollaborationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [proposals, setProposals] = useState<CollaborationProposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Proposal form state
  const [title, setTitle] = useState<string>('');
  const [targetOrgName, setTargetOrgName] = useState<string>('');
  const [type, setType] = useState<CollaborationProposal['type']>('joint_research');
  const [domain, setDomain] = useState<string>('Artificial Intelligence & Systems');
  const [budgetOrFunding, setBudgetOrFunding] = useState<string>('₹25,00,000 (Co-funded)');
  const [objectives, setObjectives] = useState<string>('');
  const [deliverablesText, setDeliverablesText] = useState<string>('');
  const [expectedDuration, setExpectedDuration] = useState<string>('12 Months');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await api.getCollaborations();
      if (res.success) {
        setProposals(res.proposals);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetOrgName || !objectives) {
      showToast('Validation Error', 'Title, target organization, and objectives are required.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const deliverables = deliverablesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.submitCollaboration({
        title,
        targetOrgName,
        type,
        domain,
        budgetOrFunding,
        objectives,
        deliverables: deliverables.length > 0 ? deliverables : ['Curriculum modernization', 'Student testbed access'],
        expectedDuration
      });

      if (res.success) {
        showToast('Proposal Submitted', 'Collaboration proposal submitted for review!', 'success');
        setIsModalOpen(false);
        setTitle('');
        setTargetOrgName('');
        setObjectives('');
        setDeliverablesText('');
        fetchProposals();
      }
    } catch (err: any) {
      showToast('Submission Failed', err.message || 'Could not submit proposal', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E1D9]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#252B32] tracking-tight">
              Bilateral Industry–Academia Initiatives & MoUs
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              Facilitating joint research projects, corporate-sponsored laboratories, curriculum updates, and guest lectures.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                if (!user) {
                  showToast('Authentication Required', 'Please log in to submit collaboration proposals.', 'warning');
                  return;
                }
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-[#245C56] hover:bg-[#1B4742] text-white shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Propose Collaboration</span>
            </button>
          </div>
        </div>

        {/* Status Lifecycle Banner */}
        <div className="bg-white p-4 rounded-md border border-[#E5E1D9] shadow-xs mb-6">
          <div className="text-[10px] font-semibold text-[#8C95A6] uppercase tracking-wider mb-2">
            Partnership Review Workflow
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-[#F0F4F8] text-[#2C4A6F] font-medium border border-[#D3DFEE]">
              1. Submitted
            </div>
            <div className="p-2 rounded bg-[#FCF6EC] text-[#965814] font-medium border border-[#F0DFBE]">
              2. Under Review
            </div>
            <div className="p-2 rounded bg-[#EBF2F1] text-[#245C56] font-medium border border-[#CCE0DE]">
              3. MoU Approved
            </div>
            <div className="p-2 rounded bg-[#F0F7F9] text-[#205565] font-medium border border-[#D0E6ED]">
              4. In Progress
            </div>
            <div className="p-2 rounded bg-[#F0F5F2] text-[#2E6B4A] font-medium border border-[#D1E3D8] col-span-2 sm:col-span-1">
              5. Completed
            </div>
          </div>
        </div>

        {/* Proposals List */}
        {loading ? (
          <div className="py-16 text-center text-xs text-[#667085] font-medium">
            Loading collaboration proposals...
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-md border border-[#E5E1D9] p-5 shadow-xs hover:border-[#D0CBC0] transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E1D9]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase bg-[#F2EFE9] text-[#5C6470] border border-[#E5E1D9] px-2 py-0.5 rounded">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#667085]">
                      Domain: <strong className="text-[#252B32]">{item.domain}</strong>
                    </span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="py-3">
                  <h3 className="font-semibold text-[#252B32] text-sm leading-snug">{item.title}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs text-[#667085]">
                    <div>
                      <span className="text-[#8C95A6]">Proposer: </span>
                      <strong className="text-[#252B32]">{item.proposerName}</strong> ({item.proposerOrg})
                    </div>
                    <div>
                      <span className="text-[#8C95A6]">Target Partner: </span>
                      <strong className="text-[#252B32]">{item.targetOrgName}</strong>
                    </div>
                    <div>
                      <span className="text-[#8C95A6]">Budget / Grant: </span>
                      <strong className="text-[#245C56]">{item.budgetOrFunding}</strong>
                    </div>
                    <div>
                      <span className="text-[#8C95A6]">Timeline: </span>
                      <strong className="text-[#252B32]">{item.expectedDuration}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-[#667085] mt-3 leading-relaxed bg-[#F7F6F2] p-3 rounded-md border border-[#E5E1D9]">
                    <strong className="text-[#252B32]">Objectives:</strong> {item.objectives}
                  </p>

                  {item.deliverables && item.deliverables.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[10px] font-semibold text-[#8C95A6] uppercase tracking-wider mb-1">
                        Key Deliverables
                      </div>
                      <ul className="text-xs text-[#667085] space-y-1">
                        {item.deliverables.map((del, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#2E6B4A] font-bold">✓</span>
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Proposal Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-md max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-card border border-[#E5E1D9]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D9]">
                <h3 className="font-bold text-[#252B32] text-base">Submit Bilateral Collaboration Proposal</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-md text-[#8C95A6] hover:text-[#252B32] hover:bg-[#F2EFE9]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs text-[#252B32]">
                <div>
                  <label className="block font-semibold mb-1">Project / Proposal Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Center of Excellence in Generative Edge Intelligence"
                    className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Target Organization / Institution *</label>
                    <input
                      type="text"
                      required
                      value={targetOrgName}
                      onChange={(e) => setTargetOrgName(e.target.value)}
                      placeholder="e.g., IIT Delhi / Bharat Electronics"
                      className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Collaboration Type</label>
                    <select
                      value={type}
                      onChange={(e: any) => setType(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md bg-white focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                    >
                      <option value="joint_research">Joint Applied Research</option>
                      <option value="curriculum_update">Curriculum Co-Design</option>
                      <option value="guest_lecture">Industry Guest Lecture Cohort</option>
                      <option value="lab_sponsorship">Sponsored Lab / Testbed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Technical Domain</label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Estimated Budget</label>
                    <input
                      type="text"
                      value={budgetOrFunding}
                      onChange={(e) => setBudgetOrFunding(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Expected Timeline</label>
                    <input
                      type="text"
                      value={expectedDuration}
                      onChange={(e) => setExpectedDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Strategic Objectives *</label>
                  <textarea
                    rows={3}
                    required
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    placeholder="Describe how this collaboration directly impacts student skill readiness or industrial R&D..."
                    className="w-full p-2.5 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Deliverables (One per line)</label>
                  <textarea
                    rows={2}
                    value={deliverablesText}
                    onChange={(e) => setDeliverablesText(e.target.value)}
                    placeholder="Joint patent filing&#10;50 student internships&#10;Updated semester syllabus"
                    className="w-full p-2.5 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E1D9]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 rounded-md font-medium text-[#667085] hover:bg-[#F2EFE9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 rounded-md font-medium bg-[#245C56] hover:bg-[#1B4742] text-white disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Proposal for MoU'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <GovFooter />
    </div>
  );
};
