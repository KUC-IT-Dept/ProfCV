import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ProfileBuilderSectionCardProps = {
  title: string;
  summary: string;
  expanded: boolean;
  onToggle: () => void;
  actions?: React.ReactNode;
  hideHeaderText?: boolean;
  children: React.ReactNode;
};

export default function ProfileBuilderSectionCard({
  title,
  summary,
  expanded,
  onToggle,
  actions,
  hideHeaderText = false,
  children,
}: ProfileBuilderSectionCardProps) {
  return (
    <div className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onToggle}
          style={{
            flex: '1 1 260px',
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.25rem 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {!hideHeaderText ? (
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <h3 style={{ fontSize: '0.9375rem', margin: 0 }}>{title}</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>{expanded ? 'Expanded' : 'Collapsed'}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {summary}
              </p>
            </div>
          ) : (
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '0.9375rem', margin: 0 }}>{title}</h3>
            </div>
          )}
          {expanded ? <ChevronUp size={14} color="var(--color-text-muted)" /> : <ChevronDown size={14} color="var(--color-text-muted)" />}
        </button>

        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end', marginLeft: 'auto' }}>
            {actions}
          </div>
        )}
      </div>

      {expanded && <div style={{ marginTop: '1rem' }}>{children}</div>}
    </div>
  );
}
