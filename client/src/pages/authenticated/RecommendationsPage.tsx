import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { api } from '../../services/api';
import { RecommendationResult, OpportunityType } from '../../types/shared';
import { MatchScoreMeter } from '../../components/common/MatchScoreMeter';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  MapPin,
  Clock,
  Banknote,
  Send,
  HelpCircle,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecommendationsPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const res = await api.getRecommendations(selectedType);
      if (res.success) {
        setRecommendations(res.recommendations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, [selectedType]);

  const handleApply = async (oppId: string) => {
    setApplyingId(oppId);
    try {
      const res = await api.applyForOpportunity(oppId, 'Applied via AI Recommendation match.');
      if (res.success) {
        showToast('Application Submitted', 'Successfully applied! Check Application Tracking.', 'success');
      }
    } catch (err: any) {
      showToast('Application Alert', err.message || 'Could not submit application', 'error');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <DashboardLayout
      allowedRoles={['student']}
      title="AI-Powered Skill Mapping & Recommendations"
      subtitle="Transparent, weighted matching algorithms rank opportunities based on your assessed competencies."
    >
      <div className="space-y-6">
        {/* Recommendation Engine Transparency Notice */}
        <div className="bg-white p-5 rounded-lg border border-warm-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-terracotta-600" />
              <h3 className="font-semibold text-warm-text text-sm">Transparent Recommendation Model</h3>
            </div>
            <span className="text-[10px] uppercase font-mono bg-warm-canvas text-warm-text px-2 py-0.5 rounded border border-warm-border">
              Deterministic Weighted Algorithm v1.0
            </span>
          </div>
          <p className="text-xs text-warm-muted leading-relaxed">
            Match scores are calculated dynamically using:
            <code className="text-[11px] bg-warm-canvas text-warm-text px-1.5 py-0.5 rounded ml-1 font-mono border border-warm-border">
              Score = Σ (Skill Weight × Proficiency Level Factor × Verification Trust)
            </code>.
            Eligibility criteria (CGPA, Branch, Graduation Year) are evaluated independently from skill compatibility.
          </p>

          {/* Filter Bar */}
          <div className="pt-3 border-t border-warm-border flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-warm-muted mr-1">Filter By Type:</span>
            {['all', 'internship', 'job', 'apprenticeship', 'live_project'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                  selectedType === t
                    ? 'bg-teal-700 text-white'
                    : 'bg-warm-canvas hover:bg-warm-border/60 text-warm-text border border-warm-border'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations List */}
        {loading ? (
          <div className="py-16 text-center text-xs text-warm-muted font-medium">
            Computing weighted recommendations across active opportunities...
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-lg border border-warm-border p-12 text-center">
            <p className="text-sm font-semibold text-warm-text">No matching opportunities found.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {recommendations.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-warm-border p-6 hover:border-warm-muted/50 transition-all space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-warm-border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.opportunity.type} />
                      {item.isEligible ? (
                        <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-semibold">
                          ✓ Eligible
                        </span>
                      ) : (
                        <span className="text-[10px] bg-terracotta-50 text-terracotta-800 border border-terracotta-200 px-2 py-0.5 rounded font-semibold">
                          ⚠ Eligibility Flag
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-warm-text">{item.opportunity.title}</h3>
                    <div className="text-xs text-warm-muted font-medium">{item.opportunity.companyName}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MatchScoreMeter score={item.matchScore} />
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-warm-muted">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-warm-muted" />
                    <span>{item.opportunity.location} ({item.opportunity.workMode})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-warm-muted" />
                    <span>{item.opportunity.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-warm-text">
                    <Banknote className="w-3.5 h-3.5 text-teal-700" />
                    <span>{item.opportunity.stipendOrSalary}</span>
                  </div>
                </div>

                {/* Explainable Reasoning */}
                <div className="p-3 bg-teal-50/60 rounded border border-teal-200/60 text-xs text-teal-950 leading-relaxed">
                  <strong>Why Recommended:</strong> {item.matchExplanation}
                </div>

                {/* Matching vs Missing Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3 bg-warm-canvas/50 rounded border border-warm-border">
                    <div className="font-semibold text-warm-text mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                      <span>Matching Competencies ({item.matchingSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.matchingSkills.map((sk, sIdx) => (
                        <span key={sIdx} className="bg-white border border-warm-border text-warm-text px-2 py-0.5 rounded text-[11px] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-warm-canvas/50 rounded border border-warm-border">
                    <div className="font-semibold text-warm-text mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-terracotta-600" />
                      <span>Missing / Gap Skills ({item.missingSkills.length})</span>
                    </div>
                    {item.missingSkills.length === 0 ? (
                      <div className="text-warm-muted text-[11px]">No skill gaps detected! Complete coverage.</div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {item.missingSkills.map((sk, sIdx) => (
                          <span key={sIdx} className="bg-white border border-terracotta-200 text-terracotta-800 px-2 py-0.5 rounded text-[11px] font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Gap-Closing Courses */}
                {item.recommendedCourses.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-semibold text-warm-muted uppercase tracking-wider mb-2">
                      Bridging Courses to Close Identified Gaps
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.recommendedCourses.map((course, cIdx) => (
                        <div key={cIdx} className="p-2.5 bg-warm-canvas/40 rounded border border-warm-border flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold text-warm-text text-[11px]">{course.title}</div>
                            <div className="text-[10px] text-warm-muted">{course.provider} • {course.duration}</div>
                          </div>
                          <Link
                            to={course.url}
                            className="text-[10px] font-semibold text-teal-800 hover:text-teal-950 hover:underline shrink-0 ml-2"
                          >
                            Enroll &rarr;
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply Action */}
                <div className="pt-3 border-t border-warm-border flex items-center justify-between">
                  <div className="text-[11px] text-warm-muted">
                    Application Deadline: {item.opportunity.applicationDeadline}
                  </div>
                  <button
                    onClick={() => handleApply(item.opportunity.id)}
                    disabled={applyingId === item.opportunity.id}
                    className="px-5 py-2 rounded text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{applyingId === item.opportunity.id ? 'Submitting...' : '1-Click Apply with Portfolio'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
