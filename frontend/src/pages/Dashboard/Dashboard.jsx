import DashboardLayout from "../../components/layout/DashboardLayout";

function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-800">
        Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome to Employee Attrition Prediction System
      </p>

      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-semibold">
          Dashboard Overview
        </h2>

        <p className="text-gray-500 mt-4">
          Dashboard widgets will be added here...
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;