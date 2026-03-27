import React, { useEffect, useRef, useState } from 'react';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

type FacultyUser = { _id: string; name: string; email: string; department: string | null; role: string };

const COLUMNS = [
  { key: 'name',         label: 'Name'             },
  { key: 'email',        label: 'Email'            },
  { key: 'department',   label: 'Department'       },
  { key: 'role',         label: 'Role'             },
  { key: 'subjects',     label: 'Subjects Taught'  },
  { key: 'publications', label: 'Publications'     },
  { key: 'projects',     label: 'Research Projects'},
  { key: 'qualifications',label: 'Qualifications'  },
  { key: 'bio',          label: 'Biography'        },
  { key: 'customDetails',label: 'Custom Sections'  },
];

/** Print CSS injected once into the document head */
const PRINT_CSS = `
@media print {
  body * { visibility: hidden; display: none; }
  #dept-export-wrapper, #dept-export-wrapper * { visibility: visible !important; display: revert !important; }
  #dept-export-wrapper {
    position: fixed !important; inset: 0 !important;
    width: 100% !important; height: auto !important;
    background: #fff !important; z-index: 9999 !important;
    padding: 1.5cm !important; overflow: visible !important;
    font-family: Arial, sans-serif !important; font-size: 10pt !important; color: #000 !important;
  }
  #dept-export-wrapper table { width: 100%; border-collapse: collapse; }
  #dept-export-wrapper th { background: #1D4ED8; color: #fff; padding: 6px 8px; text-align: left; font-size: 9pt; }
  #dept-export-wrapper td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; font-size: 9pt; vertical-align: top; }
  #dept-export-wrapper tr:nth-child(even) td { background: #f8fafc; }
}
`;

export default function ManagerialExportPage() {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState<FacultyUser[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedCols, setSelectedCols] = useState<Set<string>>(
    new Set(['name', 'email', 'department', 'role'])
  );
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState<'csv' | 'excel' | null>(null);
  const styleInjected = useRef(false);

  useEffect(() => {
    // Inject print CSS once
    if (!styleInjected.current) {
      const style = document.createElement('style');
      style.textContent = PRINT_CSS;
      document.head.appendChild(style);
      styleInjected.current = true;
    }
    api.get('/directory').then((r) => {
      setFaculty(r.data);
      setSelectedIds(new Set(r.data.map((u: FacultyUser) => u._id)));
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const toggleId = (id: string) =>
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleCol = (col: string) =>
    setSelectedCols((prev) => { const n = new Set(prev); n.has(col) ? n.delete(col) : n.add(col); return n; });

  const toggleAll = () =>
    setSelectedIds(selectedIds.size === faculty.length ? new Set() : new Set(faculty.map(f => f._id)));

  const doExport = async (format: 'csv' | 'excel') => {
    if (selectedIds.size === 0) return;
    setExporting(format);
    const ids = Array.from(selectedIds).join(',');
    const columns = Array.from(selectedCols).join(',');
    try {
      const res = await api.get('/directory/export', {
        params: { ids, columns, format },
        responseType: 'blob',
      });
      const ext = format === 'excel' ? 'xlsx' : 'csv';
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `faculty_export.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* silent */ }
    setExporting(null);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  // Selected faculty for print table
  const selectedFaculty = faculty.filter(f => selectedIds.has(f._id));
  const activeCols = COLUMNS.filter(c => selectedCols.has(c.key));

  return (
    <div>
      <div className="page-header">
        <h1>Data Export</h1>
        <p>Select faculty members and data columns, then export as CSV, Excel, or PDF.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Faculty selector */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.9375rem' }}>Select Faculty ({selectedIds.size} of {faculty.length})</h3>
            <button className="btn btn-ghost" onClick={toggleAll} style={{ fontSize: '0.8125rem' }}>
              {selectedIds.size === faculty.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          {isLoading ? (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {faculty.map((f) => (
                <label key={f._id} className="checkbox-label" style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input type="checkbox" checked={selectedIds.has(f._id)} onChange={() => toggleId(f._id)} id={`faculty-${f._id}`} />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-text)' }}>{f.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{f.department ?? 'No department'} · {f.role}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Column selector + export */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.9375rem' }}>Data Columns</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {COLUMNS.map((c) => (
                <label key={c.key} className="checkbox-label">
                  <input type="checkbox" checked={selectedCols.has(c.key)} onChange={() => toggleCol(c.key)} id={`col-${c.key}`} />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => doExport('csv')}
              disabled={selectedIds.size === 0 || exporting !== null}
              id="export-csv-btn"
            >
              {exporting === 'csv' ? <span className="spinner" style={{ width: 15, height: 15 }} /> : <Download size={15} />}
              Export CSV
            </button>
            <button
              className="btn btn-primary"
              onClick={() => doExport('excel')}
              disabled={selectedIds.size === 0 || exporting !== null}
              id="export-excel-btn"
            >
              {exporting === 'excel' ? <span className="spinner" style={{ width: 15, height: 15 }} /> : <FileSpreadsheet size={15} />}
              Export Excel
            </button>
            <button
              className="btn btn-secondary"
              onClick={handlePrintPdf}
              disabled={selectedIds.size === 0}
              id="export-pdf-btn"
              style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
            >
              <Printer size={15} /> Export PDF
            </button>
          </div>

          {selectedIds.size === 0 && (
            <div className="alert alert-info">Select at least one faculty member to export.</div>
          )}
        </div>
      </div>

      {/* ── Hidden print wrapper — always in DOM ──────────────────────────── */}
      <div id="dept-export-wrapper" style={{ display: 'none' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '18pt', color: '#0F172A', marginBottom: '4px' }}>
            {user?.department ? `${user.department} — ` : ''}Faculty Data Report
          </h1>
          <p style={{ fontSize: '9pt', color: '#64748B' }}>
            Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {selectedFaculty.length} faculty member{selectedFaculty.length !== 1 ? 's' : ''}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              {activeCols.map(c => <th key={c.key}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {selectedFaculty.map((f) => (
              <tr key={f._id}>
                {activeCols.map(c => {
                  let val: string = '';
                  if (c.key === 'name') val = f.name;
                  else if (c.key === 'email') val = f.email;
                  else if (c.key === 'department') val = f.department || '—';
                  else if (c.key === 'role') val = f.role;
                  else val = '(see CSV/Excel for profile data)';
                  return <td key={c.key}>{val}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '8pt', color: '#94A3B8', marginTop: '2rem', textAlign: 'center' }}>
          Prof CV · Academic Portfolio Platform
        </p>
      </div>
    </div>
  );
}
