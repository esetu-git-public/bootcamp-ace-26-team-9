import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, User, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkHealth } from '../services/api';

export default function Navbar() {
  const { user } = useAuth();
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const verifyHealth = async () => {
      try {
        const res = await checkHealth();
        if (res.status === 'healthy' && res.model_loaded) {
          setApiStatus('online');
        } else {
          setApiStatus('degraded');
        }
      } catch (e) {
        setApiStatus('offline');
      }
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-hr-50 px-3 py-1.5 rounded-full border border-hr-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${apiStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${apiStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </span>
          <span className="text-xs font-semibold text-hr-900 tracking-wide uppercase">
            AI Engine: {apiStatus === 'online' ? 'Online & Ready' : 'Offline / Degraded'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative text-slate-500 hover:text-hr-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-hr-100 text-hr-700 flex items-center justify-center font-bold text-sm border border-hr-300">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name || 'HR Admin'}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.role || 'Analytics Lead'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
