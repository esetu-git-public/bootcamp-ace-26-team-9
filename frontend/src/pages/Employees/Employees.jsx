import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useDataset } from "../../context/DatasetContext";
import EmptyState from "../../components/EmptyState";
import EmployeeTable from "../../components/Employee/EmployeeTable";

const Employees = () => {
  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;
  const [showModal, setShowModal] = useState(false);

  return (
    <MainLayout>
      {!isDatasetUploaded ? (
        <EmptyState />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
              <p className="text-gray-500 mt-2">Manage all employees in one place.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              + Add Employee
            </button>
          </div>

          <EmployeeTable />

          {/* Add Employee Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">Add Employee</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Employee Name"
                    className="w-full border rounded-lg p-3"
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    className="w-full border rounded-lg p-3"
                  />
                  <input
                    type="text"
                    placeholder="Job Role"
                    className="w-full border rounded-lg p-3"
                  />
                  <input
                    type="number"
                    placeholder="Monthly Salary"
                    className="w-full border rounded-lg p-3"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert("Employee Added Successfully (Dummy)");
                      setShowModal(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default Employees;