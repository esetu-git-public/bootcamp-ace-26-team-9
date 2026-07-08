import {
  LayoutDashboard,
  BrainCircuit,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      navigate("/");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "Prediction",
      icon: <BrainCircuit size={20} />,
      path: "/prediction",
    },
    {
      name: "Employees",
      icon: <Users size={20} />,
      path: "/employees",
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={20} />,
      path: "/analytics",
    },
    {
      name: "Reports",
      icon: <FileText size={20} />,
      path: "/reports",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">

      {/* Brand */}

      <div className="p-6 border-b border-slate-800 flex items-center gap-3">

        <BrainCircuit className="text-blue-500" size={28} />

        <div>

          <h2 className="font-bold text-lg leading-none">
            EAP System
          </h2>

          <span className="text-xs text-slate-400">
            Admin Portal
          </span>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4 overflow-y-auto">

        <ul className="space-y-2">

          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}

        </ul>

      </nav>

      {/* Logout */}

      <div className="p-4 border-t border-slate-700">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-xl transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;