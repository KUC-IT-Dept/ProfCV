import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ExternalLink, UserPlus, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

type FacultyUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
};

type AddFacultyForm = {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
};

const EMPTY_FORM: AddFacultyForm = { name: '', email: '', password: 'password123', role: 'TEACHER', department: '' };

const ROLE_BADGE: Record<string, string> = {
  SUPERADMIN: 'badge badge-superadmin',
  VC: 'badge badge-vc',
  HOD: 'badge badge-hod',
  TEACHER: 'badge badge-teacher',
};

const col = createColumnHelper<FacultyUser>();

// ── Add Faculty Modal ─────────────────────────────────────────────────────────
function AddFacultyModal({
  onClose,
  onSuccess,
  callerRole,
  callerDept,
}: {
  onClose: () => void;
  onSuccess: (user: FacultyUser) => void;
  callerRole: string;
  callerDept: string | null;
}) {
  const [form, setForm] = useState<AddFacultyForm>({
    ...EMPTY_FORM,
    department: callerDept ?? '',
    role: 'TEACHER',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof AddFacultyForm, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: any = { name: form.name, email: form.email, password: form.password };
      if (callerRole !== 'HOD') {
        payload.role = form.role;
        payload.department = form.department || null;
      }
      const res = await api.post('/directory/faculty', payload);
      onSuccess(res.data.user);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to add faculty. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close on backdrop click
  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={onBackdrop}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: 480, padding: '1.75rem', position: 'relative', animation: 'fadeIn 0.15s ease' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className="stat-card-icon" style={{ width: 36, height: 36 }}>
              <UserPlus size={16} />
            </div>
            <div>
              <h2 id="modal-title" style={{ fontSize: '1rem' }}>Add New Faculty</h2>
              {callerRole === 'HOD' && (
                <p style={{ fontSize: '0.75rem', margin: 0 }}>Adding to: <strong>{callerDept}</strong></p>
              )}
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '0.375rem' }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="faculty-name" className="form-label">Full Name *</label>
              <input
                id="faculty-name"
                className="form-input"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Dr. John Doe"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="faculty-email" className="form-label">Email Address *</label>
              <input
                id="faculty-email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="jdoe@profcv.edu"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="faculty-password" className="form-label">
                Temporary Password *
                <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: '0.375rem' }}>
                  (share with the user)
                </span>
              </label>
              <input
                id="faculty-password"
                type="text"
                className="form-input"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Temporary password"
                required
              />
            </div>

            {/* HOD: role and dept are fixed; VC/Admin can choose */}
            {callerRole !== 'HOD' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label htmlFor="faculty-role" className="form-label">Role *</label>
                  <select id="faculty-role" className="form-select" value={form.role} onChange={(e) => set('role', e.target.value)}>
                    <option value="TEACHER">Teacher</option>
                    <option value="HOD">HOD</option>
                    <option value="VC">VC</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="faculty-dept" className="form-label">Department</label>
                  <input
                    id="faculty-dept"
                    className="form-input"
                    value={form.department}
                    onChange={(e) => set('department', e.target.value)}
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>
            ) : (
              <div className="alert alert-info" style={{ fontSize: '0.8125rem' }}>
                New faculty will be added as <strong>Teacher</strong> in{' '}
                <strong>{callerDept}</strong>.
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" id="submit-add-faculty" disabled={isSubmitting}>
                {isSubmitting
                  ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Adding…</>
                  : <><UserPlus size={14} /> Add Faculty</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DirectoryPage() {
  const { user } = useAuth();
  const [data, setData] = useState<FacultyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadDirectory = useCallback(() => {
    api.get('/directory')
      .then((r) => setData(r.data))
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { loadDirectory(); }, [loadDirectory]);

  const handleAddSuccess = (newUser: FacultyUser) => {
    setData((prev) => [newUser, ...prev]);
    setShowModal(false);
    setSuccessMsg(`${newUser.name} has been added successfully.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const columns = useMemo(() => [
    col.accessor('name', { header: 'Name', cell: (i) => <strong style={{ color: 'var(--color-text)' }}>{i.getValue()}</strong> }),
    col.accessor('email', { header: 'Email', cell: (i) => <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{i.getValue()}</span> }),
    col.accessor('department', { header: 'Department', cell: (i) => i.getValue() ?? <span style={{ color: 'var(--color-text-light)' }}>—</span> }),
    col.accessor('role', {
      header: 'Role',
      cell: (i) => <span className={ROLE_BADGE[i.getValue()] ?? 'badge'}>{i.getValue()}</span>,
    }),
    col.display({
      id: 'actions',
      header: '',
      cell: (i) => (
        <a   
          href={`/p/${i.row.original._id}`}
          className="btn btn-ghost"
          style={{ fontSize: '0.8125rem', padding: '0.25rem 0.5rem' }}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={13} /> View
        </a>
      ),
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const canAdd = user?.role === 'HOD' || user?.role === 'VC' || user?.role === 'SUPERADMIN';

  return (
    <div>
      {/* Page header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Faculty Directory</h1>
          <p>
            {user?.role === 'HOD'
              ? `Showing faculty in ${user.department}`
              : 'All faculty across all departments'}
          </p>
        </div>
        {canAdd && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
            id="add-faculty-btn"
          >
            <UserPlus size={15} /> Add Faculty
          </button>
        )}
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          <CheckCircle size={15} /> {successMsg}
        </div>
      )}

      {/* Table card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <div className="spinner" />
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>No faculty found.</td></tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} · {data.length} total
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} id="prev-page-btn" style={{ padding: '0.375rem 0.625rem' }}>
                  <ChevronLeft size={15} />
                </button>
                <button className="btn btn-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} id="next-page-btn" style={{ padding: '0.375rem 0.625rem' }}>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Faculty Modal */}
      {showModal && user && (
        <AddFacultyModal
          onClose={() => setShowModal(false)}
          onSuccess={handleAddSuccess}
          callerRole={user.role}
          callerDept={user.department}
        />
      )}
    </div>
  );
}
