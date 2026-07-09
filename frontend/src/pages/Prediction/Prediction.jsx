import MainLayout from "../../layouts/MainLayout";
import { useDataset } from "../../context/DatasetContext";
import EmptyState from "../../components/EmptyState";
import PredictionForm from "./PredictionForm";

const Prediction = () => {
  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;

  return (
    <MainLayout>
      {!isDatasetUploaded ? (
        <EmptyState />
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Employee Attrition Prediction
            </h1>
            <p className="text-gray-500 mt-2">
              Predict whether an employee is likely to leave the organization.
            </p>
          </div>

          <PredictionForm />
        </div>
      )}
    </MainLayout>
  );
};

export default Prediction;