import MainLayout from "../../layouts/MainLayout";
import PredictionForm from "./PredictionForm";

const Prediction = () => {
  return (
    <MainLayout>
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
    </MainLayout>
  );
};

export default Prediction;