import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Smile, DollarSign, Percent, ArrowUpRight, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { getDashboard, getAnalytics } from '../services/api';

const COLORS = ['#0074ca', '#36aef7', '#f43f5e', '#10b981'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiRes, chartRes] = await Promise.all([
        getDashboard(),
        getAnalytics()
      ]);
      setKpis(kpiRes);
      setCharts(chartRes);
    } catch (err) {
      setError(err.message || "Could not load dashboard data from backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-64 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Connection Error</h3>
          <p className="text-sm text-rose-600">{error}</p>
          <button onClick={fetchData} className="btn-primary space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">HR Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time workforce attrition metrics and predictive turnover risk signals.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={fetchData} className="btn-secondary text-sm py-2">
            <RefreshCw className="w-4 h-4 mr-2 text-slate-500" />
            <span>Refresh KPIs</span>
          </button>
          <button onClick={() => navigate('/predict')} className="btn-primary text-sm py-2 space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Predict Employee Risk</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (5 Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
        <StatCard
          title="Total Employees"
          value={kpis?.total_employees?.toLocaleString() || "1,470"}
          icon={Users}
          color="hr"
          trend="3.2%"
          trendType="up"
        />
        <StatCard
          title="High Risk Employees"
          value={kpis?.high_risk_employees || "237"}
          icon={AlertTriangle}
          color="rose"
          trend="1.8%"
          trendType="down"
        />
        <StatCard
          title="Attrition Rate"
          value={`${kpis?.attrition_rate || "16.12"}%`}
          icon={Percent}
          color="amber"
          trend="0.5%"
          trendType="down"
        />
        <StatCard
          title="Avg Satisfaction"
          value={`${kpis?.average_satisfaction || "2.73"} / 4`}
          icon={Smile}
          color="emerald"
          trend="4.1%"
          trendType="up"
        />
        <StatCard
          title="Avg Monthly Income"
          value={`$${kpis?.average_monthly_income?.toLocaleString() || "6,503"}`}
          icon={DollarSign}
          color="indigo"
          trend="2.4%"
          trendType="up"
        />
      </div>

      {/* Quick Visual Overview (2 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ChartCard 
            title="Department-Wise Attrition Rate (%)" 
            subtitle="Comparison of employee turnover rate across major operational departments"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.department_attrition || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                  formatter={(val, name) => [name === 'Rate' ? `${val}%` : val, name === 'Rate' ? 'Attrition Rate' : name]}
                />
                <Bar dataKey="Rate" fill="#0074ca" radius={[8, 8, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="lg:col-span-5">
          <ChartCard 
            title="Workforce Gender Distribution" 
            subtitle="Overall attrition distribution across employee genders"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.gender_attrition || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts?.gender_attrition || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Recent High Risk Activity Feed */}
      <div className="card-modern">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 tracking-tight flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Recent High-Risk Employee Alerts</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Employees identified by AI model requiring proactive HR engagement</p>
          </div>
          <button onClick={() => navigate('/analytics')} className="text-xs font-semibold text-hr-600 hover:text-hr-700 flex items-center space-x-1">
            <span>View All Analytics</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Job Role</th>
                <th className="py-3 px-4">Monthly Income</th>
                <th className="py-3 px-4">Overtime</th>
                <th className="py-3 px-4">Satisfaction</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {(kpis?.recent_activity || []).map((emp, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{emp.id}</td>
                  <td className="py-3.5 px-4">{emp.department}</td>
                  <td className="py-3.5 px-4 text-slate-600">{emp.role}</td>
                  <td className="py-3.5 px-4">{emp.income}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${emp.overtime === 'Yes' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                      {emp.overtime}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{emp.satisfaction}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      <span>{emp.risk}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => navigate('/predict')} 
                      className="text-xs bg-hr-50 text-hr-600 hover:bg-hr-600 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all border border-hr-200"
                    >
                      Run Intervention
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
