import MainLayout from "../../layouts/MainLayout";
import { useDataset } from "../../context/DatasetContext";
import EmptyState from "../../components/EmptyState";

const Reports = () => {
  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-500 mt-2">View attrition and HR analytics reports</p>
      </div>

      {!isDatasetUploaded ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-600">Reports view is enabled since a dataset is loaded.</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Reports;
