import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { OpportunityType, WorkMode, SkillRequirement, SkillProficiencyLevel } from '../../types/shared';
import { PlusCircle, Trash2, Save, ArrowLeft, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PostOpportunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<OpportunityType>('internship');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('Bengaluru / Hybrid');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [duration, setDuration] = useState<string>('6 Months');
  const [stipendOrSalary, setStipendOrSalary] = useState<string>('₹35,000 / month');
  const [applicationDeadline, setApplicationDeadline] = useState<string>('2026-11-30');
  const [openings, setOpenings] = useState<number>(5);
  const [minCgpa, setMinCgpa] = useState<number>(7.5);

  // Dynamic Skill Requirements
  const [requiredSkills, setRequiredSkills] = useState<SkillRequirement[]>([
    { skill: 'React.js', requiredLevel: 'intermediate', weight: 5 },
    { skill: 'Node.js', requiredLevel: 'intermediate', weight: 4 }
  ]);
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillProficiencyLevel>('intermediate');
  const [newSkillWeight, setNewSkillWeight] = useState<number>(4);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setRequiredSkills((prev) => [
      ...prev,
      { skill: newSkillName.trim(), requiredLevel: newSkillLevel, weight: Number(newSkillWeight) }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (index: number) => {
    setRequiredSkills((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || requiredSkills.length === 0) {
      showToast('Validation Error', 'Title and at least one required skill are mandatory.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createOpportunity({
        title,
        type,
        description,
        location,
        workMode,
        duration,
        stipendOrSalary,
        applicationDeadline,
        openings: Number(openings),
        requiredSkills,
        eligibility: {
          minCgpa: Number(minCgpa)
        }
      });

      if (res.success) {
        showToast('Opportunity Published', `${title} is now active on the national portal!`, 'success');
        navigate('/industry/dashboard');
      }
    } catch (err: any) {
      showToast('Posting Failed', err.message || 'Could not post opportunity', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      allowedRoles={['industry', 'platform_admin']}
      title="Publish New Opportunity"
      subtitle="Define roles, compensation, and required competencies with weighted algorithmic priorities."
    >
      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-warm-border p-6 sm:p-8 space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-warm-border">
            <Link to="/industry/dashboard" className="text-warm-muted hover:text-warm-text flex items-center gap-1 font-semibold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish to National Portal'}</span>
            </button>
          </div>

          <div>
            <label className="font-semibold text-warm-text block mb-1">Opportunity Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Systems & Cloud DevOps Intern"
              className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-warm-text block mb-1">Opportunity Category *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OpportunityType)}
                className="w-full p-2.5 border border-warm-border rounded bg-white focus:border-teal-700 focus:outline-none"
              >
                <option value="internship">Student Internship</option>
                <option value="job">Entry-Level Placement</option>
                <option value="apprenticeship">Apprenticeship</option>
                <option value="live_project">Live Capstone Project</option>
                <option value="fdp">Faculty Dev Program (FDP)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-warm-text block mb-1">Work Mode *</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full p-2.5 border border-warm-border rounded bg-white focus:border-teal-700 focus:outline-none"
              >
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
                <option value="on_site">On-site</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-warm-text block mb-1">Location *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru / Remote"
                className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold text-warm-text block mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 6 Months"
                className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-warm-text block mb-1">Stipend / CTC</label>
              <input
                type="text"
                value={stipendOrSalary}
                onChange={(e) => setStipendOrSalary(e.target.value)}
                placeholder="₹35,000 / month"
                className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-warm-text block mb-1">Openings</label>
              <input
                type="number"
                min="1"
                value={openings}
                onChange={(e) => setOpenings(Number(e.target.value))}
                className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-warm-text block mb-1">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
                className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-warm-text block mb-1">Application Deadline</label>
            <input
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              className="w-full sm:w-1/2 p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-warm-text block mb-1">Role Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline project responsibilities, team structure, and mentorship guidelines..."
              className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
            />
          </div>

          {/* Required Skills Management */}
          <div className="pt-4 border-t border-warm-border space-y-4">
            <div>
              <h4 className="font-semibold text-warm-text text-sm">Define Required Skills & Weights</h4>
              <p className="text-[11px] text-warm-muted mt-0.5">
                The AI Recommendation engine uses these weights to score candidate compatibility accurately.
              </p>
            </div>

            <div className="space-y-2">
              {requiredSkills.map((req, idx) => (
                <div key={idx} className="p-3 bg-warm-canvas/50 rounded border border-warm-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-warm-text">{req.skill}</span>
                    <span className="text-[10px] bg-warm-canvas text-warm-text border border-warm-border px-2 py-0.5 rounded font-semibold uppercase">
                      {req.requiredLevel}
                    </span>
                    <span className="text-warm-muted text-[11px]">Weight: {req.weight}/5</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-warm-muted hover:text-terracotta-700 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add skill input row */}
            <div className="p-3.5 bg-warm-canvas/40 rounded border border-warm-border grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Skill name (e.g. Docker, Python)..."
                  className="w-full p-2 border border-warm-border rounded bg-white focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as SkillProficiencyLevel)}
                  className="w-full p-2 border border-warm-border rounded bg-white focus:border-teal-700 focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800 transition-colors"
                >
                  + Add Requirement
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
