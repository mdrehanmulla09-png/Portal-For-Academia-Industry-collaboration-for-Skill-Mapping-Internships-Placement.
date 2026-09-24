import React from 'react';
import { CheckCircle2, Award } from 'lucide-react';
import { SkillProficiencyLevel } from '../../types/shared';

interface SkillBadgeProps {
  skill: string;
  level?: SkillProficiencyLevel;
  verified?: boolean;
  assessed?: boolean;
  source?: 'self_reported' | 'assessed' | 'credential_verified';
  size?: 'sm' | 'md';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  level = 'intermediate',
  verified = false,
  assessed = false,
  source = 'self_reported',
  size = 'md'
}) => {
  const isVerified = verified || source === 'credential_verified';
  const isAssessed = assessed || source === 'assessed';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${
        isVerified
          ? 'bg-[#F0F5F2] text-[#2E6B4A] border-[#D1E3D8]'
          : isAssessed
          ? 'bg-[#EBF2F1] text-[#245C56] border-[#CCE0DE]'
          : 'bg-white text-[#252B32] border-[#E5E1D9]'
      }`}
      title={`Skill: ${skill} | Level: ${level} | Source: ${
        isVerified ? 'Credential Verified' : isAssessed ? 'Platform Assessed' : 'Self-Reported'
      }`}
    >
      {isVerified ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4A] shrink-0" />
      ) : isAssessed ? (
        <Award className="w-3.5 h-3.5 text-[#245C56] shrink-0" />
      ) : null}

      <span className="font-medium text-[#252B32]">{skill}</span>

      {level && (
        <span
          className="text-[9px] uppercase px-1 py-0.5 rounded font-semibold tracking-wider bg-[#F2EFE9] text-[#667085]"
        >
          {level.substring(0, 3)}
        </span>
      )}

      {isVerified && (
        <span className="text-[9px] bg-[#D1E3D8] text-[#2E6B4A] font-semibold px-1 rounded">
          Verified
        </span>
      )}
    </span>
  );
};
