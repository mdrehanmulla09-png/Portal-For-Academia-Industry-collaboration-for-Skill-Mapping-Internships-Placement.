import React, { useState, useEffect } from 'react';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { LearningProgram } from '../../types/shared';
import {
  Search,
  Users,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const LearningProgramsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [programs, setPrograms] = useState<LearningProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.getLearningPrograms({
        search,
        type: selectedType
      });
      if (res.success) {
        setPrograms(res.programs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [selectedType]);

  const handleEnroll = async (program: LearningProgram) => {
    if (!user) {
      showToast('Authentication Required', 'Please log in to register for industry learning programs.', 'warning');
      return;
    }

    try {
      const res = await api.enrollInLearningProgram(program.id);
      if (res.success) {
        setEnrolledIds((prev) => [...prev, program.id]);
        showToast('Enrolled Successfully', `Registered for ${program.title}!`, 'success');
        fetchPrograms();
      }
    } catch (err: any) {
      showToast('Enrollment Error', err.message || 'Could not enroll in program.', 'error');
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
                Industry Learning Programs & Faculty Development
              </h1>
              <p className="text-xs text-[#667085] mt-0.5">
                Accredited corporate training, bridging masterclasses, and AICTE-aligned FDPs designed to resolve skill gaps.
              </p>
            </div>
            <span className="text-xs font-medium text-[#667085]">
              Showing <strong>{programs.length}</strong> active programs
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-md border border-[#E5E1D9] shadow-xs mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-[#8C95A6] absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchPrograms(); }}
                placeholder="Search programs by skill (e.g. Docker, PyTorch, Kubernetes)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
              />
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#D0CBC0] rounded-md bg-white focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
              >
                <option value="all">All Program Categories</option>
                <option value="micro_course">Skill Bridging Micro-Courses (2-4 Weeks)</option>
                <option value="bootcamp">Intensive Corporate Bootcamps (8-12 Weeks)</option>
                <option value="fdp">Faculty Development Programs (FDP)</option>
                <option value="certification">Professional Industry Certifications</option>
              </select>
            </div>
          </div>
        </div>

        {/* Program Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-[#667085] font-medium">
            Loading accredited learning programs...
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white rounded-md border border-[#E5E1D9] p-12 text-center shadow-xs">
            <p className="text-sm font-semibold text-[#252B32]">No programs match your search criteria.</p>
            <p className="text-xs text-[#667085] mt-1">Try clearing search terms or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((prog) => {
              const isEnrolled = enrolledIds.includes(prog.id);
              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-md border border-[#E5E1D9] p-5 shadow-xs hover:border-[#D0CBC0] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <span className="text-[10px] font-semibold uppercase bg-[#EBF2F1] text-[#245C56] border border-[#CCE0DE] px-2 py-0.5 rounded">
                        {prog.type.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-[#8C95A6] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {prog.duration}
                      </span>
                    </div>

                    <h3 className="font-semibold text-[#252B32] text-sm leading-snug">{prog.title}</h3>
                    <div className="text-xs text-[#667085] font-medium mt-0.5">{prog.provider}</div>

                    <p className="text-xs text-[#667085] mt-2.5 line-clamp-3 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Covered Competencies */}
                    <div className="mt-4">
                      <div className="text-[10px] uppercase font-semibold text-[#8C95A6] tracking-wider mb-1.5">
                        Competencies Covered
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {prog.skillsCovered.map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#F2EFE9] text-[#5C6470] font-medium px-1.5 py-0.5 rounded"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#E5E1D9] flex items-center justify-between">
                    <span className="text-xs text-[#667085] flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#8C95A6]" />
                      {prog.enrollmentCount.toLocaleString()} Enrolled
                    </span>

                    <button
                      onClick={() => handleEnroll(prog)}
                      disabled={isEnrolled}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-xs ${
                        isEnrolled
                          ? 'bg-[#F0F5F2] text-[#2E6B4A] border border-[#D1E3D8]'
                          : 'bg-[#245C56] hover:bg-[#1B4742] text-white'
                      }`}
                    >
                      {isEnrolled ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4A]" /> Enrolled
                        </span>
                      ) : (
                        'Register Now'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <GovFooter />
    </div>
  );
};
