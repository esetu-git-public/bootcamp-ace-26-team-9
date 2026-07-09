import MainLayout from "../../layouts/MainLayout";
import { useDataset } from "../../context/DatasetContext";
import EmptyState from "../../components/EmptyState";
import ReportCards from "../../components/Report/ReportCards";
import DepartmentChart from "../../components/Report/DepartmentChart";
import RecentReports from "../../components/Report/RecentReports";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

const Reports = () => {
  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;

  return (
    <MainLayout>
      {!isDatasetUploaded ? (
        <EmptyState />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Reports & Analytics
              </h1>
              <p className="text-gray-500 mt-2">
                View employee reports and export analytics.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => alert("PDF Export Coming Soon")}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
              >
                <FaFilePdf />
                Export PDF
              </button>

              <button
                onClick={() => alert("Excel Export Coming Soon")}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
              >
                <FaFileExcel />
                Export Excel
              </button>
            </div>
          </div>

          <ReportCards />

          <div className="mt-8">
            <DepartmentChart />
          </div>

          <RecentReports />
        </div>
      )}
    </MainLayout>
  );
};

export default Reports;