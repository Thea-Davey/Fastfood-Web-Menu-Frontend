import React from 'react';

interface ToggleButtonProps {
  label: string;
  subLabel?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const FLAVOR_COLORS: Record<string, { fill: string; stroke: string }> = {
  "Sriracha": { fill: '#FEB0B0', stroke: '#DE7577' },
  "Garlic Parmesan": { fill: '#FFFFD6', stroke: '#E7DA98' },
  "Honey Butter": { fill: '#FBEDC8', stroke: '#F3C596' },
  "Soy Garlic": { fill: '#FCDBAD', stroke: '#E89F87' },
  "Buffalo": { fill: '#FBC8B2', stroke: '#F4948A' },
  "Creamy Cajun": { fill: '#F7FBB3', stroke: '#EFDE97' },
};

const DIP_COLORS: Record<string, { fill: string; stroke: string }> = {
  "Creamy Cheese": { fill: '#FFF9D4', stroke: '#F0D57F' },
  "Garlic Mayo": { fill: '#FCFCF2', stroke: '#DDDDB5' },
  "Sriracha Mayo": { fill: '#FFE9D4', stroke: '#F5C29C' },
  "Catsup / Hot sauce": { fill: '#FFD6D6', stroke: '#EB9696' },
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({ label, subLabel, selected, onClick, disabled }) => {
  const customColors = FLAVOR_COLORS[label] || DIP_COLORS[label];
  
  // Base default unselected values
  let border = '1.5px solid #CBD5E1';
  let backgroundColor = '#FFFFFF';
  let color = '#1E293B';
  let cursor = 'pointer';

  const isDisabledState = disabled && !selected;

  if (selected) {
    if (customColors) {
      border = `1.5px solid ${customColors.stroke}`;
      backgroundColor = customColors.fill;
    } else {
      border = '1.5px solid var(--primary-color)';
      backgroundColor = 'var(--secondary-color)';
    }
    color = '#1E293B';
  } else if (isDisabledState) {
    border = '1.5px solid #E2E8F0';
    backgroundColor = '#F1F5F9';
    color = '#94A3B8';
    cursor = 'not-allowed';
  }

  return (
    <button
      onClick={onClick}
      disabled={isDisabledState}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 10px',
        border,
        borderRadius: '16px',
        backgroundColor,
        color,
        cursor,
        boxShadow: isDisabledState 
          ? 'none' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '72px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ 
        fontSize: '14px', 
        fontWeight: selected ? 700 : 500, 
        textAlign: 'center',
        lineHeight: 1.2
      }}>
        {label}
      </span>
      {subLabel && (
        <span style={{ 
          fontSize: '12px', 
          color: selected ? '#64748B' : 'var(--text-muted)', 
          marginTop: '4px',
          fontWeight: 500
        }}>
          {subLabel}
        </span>
      )}
    </button>
  );
};
