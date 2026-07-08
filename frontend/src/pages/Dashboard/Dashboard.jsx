import MainLayout from "../../layouts/MainLayout";

import DashboardCards from "../../components/Dashboard/DashboardCards";
import AttritionChart from "../../components/Dashboard/AttritionChart";
import DepartmentChart from "../../components/Dashboard/DepartmentChart";
import RecentPredictions from "../../components/Dashboard/RecentPredictions";

const Dashboard = () => {
  return (
    <MainLayout>
      <div>

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome to the Employee Attrition Prediction System
          </p>

        </div>

        {/* KPI Cards */}

        <DashboardCards />

        {/* Charts */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

          <AttritionChart />

          <DepartmentChart />

        </div>

        {/* Recent Predictions */}

        <RecentPredictions />

      </div>
    </MainLayout>
  );
};

export default Dashboard;