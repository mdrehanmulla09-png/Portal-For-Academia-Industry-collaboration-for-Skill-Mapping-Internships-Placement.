import React from 'react';
import { ApplicationStatus, VerificationStatus } from '../../types/shared';

interface StatusBadgeProps {
  status: ApplicationStatus | VerificationStatus | string;
  type?: 'application' | 'verification' | 'collaboration';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-[#F2EFE9] text-[#5C6470] border-[#E5E1D9]';
  let dotColor = 'bg-[#8C95A6]';
  let label = status.replace('_', ' ').toUpperCase();

  switch (normalized) {
    case 'applied':
    case 'submitted':
      styles = 'bg-[#F0F4F8] text-[#2C4A6F] border-[#D3DFEE]';
      dotColor = 'bg-[#2C4A6F]';
      break;
    case 'under_review':
      styles = 'bg-[#FCF6EC] text-[#965814] border-[#F0DFBE]';
      dotColor = 'bg-[#965814]';
      label = 'UNDER REVIEW';
      break;
    case 'shortlisted':
      styles = 'bg-[#EBF2F1] text-[#245C56] border-[#CCE0DE]';
      dotColor = 'bg-[#245C56]';
      break;
    case 'interview':
      styles = 'bg-[#F6EEF8] text-[#693077] border-[#EAD5EF]';
      dotColor = 'bg-[#693077]';
      label = 'INTERVIEW SCHEDULED';
      break;
    case 'selected':
    case 'approved':
    case 'verified':
    case 'completed':
      styles = 'bg-[#F0F5F2] text-[#2E6B4A] border-[#D1E3D8] font-medium';
      dotColor = 'bg-[#2E6B4A]';
      break;
    case 'rejected':
      styles = 'bg-[#FDF2F2] text-[#9E2A2B] border-[#F5D0D0]';
      dotColor = 'bg-[#9E2A2B]';
      break;
    case 'in_progress':
      styles = 'bg-[#F0F7F9] text-[#205565] border-[#D0E6ED]';
      dotColor = 'bg-[#205565]';
      label = 'IN PROGRESS';
      break;
    case 'pending':
      styles = 'bg-[#FCF6EC] text-[#965814] border-[#F0DFBE]';
      dotColor = 'bg-[#965814]';
      label = 'PENDING REVIEW';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      {label}
    </span>
  );
};
