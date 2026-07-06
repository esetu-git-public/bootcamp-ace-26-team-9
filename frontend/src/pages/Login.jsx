import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      email: 'admin@company.com',
      password: 'password123'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(data.email, data.password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid login credentials. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  const handleDemoFill = () => {
    setValue('email', 'admin@company.com');
    setValue('password', 'password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-hr-950 to-slate-900 flex items-center justify-center p-4 selection:bg-hr-500 selection:text-white">
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hr-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10 border border-slate-100">
        
        {/* Left Column - Branding Banner */}
        <div className="md:col-span-5 bg-gradient-to-tr from-hr-700 via-hr-600 to-hr-500 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>IBM HR Analytics Powered</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">
              Attrition AI Prediction Shield
            </h2>
            <p className="text-hr-100 text-sm leading-relaxed">
              Empowering global HR departments with predictive turnover insights and proactive retention strategies.
            </p>
          </div>

          <div className="space-y-4 pt-8 relative z-10">
            <div className="flex items-start space-x-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
              <p className="text-hr-50 text-xs leading-relaxed font-medium">
                Trained on 1,470 real employee profiles with XGBoost & Random Forest algorithms.
              </p>
            </div>
            <div className="flex items-start space-x-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
              <p className="text-hr-50 text-xs leading-relaxed font-medium">
                Real-time risk scoring and customized retention intervention advice.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 relative z-10 flex items-center justify-between text-xs text-hr-200">
            <span>v1.0 Production</span>
            <span className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Enterprise HR Suite</span>
            </span>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back, Admin</h3>
            <p className="text-sm text-slate-500 mt-1">Please sign in to access the predictive HR portal.</p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 p-3.5 bg-hr-50 border border-hr-200 rounded-xl flex items-center justify-between">
            <div className="text-xs text-hr-800">
              <span className="font-bold">Demo Login:</span> admin@company.com / password123
            </div>
            <button 
              type="button" 
              onClick={handleDemoFill}
              className="text-xs bg-white text-hr-600 font-semibold px-2.5 py-1 rounded-lg border border-hr-200 hover:bg-hr-600 hover:text-white transition-colors shadow-sm"
            >
              Auto-Fill
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-field">Corporate Email</label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="admin@company.com"
                  className="input-field pl-11"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              </div>
              {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••••••"
                  className="input-field pl-11"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              </div>
              {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-600">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-hr-600 focus:ring-hr-500 w-4 h-4" />
                <span>Remember this device</span>
              </label>
              <a href="#reset" onClick={(e) => { e.preventDefault(); alert("For demo purposes, use Admin Auto-Fill."); }} className="text-hr-600 font-semibold hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base shadow-lg shadow-hr-600/20 mt-4 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Access HR Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Protected by enterprise-grade 256-bit encryption and AI anomaly detection.
          </p>
        </div>
      </div>
    </div>
  );
}
