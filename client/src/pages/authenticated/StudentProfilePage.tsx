import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { StudentProfile, SkillProficiencyLevel } from '../../types/shared';
import { SkillBadge } from '../../components/common/SkillBadge';
import {
  User,
  GraduationCap,
  Award,
  Save,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form states
  const [fullName, setFullName] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [degree, setDegree] = useState<string>('B.Tech');
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [bio, setBio] = useState<string>('');
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [careerInterests, setCareerInterests] = useState<string>('');

  // Add skill state
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillProficiencyLevel>('intermediate');

  useEffect(() => {
    api.getMyPortfolio()
      .then((res) => {
        if (res.success && res.portfolio) {
          const p = res.portfolio;
          setProfile(p);
          setFullName(p.fullName || '');
          setInstitutionName(p.institutionName || '');
          setBranch(p.branch || '');
          setDegree(p.degree || 'B.Tech');
          setCgpa(p.cgpa || 8.0);
          setGraduationYear(p.graduationYear || 2026);
          setBio(p.bio || '');
          setResumeUrl(p.resumeUrl || '');
          setCareerInterests(p.careerInterests?.join(', ') || '');
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const interestsArray = careerInterests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.updateMyPortfolio({
        fullName,
        institutionName,
        branch,
        degree,
        cgpa: Number(cgpa),
        graduationYear: Number(graduationYear),
        bio,
        resumeUrl,
        careerInterests: interestsArray
      });

      if (res.success) {
        setProfile(res.portfolio);
        showToast('Profile Updated', 'Academic profile saved successfully.', 'success');
      }
    } catch (err: any) {
      showToast('Update Failed', err.message || 'Could not update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim() || !profile) return;

    const updatedSkills = [
      ...profile.skills,
      {
        skill: newSkillName.trim(),
        level: newSkillLevel,
        verified: false,
        assessed: false,
        source: 'self_reported' as const
      }
    ];

    try {
      const res = await api.updateMyPortfolio({ skills: updatedSkills });
      if (res.success) {
        setProfile(res.portfolio);
        setNewSkillName('');
        showToast('Skill Added', `${newSkillName} added to profile as self-reported.`, 'info');
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not add skill', 'error');
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    if (!profile) return;
    const updatedSkills = profile.skills.filter((s) => s.skill !== skillToRemove);

    try {
      const res = await api.updateMyPortfolio({ skills: updatedSkills });
      if (res.success) {
        setProfile(res.portfolio);
        showToast('Skill Removed', `Removed ${skillToRemove} from profile.`, 'info');
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not remove skill', 'error');
    }
  };

  return (
    <DashboardLayout
      allowedRoles={['student']}
      title="Academic Profile & Credentials"
      subtitle="Maintain verified academic records, target career fields, and technical competencies."
    >
      {loading ? (
        <div className="py-16 text-center text-xs text-warm-muted font-medium">
          Loading student profile...
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl">
          {/* Main Edit Form */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-lg border border-warm-border p-6 sm:p-8 space-y-6 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-warm-border">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-700" />
                <h3 className="font-semibold text-warm-text text-sm">Academic Details & Bio</h3>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-warm-text block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-warm-text block mb-1">Institution / College Name *</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="font-semibold text-warm-text block mb-1">Degree *</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full p-2.5 border border-warm-border rounded bg-white focus:border-teal-700 focus:outline-none"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E.">B.E.</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="Dual Degree">Dual Degree</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc / M.Sc">B.Sc / M.Sc</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-warm-text block mb-1">Branch / Major *</label>
                <input
                  type="text"
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-warm-text block mb-1">Cumulative CGPA *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-warm-text block mb-1">Target Graduation Year *</label>
                <input
                  type="number"
                  required
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-warm-text block mb-1">
                  Resume Link (PDF / Cloud Drive URL)
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-warm-text block mb-1">
                Career Interests (Comma Separated)
              </label>
              <input
                type="text"
                value={careerInterests}
                onChange={(e) => setCareerInterests(e.target.value)}
                placeholder="Full Stack Engineering, AI/ML, Cloud DevOps"
                className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-warm-text block mb-1">Professional Summary / Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of engineering interests, projects, and goals..."
                className="w-full p-2.5 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
              />
            </div>
          </form>

          {/* Skill Management Card */}
          <div className="bg-white rounded-lg border border-warm-border p-6 sm:p-8 space-y-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-warm-border">
              <div>
                <h3 className="font-semibold text-warm-text text-sm">Competency & Skill Profile</h3>
                <p className="text-[11px] text-warm-muted mt-0.5">
                  Distinguishes verified credentials, platform-assessed scores, and self-reported proficiencies.
                </p>
              </div>
            </div>

            {/* Existing Skills */}
            <div className="flex flex-wrap gap-2">
              {profile?.skills.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5 p-1 rounded bg-warm-canvas/50 border border-warm-border">
                  <SkillBadge
                    skill={s.skill}
                    level={s.level}
                    verified={s.verified}
                    assessed={s.assessed}
                    source={s.source}
                  />
                  {!s.verified && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s.skill)}
                      className="text-warm-muted hover:text-terracotta-700 p-0.5 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Skill */}
            <div className="pt-4 border-t border-warm-border space-y-3">
              <div className="font-semibold text-warm-text">Add Self-Reported Skill</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Skill name (e.g. Docker, GraphQL, PyTorch)..."
                    className="w-full p-2 border border-warm-border rounded focus:border-teal-700 focus:outline-none"
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
                    className="w-full py-2 px-4 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
