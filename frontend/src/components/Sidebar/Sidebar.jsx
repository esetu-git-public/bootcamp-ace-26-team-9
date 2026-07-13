import {
  FaHome,
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaUpload,
  FaChartBar,
  FaBalanceScale,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../../api/authApi";
import { useDataset } from "../../context/DatasetContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      navigate("/");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      name: "Prediction",
      icon: <FaChartLine />,
      path: "/prediction",
    },
    {
      name: "Upload Dataset",
      icon: <FaUpload />,
      path: "/upload-dataset",
    },
    {
      name: "Analytics",
      icon: <FaChartBar />,
      path: "/analytics",
    },
    {
      name: "Compare Employees",
      icon: <FaBalanceScale />,
      path: "/compare",
    },
    {
      name: "Employees",
      icon: <FaUsers />,
      path: "/employees",
    },
    {
      name: "Reports",
      icon: <FaFileAlt />,
      path: "/reports",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];


  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      <div className="text-center py-8 border-b border-slate-700">

        <h1 className="text-2xl font-bold">
          HR Analytics
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Employee Attrition
        </p>

      </div>

      <div className="flex-1 px-4 py-6">

        {menuItems.map((item) => {
          const isItemDisabled = !isDatasetUploaded && item.path !== "/upload-dataset" && item.path !== "/settings";
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={(e) => {
                if (isItemDisabled) {
                  e.preventDefault();
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl mb-3 transition ${
                  isItemDisabled
                    ? "opacity-30 cursor-not-allowed pointer-events-none text-slate-500"
                    : isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          );
        })}

      </div>

      <div className="p-4 border-t border-slate-700">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-600 transition"
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </div>
  );
};

export default Sidebar;