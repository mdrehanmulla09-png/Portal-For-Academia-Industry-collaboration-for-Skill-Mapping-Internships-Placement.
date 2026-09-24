import React, { useState, useEffect } from 'react';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { Opportunity } from '../../types/shared';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Search,
  MapPin,
  Clock,
  Banknote,
  CheckCircle2,
  ExternalLink,
  X
} from 'lucide-react';

export const PlacementsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('job');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');

  // Application modal
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [applySuccess, setApplySuccess] = useState<boolean>(false);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        type: selectedType,
        search,
        workMode: selectedWorkMode
      };
      const res = await api.getOpportunities(params);
      if (res.success) {
        setOpportunities(res.opportunities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedType, selectedWorkMode]);

  const handleApply = async () => {
    if (!selectedOpp) return;
    if (!user) {
      showToast('Login Required', 'Please log in with a student account to apply.', 'warning');
      return;
    }
    if (user.role !== 'student') {
      showToast('Role Restriction', 'Only students can apply for placement positions.', 'error');
      return;
    }

    setIsApplying(true);
    try {
      const res = await api.applyForOpportunity(selectedOpp.id, coverLetter);
      if (res.success) {
        setApplySuccess(true);
        showToast('Application Submitted', `Applied for ${selectedOpp.title} at ${selectedOpp.companyName}!`, 'success');
      }
    } catch (err: any) {
      showToast('Application Error', err.message || 'Failed to submit application', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 pb-4 border-b border-[#E5E1D9]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#252B32] tracking-tight">
                Graduate Placements & Apprenticeships
              </h1>
              <p className="text-xs text-[#667085] mt-0.5">
                Entry-level technology roles and national apprenticeships with objective eligibility criteria.
              </p>
            </div>
            <span className="text-xs font-medium text-[#667085]">
              Showing <strong>{opportunities.length}</strong> active postings
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-md border border-[#E5E1D9] p-4 shadow-xs mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C95A6] absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search placements by keyword or employer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
              />
            </div>

            {/* Opportunity Type */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#D0CBC0] rounded-md bg-white focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
              >
                <option value="job">Full-Time Graduate Jobs</option>
                <option value="apprenticeship">Apprenticeships (NATS / NAPS)</option>
                <option value="all">All Placement Types</option>
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#D0CBC0] rounded-md bg-white focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
              >
                <option value="all">All Modes (Remote, Hybrid, On-site)</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="on_site">On-site</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-[#667085] font-medium">
            Loading placement positions...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-white rounded-md border border-[#E5E1D9] p-12 text-center shadow-xs">
            <p className="text-sm font-semibold text-[#252B32]">No matching placement listings found.</p>
            <p className="text-xs text-[#667085] mt-1">Try selecting a different opportunity type or relaxing search parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-md border border-[#E5E1D9] p-5 shadow-xs hover:border-[#D0CBC0] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <StatusBadge status={opp.type} />
                    <span className="text-[11px] text-[#8C95A6]">
                      Deadline: {opp.applicationDeadline}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[#252B32] text-sm leading-snug">{opp.title}</h3>
                  <div className="text-xs text-[#667085] font-medium mt-0.5">{opp.companyName}</div>

                  <p className="text-xs text-[#667085] mt-2.5 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="mt-4 space-y-1 text-xs text-[#667085]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8C95A6]" />
                      <span>{opp.location} ({opp.workMode})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8C95A6]" />
                      <span>{opp.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-[#252B32]">
                      <Banknote className="w-3.5 h-3.5 text-[#245C56]" />
                      <span>{opp.stipendOrSalary}</span>
                    </div>
                  </div>

                  {/* Required skills */}
                  <div className="mt-4 pt-3 border-t border-[#E5E1D9]">
                    <div className="text-[10px] uppercase font-semibold text-[#8C95A6] tracking-wider mb-1.5">
                      Target Competencies
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {opp.requiredSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-[#F2EFE9] text-[#5C6470] font-medium px-1.5 py-0.5 rounded"
                        >
                          {s.skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E1D9]">
                  <button
                    onClick={() => {
                      setSelectedOpp(opp);
                      setCoverLetter('');
                      setApplySuccess(false);
                    }}
                    className="w-full py-2 rounded-md text-xs font-medium bg-[#245C56] hover:bg-[#1B4742] text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>View Specifications & Apply</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedOpp && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-md max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-card border border-[#E5E1D9]">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#E5E1D9]">
                <div>
                  <h3 className="font-bold text-[#252B32] text-base">{selectedOpp.title}</h3>
                  <div className="text-xs text-[#667085] font-medium mt-0.5">{selectedOpp.companyName}</div>
                </div>
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="p-1 rounded-md text-[#8C95A6] hover:text-[#252B32] hover:bg-[#F2EFE9]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {applySuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-10 h-10 bg-[#F0F5F2] text-[#2E6B4A] border border-[#D1E3D8] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-[#252B32] text-sm">Placement Application Logged</h4>
                  <p className="text-xs text-[#667085] max-w-sm mx-auto">
                    Your verified dossier has been forwarded to the campus recruiting team at {selectedOpp.companyName}.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedOpp(null)}
                      className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#245C56] text-white hover:bg-[#1B4742]"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-4 text-xs text-[#252B32]">
                  <div className="p-3 bg-[#F7F6F2] rounded-md border border-[#E5E1D9] space-y-1">
                    <div><strong>Compensation:</strong> <span className="text-[#245C56] font-semibold">{selectedOpp.stipendOrSalary}</span></div>
                    <div><strong>Location:</strong> {selectedOpp.location} ({selectedOpp.workMode})</div>
                    <div><strong>Positions Open:</strong> {selectedOpp.openings} vacancies</div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#252B32] mb-1">Job Overview</h4>
                    <p className="text-[#667085] leading-relaxed">{selectedOpp.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#252B32] mb-1.5">Required Skills & Weights</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedOpp.requiredSkills.map((s, idx) => (
                        <span key={idx} className="bg-[#F2EFE9] text-[#252B32] border border-[#E5E1D9] px-2 py-0.5 rounded text-[11px] font-medium">
                          {s.skill} • {s.requiredLevel}
                        </span>
                      ))}
                    </div>
                  </div>

                  {user?.role === 'student' ? (
                    <div className="space-y-3 pt-3 border-t border-[#E5E1D9]">
                      <div>
                        <label className="font-semibold text-[#252B32] block mb-1">
                          Statement of Interest / Cover Note
                        </label>
                        <textarea
                          rows={3}
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Highlight your relevant academic projects or specialized coursework..."
                          className="w-full p-2.5 border border-[#D0CBC0] rounded-md text-xs focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                        />
                      </div>

                      <div className="p-2.5 bg-[#F0F4F8] border border-[#D3DFEE] rounded-md text-[11px] text-[#2C4A6F]">
                        ⚡ <strong>Verified Student Dossier:</strong> Your academic record, assessed scores, and verified credentials are authenticated for this employer review.
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOpp(null)}
                          className="px-3 py-1.5 rounded-md font-medium text-[#667085] hover:bg-[#F2EFE9]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isApplying}
                          onClick={handleApply}
                          className="px-4 py-1.5 rounded-md font-medium bg-[#245C56] hover:bg-[#1B4742] text-white disabled:opacity-50 transition-colors"
                        >
                          {isApplying ? 'Submitting...' : 'Submit Placement Application'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FCF6EC] rounded-md border border-[#F0DFBE] text-[#965814] text-xs">
                      <strong>Student Sign-In Required:</strong> Only logged-in students can apply for placement positions. Use the Fast Pass at the top to test.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <GovFooter />
    </div>
  );
};
