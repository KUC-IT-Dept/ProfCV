import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

const Barchart = ({ data }) => {
  const [viewRange, setViewRange] = useState(5); // Default to 5 years

  // Filter data based on the dropdown selection
  // .slice(-viewRange) takes the last N elements from the array
  const filteredData = data.slice(-viewRange);

  return (
    <div className="card" style={{ padding: '1.5rem', background: '#fff', height: '100%', maxWidth: '740px', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Publication Growth</h3>
        
        {/* Styled Select Dropdown */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select 
            value={viewRange}
            onChange={(e) => setViewRange(Number(e.target.value))}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              padding: '6px 30px 6px 12px',
              fontSize: '13px',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 500
            }}
          >
            <option value={3}>Last 3 Years</option>
            <option value={5}>Last 5 Years</option>
            <option value={10}>Last 10 Years</option>
            <option value={data.length}>All Time</option>
          </select>
          {/* Positioning the Chevron icon over the select box */}
          <ChevronDown 
            size={14} 
            style={{ position: 'absolute', right: '10px', pointerEvents: 'none', color: '#64748b' }} 
          />
        </div>
      </div>
      
      <div style={{ width: '100%', height: 200, maxWidth: '740px' }}>
      


        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} allowDecimals={false} />
            <Tooltip cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="publications" fill="#3471d1" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
  

      </div>
    </div>
      
  );
};

export default Barchart;