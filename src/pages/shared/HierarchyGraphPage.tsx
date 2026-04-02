import { useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

// ── Role colors (left border) ────────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
  SUPERADMIN: '#049336ff',
  VC: '#d470f2ff',
  HOD: '#f26170ff',
  TEACHER: '#4636f8ff',
};

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  VC: 'Vice Chancellor',
  HOD: 'Head of Dept',
  TEACHER: 'Faculty',
};

// ── Custom Node Component ─────────────────────────────────────────────────────
function HierarchyNode({ data }: { data: any }) {
  const color = ROLE_COLORS[data.role] ?? '#94A3B8';
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderLeft: `4px solid ${color}`,
        borderRadius: 8,
        padding: '0.625rem 0.875rem',
        minWidth: 160,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.07)',
        position: 'relative'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>
        {data.name}
      </div>
      <div style={{ fontSize: '0.7rem', color: color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {ROLE_LABELS[data.role] ?? data.role}
      </div>
      {data.department && (
        <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 2 }}>{data.department}</div>
      )}
      {data.canPromote && data.role === 'TEACHER' && (
        <button
          onClick={(e) => { e.stopPropagation(); data.onMakeHod(data.id, data.name, data.department); }}
          style={{
            marginTop: '0.5rem',
            padding: '0.375rem 0.5rem',
            fontSize: '0.65rem',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            width: '100%',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.8')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
        >
          Make HOD
        </button>
      )}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const NODE_TYPES = { hierarchyNode: HierarchyNode };

// ── Dagre layout ─────────────────────────────────────────────────────────────
const NODE_WIDTH = 180;
const NODE_HEIGHT = 100; // Expanded to accommodate Make HOD button

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  // Constraint #1: use dagre to auto-calculate {x, y} — no hardcoded coordinates
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 80 });

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 } };
  });
}

// ── Tree → React Flow elements ────────────────────────────────────────────────
function buildFlowElements(
  treeData: any,
  canPromote: boolean,
  onMakeHod: (id: string, name: string, dept: string) => void
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const addNode = (u: any, id: string) => {
    nodes.push({
      id,
      type: 'hierarchyNode',
      position: { x: 0, y: 0 }, // will be overwritten by dagre
      data: { id, name: u.name, role: u.role, department: u.department, canPromote, onMakeHod },
    });
  };

  const addEdge = (source: string, target: string) => {
    edges.push({
      id: `${source}-${target}`,
      source,
      target,
      markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: '#CBD5E1' },
      style: { stroke: '#CBD5E1', strokeWidth: 1.5 },
    });
  };

  const root = treeData.root;
  if (!root || !root._id) {
    console.error('Root node is missing _id');
    return { nodes, edges };
  }

  const rootId = root._id.toString();
  addNode(root, rootId);

  (treeData.branches ?? []).forEach((branch: any) => {
    if (!branch._id) {
      console.error(`Branch node missing _id for ${branch.name}`);
      return;
    }
    const branchId = branch._id.toString();
    if (!nodes.find(n => n.id === branchId)) addNode(branch, branchId);
    addEdge(rootId, branchId);

    (branch.leaves ?? []).forEach((leaf: any) => {
      if (!leaf._id) {
        console.error(`Leaf node missing _id for ${leaf.name}`);
        return;
      }
      const leafId = leaf._id.toString();
      if (!nodes.find(n => n.id === leafId)) addNode(leaf, leafId);
      addEdge(branchId, leafId);
    });
  });

  const laid = applyDagreLayout(nodes, edges);
  return { nodes: laid, edges };
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function HierarchyGraphPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const canPromote = user?.role === 'VC' || user?.role === 'SUPERADMIN';
  const [confirmSwap, setConfirmSwap] = useState<{ isOpen: boolean; id: string; name: string; dept: string } | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  const loadTree = useCallback(() => {
    setIsLoading(true);
    setError('');
    api.get('/directory/tree')
      .then((r) => {
        const { nodes: n, edges: e } = buildFlowElements(
          r.data,
          canPromote,
          (id, name, dept) => setConfirmSwap({ isOpen: true, id, name, dept })
        );
        setNodes(n);
        setEdges(e);
      })
      .catch(() => setError('Failed to load org hierarchy. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [canPromote, setNodes, setEdges]); // dependencies include canPromote

  useEffect(() => { loadTree(); }, [loadTree]);

  const handleConfirmSwap = async () => {
    if (!confirmSwap) return;
    setIsSwapping(true);
    try {
      await api.put('/directory/swap-hod', { teacherId: confirmSwap.id });
      setConfirmSwap(null);
      loadTree(); // reload graph
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role.');
    } finally {
      setIsSwapping(false);
    }
  };

  const scopeLabel: Record<string, string> = {
    HOD: `Your team — ${user?.department}`,
    VC: 'All departments',
    SUPERADMIN: 'Full university hierarchy',
  };

  return (
    <div>
      <div className="page-header">
        <h1>Org Hierarchy</h1>
        <p>{user?.role ? scopeLabel[user.role] : ''}</p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: ROLE_COLORS[role] }} />
            {label}
          </div>
        ))}
      </div>

      <div className="card" style={{ height: 600, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
            <p>Building org chart…</p>
          </div>
        ) : error ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ color: 'var(--color-danger)' }}>{error}</p>
            <button className="btn btn-secondary" onClick={loadTree}>Retry</button>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => navigate(`/p/${node.id}`)}
            nodeTypes={NODE_TYPES}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={2}
            style={{ background: '#F8FAFC' }}
          >
            <Background color="#E5E7EB" gap={20} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(n) => ROLE_COLORS[(n.data as any)?.role] ?? '#94A3B8'}
              maskColor="rgba(248,250,252,0.7)"
              style={{ border: '1px solid #E5E7EB' }}
            />
          </ReactFlow>
        )}
      </div>

      {/* Confirmation Modal for Swap */}
      {confirmSwap && confirmSwap.isOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget && !isSwapping) setConfirmSwap(null); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
        >
          <div className="card" style={{ width: '100%', maxWidth: 450, padding: '1.75rem' }} role="dialog">
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--color-danger)' }}>Confirm Role Update</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Are you sure you want to promote <strong>{confirmSwap.name}</strong> to Head of Department for <strong>{confirmSwap.dept}</strong>?
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              The current Head of Department (if any) will automatically be demoted to a standard Faculty member. This action will be visible across the system immediately.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setConfirmSwap(null)} disabled={isSwapping}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmSwap}
                disabled={isSwapping}
                style={{ background: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
              >
                {isSwapping ? 'Updating...' : 'Yes, Update Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
