import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { getAuthUser, signOut } from "../../services/authService";
import { useDataset } from "../../context/DatasetContext";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const displayName = user?.name || "Admin";
  const displayRole = user?.role || "HR Manager";

  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;

  const [showNotifications, setShowNotifications] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await signOut();
      } catch (error) {
        console.error("Sign out error:", error);
      } finally {
        navigate("/");
      }
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
      <div className={`hidden lg:flex items-center bg-gray-100 rounded-xl px-4 py-3 w-96 ${!isDatasetUploaded ? "opacity-50" : ""}`}>
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder={isDatasetUploaded ? "Search employees..." : "Upload dataset to search..."}
          disabled={!isDatasetUploaded}
          className={`bg-transparent outline-none w-full ${!isDatasetUploaded ? "cursor-not-allowed text-gray-400" : ""}`}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => isDatasetUploaded && setShowNotifications(!showNotifications)}
            className={`relative text-xl text-gray-600 hover:text-blue-600 ${!isDatasetUploaded ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!isDatasetUploaded}
          >
            <FaBell />
            {isDatasetUploaded && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            )}
          </button>

          {showNotifications && isDatasetUploaded && (
            <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-2xl border z-50">
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg">Notifications</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="border-b pb-3">
                  <p className="font-semibold text-blue-600">Dataset Loaded</p>
                  <p className="text-sm text-gray-500">
                    A total of {datasetPredictions.length} records are now active.
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
              {displayName}
            </h2>
            <p className="text-sm text-gray-500">
              {displayRole}
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