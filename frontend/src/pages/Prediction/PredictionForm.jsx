import { useState } from "react";
import PredictionResult from "./PredictionResult";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import { FaUser, FaBriefcase, FaHeart, FaSpinner, FaMagic } from "react-icons/fa";

const PRESETS = {
  highRisk: {
    employeeId: "EMP088",
    employeeName: "Alex Mercer",
    Age: 29,
    Gender: "Male",
    Marital_Status: "Single",
    Distance_From_Home: 18,
    Department: "Sales",
    Job_Role: "Sales Executive",
    Job_Level: 2,
    Monthly_Income: 3400,
    Hourly_Rate: 45,
    Overtime: "Yes",
    Years_at_Company: 3,
    Years_in_Current_Role: 2,
    Years_Since_Last_Promotion: 3,
    Work_Life_Balance: 1,
    Job_Satisfaction: 1,
    Work_Environment_Satisfaction: 1,
    Relationship_with_Manager: 2,
    Job_Involvement: 2,
    Performance_Rating: 3,
    Project_Count: 5,
    Average_Hours_Worked_Per_Week: 55,
    Absenteeism: 8,
    Training_Hours_Last_Year: 2,
    Number_of_Companies_Worked: 3,
  },
  lowRisk: {
    employeeId: "EMP102",
    employeeName: "Elena Rostova",
    Age: 42,
    Gender: "Female",
    Marital_Status: "Married",
    Distance_From_Home: 3,
    Department: "Research & Development",
    Job_Role: "Manufacturing Director",
    Job_Level: 4,
    Monthly_Income: 12500,
    Hourly_Rate: 85,
    Overtime: "No",
    Years_at_Company: 12,
    Years_in_Current_Role: 8,
    Years_Since_Last_Promotion: 1,
    Work_Life_Balance: 3,
    Job_Satisfaction: 4,
    Work_Environment_Satisfaction: 4,
    Relationship_with_Manager: 4,
    Job_Involvement: 3,
    Performance_Rating: 4,
    Project_Count: 3,
    Average_Hours_Worked_Per_Week: 39,
    Absenteeism: 1,
    Training_Hours_Last_Year: 3,
    Number_of_Companies_Worked: 1,
  }
};

const DEFAULT_STATE = {
  employeeId: "EMP-NEW",
  employeeName: "New Employee",
  Age: 35,
  Gender: "Male",
  Marital_Status: "Married",
  Distance_From_Home: 5,
  Department: "Research & Development",
  Job_Role: "Research Scientist",
  Job_Level: 2,
  Monthly_Income: 5500,
  Hourly_Rate: 60,
  Overtime: "No",
  Years_at_Company: 4,
  Years_in_Current_Role: 2,
  Years_Since_Last_Promotion: 0,
  Work_Life_Balance: 3,
  Job_Satisfaction: 3,
  Work_Environment_Satisfaction: 3,
  Relationship_with_Manager: 3,
  Job_Involvement: 3,
  Performance_Rating: 3,
  Project_Count: 3,
  Average_Hours_Worked_Per_Week: 40,
  Absenteeism: 2,
  Training_Hours_Last_Year: 2,
  Number_of_Companies_Worked: 2,
};

const PredictionForm = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_STATE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Parse numeric inputs appropriately
    const isNumeric = [
      "Age", "Distance_From_Home", "Job_Level", "Monthly_Income", "Hourly_Rate",
      "Years_at_Company", "Years_in_Current_Role", "Years_Since_Last_Promotion",
      "Work_Life_Balance", "Job_Satisfaction", "Work_Environment_Satisfaction",
      "Relationship_with_Manager", "Job_Involvement", "Performance_Rating",
      "Project_Count", "Average_Hours_Worked_Per_Week", "Absenteeism",
      "Training_Hours_Last_Year", "Number_of_Companies_Worked"
    ].includes(name);

    setFormData({
      ...formData,
      [name]: isNumeric ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const loadPreset = (presetKey) => {
    setFormData(PRESETS[presetKey]);
    toast.success(`Loaded demo template: ${PRESETS[presetKey].employeeName}`);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Validate fields are not empty
    const requiredKeys = Object.keys(DEFAULT_STATE);
    for (const key of requiredKeys) {
      if (formData[key] === "") {
        toast.error(`Please fill out the ${key.replace(/_/g, " ")} field.`);
        setLoading(false);
        return;
      }
    }

    try {
      // Strip frontend metadata keys before sending to API schema
      const { employeeId, employeeName, ...payload } = formData;
      
      const response = await apiClient.post("/predict", payload);
      
      if (response.data) {
        setResult({
          ...response.data,
          employeeName: formData.employeeName,
          employeeId: formData.employeeId,
        });
        toast.success("Attrition prediction completed!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "An error occurred while calling the prediction model.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Templates Row */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FaMagic className="text-amber-500" />
            Quick Demo Templates
          </h3>
          <p className="text-sm text-slate-500 mt-1">Pre-populate the form to simulate employee attrition risk profiles.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => loadPreset("highRisk")}
            className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition"
          >
            Load High-Risk Profile
          </button>
          <button
            type="button"
            onClick={() => loadPreset("lowRisk")}
            className="px-4 py-2 text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition"
          >
            Load Safe Profile
          </button>
        </div>
      </div>

      <form onSubmit={handlePredict} className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-50 border-b border-slate-100">
          {[
            { id: "personal", label: "Personal & Demographics", icon: <FaUser /> },
            { id: "job", label: "Job & Financials", icon: <FaBriefcase /> },
            { id: "satisfaction", label: "History & Satisfaction", icon: <FaHeart /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 font-semibold flex items-center justify-center gap-2 text-sm border-b-2 transition ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-slate-500 hover:bg-slate-100/50"
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Employee Name</label>
                <input
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Employee ID</label>
                <input
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="e.g. EMP123"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Age (years)</label>
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  placeholder="Age"
                  min="18"
                  max="100"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Gender</label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Marital Status</label>
                <select
                  name="Marital_Status"
                  value={formData.Marital_Status}
                  onChange={handleChange}
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
                >
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">DistanceFromHome (miles)</label>
                <input
                  type="number"
                  name="Distance_From_Home"
                  value={formData.Distance_From_Home}
                  onChange={handleChange}
                  placeholder="Commute Distance"
                  min="1"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          )}

          {activeTab === "job" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Department</label>
                <select
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
                >
                  <option>Research & Development</option>
                  <option>Sales</option>
                  <option>Human Resources</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Job Role</label>
                <select
                  name="Job_Role"
                  value={formData.Job_Role}
                  onChange={handleChange}
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
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
                <label className="text-slate-600 font-semibold mb-2 text-sm">Job Level (1 - 5)</label>
                <input
                  type="number"
                  name="Job_Level"
                  value={formData.Job_Level}
                  onChange={handleChange}
                  placeholder="Job Level"
                  min="1"
                  max="5"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Monthly Income ($)</label>
                <input
                  type="number"
                  name="Monthly_Income"
                  value={formData.Monthly_Income}
                  onChange={handleChange}
                  placeholder="Monthly Salary"
                  min="1"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Hourly Rate ($)</label>
                <input
                  type="number"
                  name="Hourly_Rate"
                  value={formData.Hourly_Rate}
                  onChange={handleChange}
                  placeholder="Hourly Rate"
                  min="1"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Overtime Status</label>
                <select
                  name="Overtime"
                  value={formData.Overtime}
                  onChange={handleChange}
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "satisfaction" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Years at Company</label>
                <input
                  type="number"
                  name="Years_at_Company"
                  value={formData.Years_at_Company}
                  onChange={handleChange}
                  min="0"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Years in Current Role</label>
                <input
                  type="number"
                  name="Years_in_Current_Role"
                  value={formData.Years_in_Current_Role}
                  onChange={handleChange}
                  min="0"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Years since Last Promotion</label>
                <input
                  type="number"
                  name="Years_Since_Last_Promotion"
                  value={formData.Years_Since_Last_Promotion}
                  onChange={handleChange}
                  min="0"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {[
                { name: "Work_Life_Balance", label: "Work Life Balance (1-4)" },
                { name: "Job_Satisfaction", label: "Job Satisfaction (1-4)" },
                { name: "Work_Environment_Satisfaction", label: "Environment Satisfaction (1-4)" },
                { name: "Relationship_with_Manager", label: "Relationship with Manager (1-4)" },
                { name: "Job_Involvement", label: "Job Involvement (1-4)" },
                { name: "Performance_Rating", label: "Performance Rating (1-4)" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-slate-600 font-semibold mb-2 text-sm">{field.label}</label>
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
                  >
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Medium</option>
                    <option value="3">3 - High</option>
                    <option value="4">4 - Outstanding</option>
                  </select>
                </div>
              ))}

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Project Count</label>
                <input
                  type="number"
                  name="Project_Count"
                  value={formData.Project_Count}
                  onChange={handleChange}
                  min="1"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Avg Hours/Week</label>
                <input
                  type="number"
                  name="Average_Hours_Worked_Per_Week"
                  value={formData.Average_Hours_Worked_Per_Week}
                  onChange={handleChange}
                  min="1"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Absenteeism Days</label>
                <input
                  type="number"
                  name="Absenteeism"
                  value={formData.Absenteeism}
                  onChange={handleChange}
                  min="0"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">Training Hours (Last Year)</label>
                <input
                  type="number"
                  name="Training_Hours_Last_Year"
                  value={formData.Training_Hours_Last_Year}
                  onChange={handleChange}
                  min="0"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-600 font-semibold mb-2 text-sm">No. of Companies Worked</label>
                <input
                  type="number"
                  name="Number_of_Companies_Worked"
                  value={formData.Number_of_Companies_Worked}
                  onChange={handleChange}
                  min="0"
                  className="border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-8 py-6 flex justify-end gap-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_STATE)}
            className="px-6 py-3 rounded-xl font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition transform active:scale-95 disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Calculating...
              </>
            ) : (
              "Predict Attrition"
            )}
          </button>
        </div>
      </form>

      {result && (
        <PredictionResult result={result} baseEmployee={formData} />
      )}
    </div>
  );
};

export default PredictionForm;
