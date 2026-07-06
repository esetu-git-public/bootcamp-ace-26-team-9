import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, BarChart3, LogOut, ShieldAlert, Users, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Predict Attrition', path: '/predict', icon: UserPlus },
    { name: 'Analytics Suite', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-800 shadow-xl select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-hr-600 to-hr-400 rounded-xl text-white shadow-lg shadow-hr-600/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight">HR Attrition AI</h1>
              <p className="text-[10px] text-hr-400 font-semibold uppercase tracking-wider">Predictive Shield</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 mt-2">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-hr-600 text-white shadow-md shadow-hr-600/30 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/20 space-y-3">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>AI Risk Guard Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Trained on 1,470 employee records with XGBoost & Random Forest.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-rose-600/10 hover:text-rose-400 hover:border-rose-500/30 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
