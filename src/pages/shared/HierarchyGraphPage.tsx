import React, { useEffect, useState, useCallback } from 'react';
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
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

// ── Role colors (left border) ────────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
  SUPERADMIN: '#7C3AED',
  VC: '#4F46E5',
  HOD: '#1D4ED8',
  TEACHER: '#059669',
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
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const NODE_TYPES = { hierarchyNode: HierarchyNode };

// ── Dagre layout ─────────────────────────────────────────────────────────────
const NODE_WIDTH = 180;
const NODE_HEIGHT = 72;

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
function buildFlowElements(treeData: any): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const addNode = (u: any, id: string) => {
    nodes.push({
      id,
      type: 'hierarchyNode',
      position: { x: 0, y: 0 }, // will be overwritten by dagre
      data: { name: u.name, role: u.role, department: u.department },
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
  const rootId = root._id?.toString() ?? 'root';
  addNode(root, rootId);

  (treeData.branches ?? []).forEach((branch: any) => {
    const branchId = branch._id?.toString() ?? `branch-${branch.name}`;
    if (!nodes.find(n => n.id === branchId)) addNode(branch, branchId);
    addEdge(rootId, branchId);

    (branch.leaves ?? []).forEach((leaf: any) => {
      const leafId = leaf._id?.toString() ?? `leaf-${leaf.name}`;
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTree = useCallback(() => {
    setIsLoading(true);
    setError('');
    api.get('/directory/tree')
      .then((r) => {
        const { nodes: n, edges: e } = buildFlowElements(r.data);
        setNodes(n);
        setEdges(e);
      })
      .catch(() => setError('Failed to load org hierarchy. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { loadTree(); }, [loadTree]);

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
    </div>
  );
}
