import { useState } from "react";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/");
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="h-20 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-8">

      {/* Left */}

      <div className="flex items-center gap-4">

        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-600 hover:text-blue-600"
        >
          <FaBars />
        </button>

        <div>

          <h1 className="text-2xl font-bold text-gray-800">
            Employee Attrition Prediction System
          </h1>

          <p className="text-sm text-gray-500">
            {today}
          </p>

        </div>

      </div>

      {/* Search */}

      <div className="hidden lg:flex items-center bg-gray-100 rounded-xl px-4 py-3 w-96">

        <FaSearch className="text-gray-400 mr-3" />

        <input
          type="text"
          placeholder="Search employees..."
          className="bg-transparent outline-none w-full"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Notifications */}

        <div className="relative">

          <button
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            className="relative text-xl text-gray-600 hover:text-blue-600"
          >

            <FaBell />

            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>

          </button>

          {showNotifications && (

            <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-2xl border z-50">

              <div className="p-4 border-b">

                <h2 className="font-bold text-lg">
                  Notifications
                </h2>

              </div>

              <div className="p-4 space-y-4">

                <div className="border-b pb-3">

                  <p className="font-semibold">
                    High Risk Alert
                  </p>

                  <p className="text-sm text-gray-500">
                    John Smith has a 91% attrition probability.
                  </p>

                </div>

                <div className="border-b pb-3">

                  <p className="font-semibold">
                    New Employee Added
                  </p>

                  <p className="text-sm text-gray-500">
                    Sarah Johnson joined the HR Department.
                  </p>

                </div>

                <div>

                  <p className="font-semibold">
                    Monthly Report
                  </p>

                  <p className="text-sm text-gray-500">
                    July HR Analytics Report is ready.
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

        {/* Profile */}

        <div
          onClick={goToProfile}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-xl transition"
        >

          <FaUserCircle className="text-4xl text-blue-600" />

          <div>

            <h2 className="font-semibold text-gray-800">
              Admin
            </h2>

            <p className="text-sm text-gray-500">
              HR Manager
            </p>

          </div>

        </div>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </div>
  );
};

export default Navbar;