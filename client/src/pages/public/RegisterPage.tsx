import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GovHeader } from '../../components/common/GovHeader';
import { GovFooter } from '../../components/common/GovFooter';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { UserRole } from '../../types/shared';
import {
  Shield,
  GraduationCap,
  Building2,
  BookOpen,
  School,
  Lock,
  Mail,
  User as UserIcon,
  Phone
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Role-specific fields
  const [institutionName, setInstitutionName] = useState<string>('IIT Delhi');
  const [branch, setBranch] = useState<string>('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [companyName, setCompanyName] = useState<string>('');
  const [cinNumber, setCinNumber] = useState<string>('');
  const [sector, setSector] = useState<string>('Information Technology');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const profileData: any = {};
      if (role === 'student') {
        profileData.institutionName = institutionName;
        profileData.branch = branch;
        profileData.graduationYear = graduationYear;
      } else if (role === 'industry') {
        profileData.companyName = companyName || name;
        profileData.cinNumber = cinNumber;
        profileData.sector = sector;
      }

      const res = await api.register({
        name,
        email,
        password,
        role,
        phone,
        profileData
      });

      if (res.success) {
        showToast('Registration Complete', 'Your account has been created successfully!', 'success');
        navigate('/login');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
      showToast('Registration Error', err.message || 'Could not register', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-md mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2EFE9] border border-[#E5E1D9] text-[#245C56] text-xs font-medium mb-2">
            <Shield className="w-3.5 h-3.5 text-[#B96D4D]" />
            National Talent Onboarding
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#252B32] tracking-tight">
            Register on SkillBridge India
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Create an official account to unlock transparent skill gap reports and opportunities.
          </p>
        </div>

        <div className="bg-white rounded-md border border-[#E5E1D9] p-6 sm:p-8 shadow-xs">
          {errorMsg && (
            <div className="mb-6 p-3 rounded-md bg-[#FDF2F2] border border-[#F5D0D0] text-xs text-[#9E2A2B]">
              {errorMsg}
            </div>
          )}

          {/* Role Selector Grid */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-[#252B32] mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-3 rounded-md border text-center transition-colors ${
                  role === 'student'
                    ? 'bg-[#245C56] text-white border-[#245C56]'
                    : 'bg-[#F7F6F2] text-[#5C6470] border-[#E5E1D9] hover:bg-[#F2EFE9]'
                }`}
              >
                <GraduationCap className="w-4 h-4 mx-auto mb-1" />
                <div className="font-semibold text-xs">Student</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('industry')}
                className={`p-3 rounded-md border text-center transition-colors ${
                  role === 'industry'
                    ? 'bg-[#245C56] text-white border-[#245C56]'
                    : 'bg-[#F7F6F2] text-[#5C6470] border-[#E5E1D9] hover:bg-[#F2EFE9]'
                }`}
              >
                <Building2 className="w-4 h-4 mx-auto mb-1" />
                <div className="font-semibold text-xs">Industry</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('faculty')}
                className={`p-3 rounded-md border text-center transition-colors ${
                  role === 'faculty'
                    ? 'bg-[#245C56] text-white border-[#245C56]'
                    : 'bg-[#F7F6F2] text-[#5C6470] border-[#E5E1D9] hover:bg-[#F2EFE9]'
                }`}
              >
                <BookOpen className="w-4 h-4 mx-auto mb-1" />
                <div className="font-semibold text-xs">Faculty</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('institution_admin')}
                className={`p-3 rounded-md border text-center transition-colors ${
                  role === 'institution_admin'
                    ? 'bg-[#245C56] text-white border-[#245C56]'
                    : 'bg-[#F7F6F2] text-[#5C6470] border-[#E5E1D9] hover:bg-[#F2EFE9]'
                }`}
              >
                <School className="w-4 h-4 mx-auto mb-1" />
                <div className="font-semibold text-xs">Institution</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#252B32] mb-1">
                  {role === 'industry' ? 'Authorized Person Name *' : 'Full Legal Name *'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8C95A6] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-9 pr-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252B32] mb-1">Official / Academic Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C95A6] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.edu.in"
                    className="w-full pl-9 pr-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#252B32] mb-1">Phone Number (10 Digits)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C95A6] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252B32] mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C95A6] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2 border border-[#D0CBC0] rounded-md focus:border-[#245C56] focus:ring-1 focus:ring-[#245C56] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Role-specific section: Student */}
            {role === 'student' && (
              <div className="p-4 bg-[#F7F6F2] rounded-md border border-[#E5E1D9] space-y-3">
                <div className="font-semibold text-[#252B32]">Academic Affiliation</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#667085] mb-1">Institution Name</label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#D0CBC0] rounded-md bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#667085] mb-1">Academic Branch</label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#D0CBC0] rounded-md bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#667085] mb-1">Graduation Year</label>
                    <input
                      type="number"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(parseInt(e.target.value) || 2026)}
                      className="w-full px-2.5 py-1.5 border border-[#D0CBC0] rounded-md bg-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Role-specific section: Industry */}
            {role === 'industry' && (
              <div className="p-4 bg-[#F7F6F2] rounded-md border border-[#E5E1D9] space-y-3">
                <div className="font-semibold text-[#252B32]">Corporate Organization Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#667085] mb-1">Company Legal Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Tata Consultancy Services"
                      className="w-full px-2.5 py-1.5 border border-[#D0CBC0] rounded-md bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#667085] mb-1">CIN / Registration No.</label>
                    <input
                      type="text"
                      value={cinNumber}
                      onChange={(e) => setCinNumber(e.target.value)}
                      placeholder="L72200MH1995PLC095651"
                      className="w-full px-2.5 py-1.5 border border-[#D0CBC0] rounded-md bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#667085] mb-1">Industry Sector</label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#D0CBC0] rounded-md bg-white text-xs"
                    >
                      <option value="Information Technology">Information Technology</option>
                      <option value="Semiconductors & Electronics">Semiconductors & Electronics</option>
                      <option value="Heavy Manufacturing">Heavy Manufacturing</option>
                      <option value="Telecommunications">Telecommunications</option>
                      <option value="Renewable Energy">Renewable Energy</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-md text-xs font-medium bg-[#245C56] hover:bg-[#1B4742] text-white transition-colors disabled:opacity-50 shadow-xs"
              >
                {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </div>

            <div className="pt-4 text-center text-xs text-[#667085] border-t border-[#E5E1D9]">
              Already registered on the platform?{' '}
              <Link to="/login" className="font-semibold text-[#245C56] hover:underline">
                Sign In to Existing Account
              </Link>
            </div>
          </form>
        </div>
      </main>

      <GovFooter />
    </div>
  );
};
