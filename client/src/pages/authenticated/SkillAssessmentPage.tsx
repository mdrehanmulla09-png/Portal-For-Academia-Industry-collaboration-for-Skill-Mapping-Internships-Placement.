import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { AssessmentQuestion } from '../../types/shared';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Send
} from 'lucide-react';

export const SkillAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSection, setCurrentSection] = useState<'technical' | 'soft_skills' | 'aptitude'>('technical');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(900); // 15 minutes timer
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    api.getAssessmentQuestions()
      .then((res) => {
        if (res.success) setQuestions(res.questions);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Timer tick
  useEffect(() => {
    if (timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentSectionQuestions = questions.filter((q) => q.section === currentSection);
  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const progressPercentage = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitAssessment = async () => {
    if (answeredCount < totalCount) {
      const confirm = window.confirm(
        `You have answered ${answeredCount} of ${totalCount} questions. Submit anyway?`
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitAssessment(answers);
      if (res.success) {
        showToast(
          'Assessment Evaluated!',
          `Score: ${res.result.overallScorePercentage}%. Skill profile updated!`,
          'success'
        );
        navigate('/student/analysis');
      }
    } catch (err: any) {
      showToast('Evaluation Error', err.message || 'Could not evaluate answers.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      allowedRoles={['student']}
      title="National Skill Assessment Diagnostic"
      subtitle="Complete standard technical, soft skills, and aptitude sections to calibrate your verified skill profile."
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Loading question bank...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Assessment Header Toolbar: Progress & Timer */}
          <div className="bg-white p-4 rounded-lg border border-warm-border flex flex-wrap items-center justify-between gap-4">
            {/* Progress bar */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-warm-text">Assessment Completion</span>
                <span className="font-bold text-teal-800">{answeredCount} of {totalCount} Answered ({progressPercentage}%)</span>
              </div>
              <div className="w-full bg-warm-border/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-700 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-warm-canvas border border-warm-border text-warm-text text-xs font-mono font-semibold">
              <Clock className="w-4 h-4 text-terracotta-600" />
              <span>Remaining: {formatTime(timeLeftSeconds)}</span>
            </div>

            {/* Submit button */}
            <div>
              <button
                onClick={handleSubmitAssessment}
                disabled={isSubmitting}
                className="px-5 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Assessment'}</span>
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex border-b border-warm-border gap-2">
            <button
              onClick={() => setCurrentSection('technical')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                currentSection === 'technical'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-warm-muted hover:text-warm-text'
              }`}
            >
              <span>1. Technical Competencies</span>
              <span className="text-[10px] bg-warm-canvas text-warm-text px-1.5 py-0.5 rounded border border-warm-border">
                {questions.filter((q) => q.section === 'technical').length}
              </span>
            </button>

            <button
              onClick={() => setCurrentSection('soft_skills')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                currentSection === 'soft_skills'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-warm-muted hover:text-warm-text'
              }`}
            >
              <span>2. Soft Skills & Leadership</span>
              <span className="text-[10px] bg-warm-canvas text-warm-text px-1.5 py-0.5 rounded border border-warm-border">
                {questions.filter((q) => q.section === 'soft_skills').length}
              </span>
            </button>

            <button
              onClick={() => setCurrentSection('aptitude')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                currentSection === 'aptitude'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-warm-muted hover:text-warm-text'
              }`}
            >
              <span>3. Logical & Numerical Aptitude</span>
              <span className="text-[10px] bg-warm-canvas text-warm-text px-1.5 py-0.5 rounded border border-warm-border">
                {questions.filter((q) => q.section === 'aptitude').length}
              </span>
            </button>
          </div>

          {/* Question List for Current Section */}
          <div className="space-y-4">
            {currentSectionQuestions.map((q, idx) => {
              const selectedOption = answers[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-white p-6 rounded-lg border border-warm-border space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-warm-canvas border border-warm-border text-warm-text font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-warm-muted uppercase tracking-wider">
                        {q.category} • Target Skill: <strong className="text-warm-text">{q.associatedSkill}</strong>
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-warm-canvas text-warm-text border border-warm-border">
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-warm-text leading-relaxed">
                    {q.question}
                  </h3>

                  {/* Options Radio List */}
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOption === optIdx;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded border text-left text-xs transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-teal-50/70 border-teal-700 text-warm-text font-medium'
                              : 'bg-warm-canvas/40 hover:bg-warm-canvas border-warm-border text-warm-text'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-teal-700 bg-teal-700' : 'border-warm-muted/60 bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-warm-border">
            {currentSection !== 'technical' ? (
              <button
                onClick={() =>
                  setCurrentSection(currentSection === 'aptitude' ? 'soft_skills' : 'technical')
                }
                className="px-4 py-2 rounded border border-warm-border text-xs font-semibold text-warm-text hover:bg-warm-canvas flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Section</span>
              </button>
            ) : <div />}

            {currentSection !== 'aptitude' ? (
              <button
                onClick={() =>
                  setCurrentSection(currentSection === 'technical' ? 'soft_skills' : 'aptitude')
                }
                className="px-5 py-2 rounded bg-teal-700 text-xs font-semibold text-white hover:bg-teal-800 flex items-center gap-1.5 transition-colors"
              >
                <span>Next Section</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitAssessment}
                className="px-6 py-2 rounded bg-teal-700 text-xs font-semibold text-white hover:bg-teal-800 flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Finalize & Submit Test</span>
              </button>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
