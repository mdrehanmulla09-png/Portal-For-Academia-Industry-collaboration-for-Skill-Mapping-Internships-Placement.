import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { UserRole } from '../../types/shared';
import {
  Shield,
  GraduationCap,
  Building2,
  BookOpen,
  School,
  Lock,
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('student@skillbridge.gov.in');
  const [password, setPassword] = useState<string>('password123');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await login(email, password);
      showToast('Login Successful', 'Welcome back to SkillBridge India!', 'success');
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
      showToast('Authentication Error', err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      await demoLogin(role);
      showToast('Demo Switch Active', `Logged in as demo ${role.replace('_', ' ')}!`, 'success');

      switch (role) {
        case 'student': navigate('/student/dashboard'); break;
        case 'industry': navigate('/industry/dashboard'); break;
        case 'faculty': navigate('/faculty/dashboard'); break;
        case 'institution_admin': navigate('/institution/dashboard'); break;
        case 'platform_admin': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title */}
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2EFE9] border border-[#E5E1D9] text-[#245C56] text-xs font-medium mb-2">
            <Shield className="w-3.5 h-3.5 text-[#B96D4D]" />
            National Identity Access Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#252B32] tracking-tight">
            Sign In to SkillBridge India
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Access your verified digital portfolio, opportunity pipelines, or institutional dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Instant Evaluator Fast-Pass */}
          <div className="lg:col-span-5 bg-[#162332] text-white p-5 rounded-md border border-[#223246] space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#223246]">
              <Sparkles className="w-4 h-4 text-[#B96D4D]" />
              <div>
                <h3 className="font-semibold text-xs text-white">Evaluator One-Click Pass</h3>
                <p className="text-[11px] text-[#A6B4C4]">Select any persona to test full workflows instantly:</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="w-full p-2.5 rounded-md bg-[#223246] hover:bg-[#2D415A] border border-[#2D415A] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-xs text-[#F7F6F2] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#B96D4D]" />
                    Student Persona
                  </div>
                  <div className="text-[11px] text-[#A6B4C4] mt-0.5">Arjun Sharma (IIT Delhi, CS Undergrad)</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('industry')}
                className="w-full p-2.5 rounded-md bg-[#223246] hover:bg-[#2D415A] border border-[#2D415A] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-xs text-[#F7F6F2] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#245C56]" />
                    Industry Recruiter
                  </div>
                  <div className="text-[11px] text-[#A6B4C4] mt-0.5">Priya Nair (Tata Tech Talent Lead)</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('faculty')}
                className="w-full p-2.5 rounded-md bg-[#223246] hover:bg-[#2D415A] border border-[#2D415A] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-xs text-[#F7F6F2] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#2E6B4A]" />
                    Academician / Faculty
                  </div>
                  <div className="text-[11px] text-[#A6B4C4] mt-0.5">Dr. Rajesh Verma (Prof of AI, IITD)</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('institution_admin')}
                className="w-full p-2.5 rounded-md bg-[#223246] hover:bg-[#2D415A] border border-[#2D415A] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-xs text-[#F7F6F2] flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-[#693077]" />
                    Institution Admin
                  </div>
                  <div className="text-[11px] text-[#A6B4C4] mt-0.5">Prof. Ramanathan (Director Placements)</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('platform_admin')}
                className="w-full p-2.5 rounded-md bg-[#223246] hover:bg-[#2D415A] border border-[#2D415A] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-xs text-[#F7F6F2] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#B96D4D]" />
                    Platform Admin
                  </div>
                  <div className="text-[11px] text-[#A6B4C4] mt-0.5">National Nodal Officer (Admin Approvals)</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Standard Credential Form */}
          <div className="lg:col-span-7 bg-white rounded-md border border-[#E5E1D9] p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-[#252B32] mb-1">Standard Sign In</h2>
            <p className="text-xs text-[#667085] mb-5">Enter registered account credentials or use the Fast Pass options.</p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-md bg-[#FDF2F2] border border-[#F5D0D0] text-xs text-[#9E2A2B]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252B32] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C95A6] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                    placeholder="name@domain.edu.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252B32] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C95A6] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="text-[10px] text-[#8C95A6] mt-1">Default demo password: <code>password123</code></div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-md text-xs font-medium bg-[#245C56] hover:bg-[#1B4742] text-white transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isLoading ? 'Signing In...' : 'Sign In with Password'}
                </button>
              </div>

              <div className="pt-4 text-center text-xs text-[#667085] border-t border-[#E5E1D9]">
                Don't have an account yet?{' '}
                <Link to="/register" className="font-semibold text-[#B96D4D] hover:underline">
                  Register for SkillBridge India
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
};
