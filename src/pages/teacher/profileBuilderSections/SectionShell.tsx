import React from 'react';

type SectionShellProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function SectionShell({ title, description, children }: SectionShellProps) {
  return (
    <section className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', margin: 0 }}>{title}</h2>
        {description ? (
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            {description}
          </p>
        ) : null}
      </div>
      {children ? children : (
        <div
          style={{
            minHeight: '140px',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(248,250,252,0.9))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-light)',
            fontSize: '0.875rem',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          {title} fields will go here.
        </div>
      )}
    </section>
  );
}
