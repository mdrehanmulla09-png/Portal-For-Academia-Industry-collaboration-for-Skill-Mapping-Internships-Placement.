import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Bell,
  LogOut,
  LayoutDashboard,
  Shield,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../../types/shared';

export const GovHeader: React.FC = () => {
  const { user, logout, demoLogin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContrastHigh, setIsContrastHigh] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const toggleContrast = () => {
    document.body.classList.toggle('high-contrast');
    setIsContrastHigh(!isContrastHigh);
  };

  const changeFontSize = (delta: number) => {
    const root = document.documentElement;
    const currentSize = parseFloat(window.getComputedStyle(root).fontSize);
    root.style.fontSize = `${Math.min(20, Math.max(13, currentSize + delta))}px`;
  };

  const getDashboardRoute = (role?: UserRole) => {
    switch (role) {
      case 'student': return '/student/dashboard';
      case 'industry': return '/industry/dashboard';
      case 'faculty': return '/faculty/dashboard';
      case 'institution_admin': return '/institution/dashboard';
      case 'platform_admin': return '/admin/dashboard';
      default: return '/login';
    }
  };

  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E1D9] shadow-xs no-print">
      {/* 1. Dignified National Tricolor Line */}
      <div className="gov-tricolor-bar" />

      {/* 2. Top Administrative & Accessibility Strip */}
      <div className="bg-[#162332] text-[#E2E8F0] text-xs px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#223246]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#F7F6F2]">
            <Shield className="w-3.5 h-3.5 text-[#B96D4D]" />
            Government of India Initiative
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-300">
            Problem Statement ID: <strong className="text-white font-semibold">26044</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 1-Click Fast Pass Evaluator Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-[#223246] px-2 py-0.5 rounded text-[11px] border border-[#2D415A]">
            <span className="text-slate-400 font-medium mr-1">Fast Pass:</span>
            <button
              onClick={() => { demoLogin('student'); navigate('/student/dashboard'); }}
              className="text-slate-200 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#162332] transition-colors"
              title="Test as Demo Student"
            >
              Student
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => { demoLogin('industry'); navigate('/industry/dashboard'); }}
              className="text-slate-200 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#162332] transition-colors"
              title="Test as Demo Recruiter"
            >
              Industry
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => { demoLogin('faculty'); navigate('/faculty/dashboard'); }}
              className="text-slate-200 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#162332] transition-colors"
              title="Test as Demo Faculty"
            >
              Faculty
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => { demoLogin('institution_admin'); navigate('/institution/dashboard'); }}
              className="text-slate-200 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#162332] transition-colors"
              title="Test as Institution Admin"
            >
              Institution
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => { demoLogin('platform_admin'); navigate('/admin/dashboard'); }}
              className="text-slate-200 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#162332] transition-colors"
              title="Test as Platform Admin"
            >
              Admin
            </button>
          </div>

          {/* Accessibility controls */}
          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={() => changeFontSize(-1)}
              className="px-1.5 py-0.5 rounded hover:bg-[#223246] font-semibold text-slate-300"
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => { document.documentElement.style.fontSize = '16px'; }}
              className="px-1.5 py-0.5 rounded hover:bg-[#223246] font-semibold text-slate-300"
              title="Reset Font Size"
            >
              A
            </button>
            <button
              onClick={() => changeFontSize(1)}
              className="px-1.5 py-0.5 rounded hover:bg-[#223246] font-semibold text-slate-300"
              title="Increase Font Size"
            >
              A+
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={toggleContrast}
              className="px-1.5 py-0.5 rounded hover:bg-[#223246] font-medium text-slate-300"
              title="Toggle High Contrast"
            >
              {isContrastHigh ? 'Standard' : 'High Contrast'}
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-1.5 py-0.5 rounded hover:bg-[#223246] font-medium text-[#D1E3D8]"
              title="Toggle Language"
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Header & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-md bg-[#245C56] text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5 text-[#F7F6F2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#252B32]">
                SkillBridge <span className="text-[#245C56]">India</span>
              </span>
              <span className="text-[10px] bg-[#F2EFE9] text-[#667085] font-semibold px-1.5 py-0.5 rounded border border-[#E5E1D9]">
                Prototype
              </span>
            </div>
            <p className="text-[11px] text-[#667085] font-medium leading-none mt-0.5 hidden sm:block">
              Academia–Industry Collaboration Portal
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-[13px] font-medium text-[#252B32]">
          {[
            { path: '/', label: 'Home' },
            { path: '/about', label: 'About' },
            { path: '/how-it-works', label: 'How It Works' },
            { path: '/skill-development', label: 'Skills' },
            { path: '/internships', label: 'Internships' },
            { path: '/placements', label: 'Placements' },
            { path: '/learning', label: 'Learning' },
            { path: '/collaboration', label: 'Collaboration' }
          ].map((item) => {
            const active = isActiveLink(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  active
                    ? 'text-[#245C56] bg-[#EBF2F1] font-semibold'
                    : 'text-[#5C6470] hover:text-[#252B32] hover:bg-[#F2EFE9]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Authentication Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-[#5C6470] hover:text-[#252B32] rounded-md hover:bg-[#F2EFE9] relative transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B96D4D] rounded-full" />
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-card border border-[#E5E1D9] overflow-hidden z-50">
                    <div className="p-3 bg-[#F7F6F2] border-b border-[#E5E1D9] flex items-center justify-between">
                      <div className="font-semibold text-[#252B32] text-xs flex items-center gap-2">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] bg-[#FCF6EC] text-[#965814] px-1.5 py-0.5 rounded font-semibold border border-[#F0DFBE]">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-[#245C56] hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E1D9]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#8C95A6]">
                          No notifications at this time.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              markAsRead(item.id);
                              if (item.linkUrl) {
                                setIsNotifOpen(false);
                                navigate(item.linkUrl);
                              }
                            }}
                            className={`p-3 text-xs hover:bg-[#FAF9F5] cursor-pointer transition-colors ${
                              !item.isRead ? 'bg-[#F2EFE9]/60' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-[#252B32]">{item.title}</span>
                              <span className="text-[10px] text-[#8C95A6] whitespace-nowrap">
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[#667085] mt-1 line-clamp-2">{item.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dashboard Button */}
              <Link
                to={getDashboardRoute(user.role)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#245C56] text-white rounded-md hover:bg-[#1B4742] transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#E5E1D9]">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-[#252B32] leading-tight">{user.name}</div>
                  <div className="text-[10px] text-[#667085] capitalize">
                    {user.role.replace('_', ' ')}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-[#667085] hover:text-[#9E2A2B] rounded-md hover:bg-[#F2EFE9] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium text-[#252B32] hover:text-[#245C56] rounded-md hover:bg-[#F2EFE9] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 text-xs font-medium bg-[#245C56] text-white rounded-md hover:bg-[#1B4742] transition-colors shadow-xs"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-[#5C6470] xl:hidden rounded-md hover:bg-[#F2EFE9]"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#252B32]" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#E5E1D9] px-4 pt-2 pb-4 space-y-1 shadow-card">
          {[
            { path: '/', label: 'Home' },
            { path: '/about', label: 'About' },
            { path: '/how-it-works', label: 'How It Works' },
            { path: '/skill-development', label: 'Skill Development' },
            { path: '/internships', label: 'Internships' },
            { path: '/placements', label: 'Placements' },
            { path: '/learning', label: 'Learning Programs' },
            { path: '/collaboration', label: 'Academia-Industry Collaboration' },
            { path: '/contact', label: 'Contact & Help' }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-xs font-medium text-[#252B32] hover:bg-[#F2EFE9]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
