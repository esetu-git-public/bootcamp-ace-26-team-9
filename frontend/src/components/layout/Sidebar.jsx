import {
  LayoutDashboard,
  BrainCircuit,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-slate-700">

        <h2 className="text-2xl font-bold text-blue-400">
          HR Dashboard
        </h2>

      </div>

      {/* Navigation */}

      <nav className="flex-1 mt-6">

        <ul className="space-y-2 px-4">

          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition">
              <LayoutDashboard size={20} />
              Dashboard
            </button>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition">
              <BrainCircuit size={20} />
              Prediction
            </button>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition">
              <Users size={20} />
              Employees
            </button>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition">
              <BarChart3 size={20} />
              Analytics
            </button>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition">
              <FileText size={20} />
              Reports
            </button>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition">
              <Settings size={20} />
              Settings
            </button>
          </li>

        </ul>

      </nav>

      {/* Logout */}

      <div className="p-4 border-t border-slate-700">

        <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-xl transition">

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;