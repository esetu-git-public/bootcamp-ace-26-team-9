import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, ArrowLeft, RefreshCw, Sparkles, AlertTriangle, CheckCircle2, Award, Lightbulb, UserCheck } from 'lucide-react';

export default function PredictionResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, inputData } = location.state || {};

  if (!result) {
    return <Navigate to="/predict" replace />;
  }

  const isLeave = result.prediction === 'Leave';
  const riskLevel = result.risk_level || (result.probability >= 65 ? 'High' : result.probability >= 35 ? 'Medium' : 'Low');
  
  const riskStyles = {
    High: {
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bar: 'bg-gradient-to-r from-rose-500 to-rose-600',
      bgCard: 'from-rose-900 via-rose-950 to-slate-900',
    },
    Medium: {
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: ShieldAlert,
      color: 'text-amber-600',
      bar: 'bg-gradient-to-r from-amber-400 to-amber-600',
      bgCard: 'from-amber-900 via-slate-900 to-slate-900',
    },
    Low: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
      bgCard: 'from-emerald-900 via-slate-900 to-slate-900',
    }
  };

  const currentStyle = riskStyles[riskLevel] || riskStyles.Medium;
  const RiskIcon = currentStyle.icon;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/predict')}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-hr-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Prediction Form</span>
        </button>
        
        <div className="text-xs text-slate-400 font-medium">
          Inference performed by: <span className="font-bold text-slate-700">{result.model_used || 'Random Forest AI'}</span>
        </div>
      </div>

      {/* Hero Banner Result Card */}
      <div className={`p-8 lg:p-10 rounded-3xl bg-gradient-to-br ${currentStyle.bgCard} text-white shadow-2xl relative overflow-hidden border border-white/10`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-xl">
            <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-extrabold uppercase tracking-wider ${currentStyle.badge}`}>
              <RiskIcon className="w-4 h-4" />
              <span>Risk Level: {riskLevel}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none">
              Prediction: {result.prediction}
            </h1>

            <p className="text-slate-200 text-sm leading-relaxed">
              Based on the employee profile (Department: <strong className="text-white">{inputData?.Department || 'Sales'}</strong>, Role: <strong className="text-white">{inputData?.JobRole || 'Executive'}</strong>), the AI engine has calculated the turnover likelihood and generated targeted intervention strategies.
            </p>
          </div>

          {/* Probability Gauge Box */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center min-w-[220px] flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1">Turnover Probability</span>
            <span className="text-5xl font-black tracking-tighter text-white">
              {result.probability}%
            </span>
            <span className="text-[11px] text-slate-300 mt-2 font-medium bg-black/20 px-3 py-1 rounded-full">
              Confidence Score: {result.confidence_score || '0.88'} / 1.0
            </span>
          </div>
        </div>

        {/* Probability Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/15 relative z-10 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>0% (Stable / Retained)</span>
            <span>50% (Threshold)</span>
            <span>100% (High Turnover Risk)</span>
          </div>
          <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${currentStyle.bar}`}
              style={{ width: `${result.probability}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Actionable Retention Suggestion Card */}
      <div className="card-modern border-l-4 border-l-hr-600 bg-gradient-to-r from-hr-50/50 to-white">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-hr-100 text-hr-700 rounded-2xl mt-0.5 flex-shrink-0">
            <Lightbulb className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>AI Retention Strategy & Recommendation</span>
              <span className="text-xs bg-hr-600 text-white font-semibold px-2 py-0.5 rounded-md">Actionable Advice</span>
            </h3>
            <p className="text-slate-700 text-sm lg:text-base leading-relaxed font-medium">
              {result.retention_suggestion || "Monitor employee engagement and continue regular career development touchpoints."}
            </p>
          </div>
        </div>
      </div>

      {/* Input Summary Grid */}
      <div className="card-modern">
        <h4 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-hr-600" />
          <span>Analyzed Employee Profile Summary</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-0.5">Age</span>
            <span className="text-slate-800 font-bold text-sm">{inputData?.Age} Years</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-0.5">Gender</span>
            <span className="text-slate-800 font-bold text-sm">{inputData?.Gender}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-0.5">Department</span>
            <span className="text-slate-800 font-bold text-sm">{inputData?.Department}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-0.5">Job Role</span>
            <span className="text-slate-800 font-bold text-sm">{inputData?.JobRole}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-0.5">Monthly Income</span>
            <span className="text-slate-800 font-bold text-sm">${inputData?.MonthlyIncome?.toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-0.5">Tenure</span>
            <span className="text-slate-800 font-bold text-sm">{inputData?.YearsAtCompany} Years</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-0.5">Overtime Required</span>
            <span className={`font-bold text-sm ${inputData?.OverTime === 'Yes' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {inputData?.OverTime}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-0.5">Job Satisfaction</span>
            <span className="text-slate-800 font-bold text-sm">{inputData?.JobSatisfaction} / 4</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center space-x-4 pt-4">
        <button
          onClick={() => navigate('/predict')}
          className="btn-primary py-3 px-8 text-base shadow-lg shadow-hr-600/30 flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Assess Another Employee</span>
        </button>
        <button
          onClick={() => navigate('/analytics')}
          className="btn-secondary py-3 px-6 text-base"
        >
          <span>View Analytics Dashboard</span>
        </button>
      </div>
    </div>
  );
}
