import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { getAuthUser } from "../../services/authService";
import { useDataset } from "../../context/DatasetContext";

const Navbar = () => {
  const user = getAuthUser();
  const displayName = user?.name || "Admin";
  const displayRole = user?.role || "HR Manager";
  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;

  return (
    <div className="h-20 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-8">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button className="text-2xl text-gray-600 hover:text-blue-600">
          <FaBars />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome to Employee Attrition Prediction System
          </p>
        </div>
      </div>

      {/* Center Search */}
      <div className={`hidden lg:flex items-center bg-gray-100 rounded-xl px-4 py-3 w-96 ${!isDatasetUploaded ? "opacity-50" : ""}`}>
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder={isDatasetUploaded ? "Search employees..." : "Upload dataset to search..."}
          disabled={!isDatasetUploaded}
          className={`bg-transparent outline-none w-full ${!isDatasetUploaded ? "cursor-not-allowed text-gray-400" : ""}`}
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <button className="relative text-xl text-gray-600 hover:text-blue-600">
          <FaBell />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-3">
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
      </div>
    </div>
  );
};

export default Navbar;