import React, { ReactNode } from 'react';
import { GovHeader } from './GovHeader';
import { GovFooter } from './GovFooter';
import { RoleSidebar } from './RoleSidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  allowedRoles,
  title,
  subtitle
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F2]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#D0CBC0] border-t-[#245C56] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#667085] font-medium">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
        <GovHeader />
        <div className="flex-1 max-w-xl mx-auto flex items-center justify-center p-6 text-center">
          <div className="p-8 bg-white rounded-lg border border-[#E5E1D9] shadow-xs">
            <h2 className="text-lg font-bold text-[#252B32]">Restricted Module</h2>
            <p className="text-xs text-[#667085] mt-2">
              Your active role (<strong>{user.role}</strong>) does not have access permissions for this workspace.
            </p>
          </div>
        </div>
        <GovFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
      <GovHeader />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <RoleSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {(title || subtitle) && (
            <div className="mb-6 pb-4 border-b border-[#E5E1D9]">
              {title && <h1 className="text-xl font-bold text-[#252B32] tracking-tight">{title}</h1>}
              {subtitle && <p className="text-xs text-[#667085] mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
      <GovFooter />
    </div>
  );
};
