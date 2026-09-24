import React from 'react';

interface MatchScoreMeterProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchScoreMeter: React.FC<MatchScoreMeterProps> = ({
  score,
  showLabel = true,
  size = 'md'
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorClass = 'text-[#245C56] bg-[#EBF2F1] border-[#CCE0DE]';
  let barColor = 'bg-[#245C56]';
  let tierText = 'High Match';

  if (clampedScore < 65) {
    colorClass = 'text-[#5C6470] bg-[#F2EFE9] border-[#E5E1D9]';
    barColor = 'bg-[#8C95A6]';
    tierText = 'Foundational';
  } else if (clampedScore < 85) {
    colorClass = 'text-[#965814] bg-[#FCF6EC] border-[#F0DFBE]';
    barColor = 'bg-[#B96D4D]';
    tierText = 'Moderate Match';
  }

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${colorClass}`}
        title={`Calculated Skill Compatibility: ${clampedScore}%`}
      >
        {clampedScore}% Match
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full max-w-[140px]">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#252B32]">{clampedScore}%</span>
        {showLabel && <span className="text-[10px] text-[#667085] font-medium">{tierText}</span>}
      </div>
      <div className="w-full bg-[#E5E1D9] h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </div>
  );
};
