import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, trendType = 'neutral', color = 'hr' }) {
  const colorMap = {
    hr: 'bg-hr-50 text-hr-600 border-hr-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  const trendColorMap = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-rose-600 bg-rose-50',
    neutral: 'text-slate-500 bg-slate-100',
  };

  const TrendIcon = trendType === 'up' ? TrendingUp : trendType === 'down' ? TrendingDown : Minus;

  return (
    <div className="card-modern relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight group-hover:text-hr-600 transition-colors">
            {value}
          </h3>
        </div>
        
        {Icon && (
          <div className={`p-3.5 rounded-2xl border transition-transform duration-300 group-hover:scale-110 ${colorMap[color] || colorMap.hr}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-semibold ${trendColorMap[trendType]}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trend}</span>
          </span>
          <span className="text-xs text-slate-400 font-medium">vs last quarter</span>
        </div>
      )}
    </div>
  );
}
