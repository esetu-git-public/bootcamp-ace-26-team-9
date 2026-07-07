import { Bell, Search, UserCircle } from "lucide-react";

function Navbar() {
  return (
    <nav className="h-16 bg-white shadow-md flex items-center justify-between px-8">

      {/* Left */}
      <div>

        <h1 className="text-2xl font-bold text-slate-800">
          Employee Attrition Prediction
        </h1>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

        </div>

        <Bell
          size={22}
          className="cursor-pointer text-gray-600 hover:text-blue-600"
        />

        <UserCircle
          size={34}
          className="cursor-pointer text-blue-600"
        />

      </div>

    </nav>
  );
}

export default Navbar;