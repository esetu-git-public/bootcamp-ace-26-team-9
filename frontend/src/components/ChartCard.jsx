import React from 'react';

export default function ChartCard({ title, subtitle, children, action, height = 'h-80' }) {
  return (
    <div className="card-modern flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs font-medium text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      
      <div className={`w-full ${height} flex-grow min-h-[260px] relative`}>
        {children}
      </div>
    </div>
  );
}
