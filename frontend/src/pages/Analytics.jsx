import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, RefreshCw, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import { getAnalytics } from '../services/api';

const PIE_COLORS_GENDER = ['#0074ca', '#36aef7'];
const PIE_COLORS_SAT = ['#f43f5e', '#f97316', '#3b82f6', '#10b981'];

export default function Analytics() {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCharts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics();
      setCharts(data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics distributions from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-72 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Analytics Load Error</h3>
          <p className="text-sm text-rose-600">{error}</p>
          <button onClick={fetchCharts} className="btn-primary space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-hr-50 px-3 py-1 rounded-full text-xs font-semibold text-hr-700 mb-2 border border-hr-200">
            <Sparkles className="w-3.5 h-3.5 text-hr-600" />
            <span>Multi-Dimensional HR Intelligence</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">Workforce Attrition Analytics Suite</h1>
          <p className="text-sm text-slate-500 mt-1">Deep-dive visual distributions of employee turnover across department, income, age, and satisfaction.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={fetchCharts} className="btn-secondary text-sm py-2">
            <RefreshCw className="w-4 h-4 mr-2 text-slate-500" />
            <span>Refresh Charts</span>
          </button>
        </div>
      </div>

      {/* 6 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Department-Wise Attrition (Bar) */}
        <ChartCard 
          title="1. Department Attrition Rate (%)" 
          subtitle="Turnover percentage by operational unit"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.department_attrition || []} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip formatter={(val) => [`${val}%`, 'Attrition Rate']} />
              <Bar dataKey="Rate" fill="#0074ca" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Gender-Wise Attrition (Pie) */}
        <ChartCard 
          title="2. Gender Attrition Breakdown" 
          subtitle="Proportion of total departing employees"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts?.gender_attrition || []}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {(charts?.gender_attrition || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS_GENDER[index % PIE_COLORS_GENDER.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={24} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: Age Distribution (Line/Area Chart) */}
        <ChartCard 
          title="3. Age Distribution vs Attrition Rate" 
          subtitle="Turnover trajectory across age brackets"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts?.age_distribution || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#36aef7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#36aef7" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="age_group" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip formatter={(val) => [`${val}%`, 'Attrition Rate']} />
              <Area type="monotone" dataKey="Rate" stroke="#0074ca" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Monthly Income Distribution (Bar) */}
        <ChartCard 
          title="4. Income Brackets vs Attrition" 
          subtitle="Impact of monthly salary on retention"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.monthly_income_distribution || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bracket" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip formatter={(val) => [`${val}%`, 'Attrition Rate']} />
              <Bar dataKey="Rate" fill="#36aef7" radius={[6, 6, 0, 0]} barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 5: Job Satisfaction (Pie) */}
        <ChartCard 
          title="5. Job Satisfaction Breakdown" 
          subtitle="Satisfaction levels among entire workforce"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts?.job_satisfaction || []}
                cx="50%"
                cy="45%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {(charts?.job_satisfaction || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS_SAT[index % PIE_COLORS_SAT.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={24} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 6: Overtime Analysis (Bar) */}
        <ChartCard 
          title="6. Overtime Impact on Turnover (%)" 
          subtitle="Attrition rate for employees with vs without overtime"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.overtime_analysis || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="overtime" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip formatter={(val) => [`${val}%`, 'Attrition Rate']} />
              <Bar dataKey="Rate" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}
