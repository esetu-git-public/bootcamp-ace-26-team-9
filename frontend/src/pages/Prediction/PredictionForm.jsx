import { useState } from "react";
import PredictionResult from "./PredictionResult";

const PredictionForm = () => {
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    age: "",
    gender: "",
    department: "",
    jobRole: "",
    monthlyIncome: "",
    yearsAtCompany: "",
    overtime: "",
    performanceRating: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = (e) => {
    e.preventDefault();

    // Dummy Prediction

    const probability = Math.floor(Math.random() * 100);

    setResult({
      probability,
      prediction:
        probability >= 50 ? "Likely to Leave" : "Likely to Stay",
    });
  };

  return (
    <>
      <form
        onSubmit={handlePredict}
        className="bg-white rounded-2xl shadow-lg p-8"
      >

        <h2 className="text-2xl font-bold mb-6">
          Employee Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            name="employeeId"
            placeholder="Employee ID"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            name="employeeName"
            placeholder="Employee Name"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <select
            name="gender"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            name="department"
            placeholder="Department"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            name="jobRole"
            placeholder="Job Role"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            type="number"
            name="monthlyIncome"
            placeholder="Monthly Income"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            type="number"
            name="yearsAtCompany"
            placeholder="Years at Company"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <select
            name="overtime"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          >
            <option value="">Overtime</option>
            <option>Yes</option>
            <option>No</option>
          </select>

          <select
            name="performanceRating"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          >
            <option value="">Performance Rating</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>

        </div>

        <button
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Predict Attrition
        </button>

      </form>

      {result && (
        <PredictionResult result={result} />
      )}
    </>
  );
};

export default PredictionForm;