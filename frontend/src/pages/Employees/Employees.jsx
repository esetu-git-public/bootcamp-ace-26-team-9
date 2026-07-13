import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useDataset } from "../../context/DatasetContext";
import EmptyState from "../../components/EmptyState";
import EmployeeTable from "../../components/Employee/EmployeeTable";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import { FaUserPlus, FaSpinner, FaTimes } from "react-icons/fa";

const DEFAULT_NEW_EMPLOYEE = {
  employeeId: "",
  employeeName: "",
  Age: 30,
  Gender: "Male",
  Marital_Status: "Single",
  Department: "Research & Development",
  Job_Role: "Research Scientist",
  Monthly_Income: 4500,
  Years_at_Company: 2,
  Overtime: "No",
  Distance_From_Home: 5
};

const Employees = () => {
  const { datasetPredictions, setDatasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_NEW_EMPLOYEE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumeric = ["Age", "Monthly_Income", "Years_at_Company", "Distance_From_Home"].includes(name);
    setFormData({
      ...formData,
      [name]: isNumeric ? (value === "" ? "" : Number(value)) : value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.employeeName) {
      toast.error("Please enter Employee Name and ID.");
      return;
    }

    // Check if ID already exists
    const exists = datasetPredictions.some(p => String(p.Employee_ID || p.employee_id).toLowerCase() === formData.employeeId.toLowerCase());
    if (exists) {
      toast.error(`Employee ID ${formData.employeeId} already exists.`);
      return;
    }

    setLoading(true);
    try {
      // Build full feature payload using defaults for other satisfaction / history fields
      const payload = {
        Age: formData.Age,
        Gender: formData.Gender,
        Marital_Status: formData.Marital_Status,
        Department: formData.Department,
        Job_Role: formData.Job_Role,
        Job_Level: formData.Monthly_Income >= 10000 ? 4 : formData.Monthly_Income >= 6000 ? 3 : 2,
        Monthly_Income: formData.Monthly_Income,
        Hourly_Rate: Math.round(formData.Monthly_Income / 160) || 45,
        Years_at_Company: formData.Years_at_Company,
        Years_in_Current_Role: Math.max(0, formData.Years_at_Company - 1),
        Years_Since_Last_Promotion: 0,
        Work_Life_Balance: 3,
        Job_Satisfaction: 3,
        Performance_Rating: 3,
        Training_Hours_Last_Year: 2,
        Overtime: formData.Overtime,
        Project_Count: 3,
        Average_Hours_Worked_Per_Week: formData.Overtime === "Yes" ? 50 : 40,
        Absenteeism: 1,
        Work_Environment_Satisfaction: 3,
        Relationship_with_Manager: 3,
        Job_Involvement: 3,
        Distance_From_Home: formData.Distance_From_Home,
        Number_of_Companies_Worked: 1
      };

      const response = await apiClient.post("/predict", payload);

      if (response.data) {
        const newRecord = {
          ...payload,
          employeeId: formData.employeeId,
          employeeName: formData.employeeName,
          Employee_ID: formData.employeeId,
          Employee_Name: formData.employeeName,
          Prediction: response.data.prediction,
          Confidence: response.data.risk_percentage,
          Risk_Percentage: response.data.risk_percentage,
          Risk_Level: response.data.risk_level,
          Factors: response.data.factors,
          Recommendations: response.data.recommendations
        };

        setDatasetPredictions([newRecord, ...datasetPredictions]);
        toast.success("Employee added and attrition risk calculated!");
        setShowModal(false);
        setFormData(DEFAULT_NEW_EMPLOYEE);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to save employee and run prediction.");
    } finally {
      setLoading(false);
    }
  };

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
              <p className="text-gray-500 mt-2">Manage and monitor employee attrition risk indicators.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold shadow-md flex items-center gap-2 transition hover:shadow-lg active:scale-95"
            >
              <FaUserPlus />
              Add Employee
            </button>
          </div>

          <EmployeeTable />

          {/* Add Employee Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowModal(false)}>
              <div 
                className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-slate-100 animate-slide-in overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FaUserPlus className="text-blue-600" />
                    Add New Employee Record
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Employee Name</label>
                      <input
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        placeholder="e.g. Sarah Jenkins"
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Employee ID</label>
                      <input
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        placeholder="e.g. EMP412"
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Age</label>
                      <input
                        type="number"
                        name="Age"
                        value={formData.Age}
                        onChange={handleChange}
                        min="18"
                        max="100"
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Gender</label>
                      <select
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition bg-white"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Marital Status</label>
                      <select
                        name="Marital_Status"
                        value={formData.Marital_Status}
                        onChange={handleChange}
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition bg-white"
                      >
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Department</label>
                      <select
                        name="Department"
                        value={formData.Department}
                        onChange={handleChange}
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition bg-white"
                      >
                        <option>Research & Development</option>
                        <option>Sales</option>
                        <option>Human Resources</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Job Role</label>
                      <select
                        name="Job_Role"
                        value={formData.Job_Role}
                        onChange={handleChange}
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition bg-white"
                      >
                        <option>Healthcare Representative</option>
                        <option>Human Resources</option>
                        <option>Laboratory Technician</option>
                        <option>Manager</option>
                        <option>Manufacturing Director</option>
                        <option>Research Director</option>
                        <option>Research Scientist</option>
                        <option>Sales Executive</option>
                        <option>Sales Representative</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Monthly Income ($)</label>
                      <input
                        type="number"
                        name="Monthly_Income"
                        value={formData.Monthly_Income}
                        onChange={handleChange}
                        min="1"
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Years at Company</label>
                      <input
                        type="number"
                        name="Years_at_Company"
                        value={formData.Years_at_Company}
                        onChange={handleChange}
                        min="0"
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">Overtime Status</label>
                      <select
                        name="Overtime"
                        value={formData.Overtime}
                        onChange={handleChange}
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition bg-white"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 font-semibold mb-1">DistanceFromHome (miles)</label>
                      <input
                        type="number"
                        name="Distance_From_Home"
                        value={formData.Distance_From_Home}
                        onChange={handleChange}
                        min="1"
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-sm transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 rounded-xl font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100 transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md flex items-center gap-2 transition hover:shadow-lg active:scale-95 disabled:bg-blue-400 text-sm animate-pulse-subtle"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Calculating Risk...
                        </>
                      ) : (
                        "Save Employee"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default Employees;