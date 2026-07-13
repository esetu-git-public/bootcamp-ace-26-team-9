import { useState } from "react";
import { FaEye, FaTrash, FaSearch, FaFilter, FaTimes, FaExclamationTriangle, FaLightbulb, FaUser } from "react-icons/fa";
import { useDataset } from "../../context/DatasetContext";
import toast from "react-hot-toast";

const EmployeeTable = () => {
  const { datasetPredictions, setDatasetPredictions } = useDataset();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [attrFilter, setAttrFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Get unique filter values from current predictions list
  const departments = [...new Set(datasetPredictions.map(p => p.Department).filter(Boolean))];
  const roles = [...new Set(datasetPredictions.map(p => p.Job_Role || p.JobRole).filter(Boolean))];

  // Filtering logic
  const filteredPredictions = datasetPredictions.filter((p) => {
    const name = String(p.employeeName || p.Employee_Name || "Employee").toLowerCase();
    const id = String(p.Employee_ID || p.employee_id || "").toLowerCase();
    const searchMatch = name.includes(search.toLowerCase()) || id.includes(search.toLowerCase());

    const deptMatch = !deptFilter || String(p.Department || "").toLowerCase() === deptFilter.toLowerCase();
    const roleMatch = !roleFilter || String(p.Job_Role || p.JobRole || "").toLowerCase() === roleFilter.toLowerCase();
    
    // Prediction could be "Yes"/"No" or "Leave"/"Stay"
    const pVal = String(p.Prediction || "").toLowerCase();
    let isAttritionMatch = true;
    if (attrFilter === "Yes") {
      isAttritionMatch = pVal === "yes" || pVal === "leave";
    } else if (attrFilter === "No") {
      isAttritionMatch = pVal === "no" || pVal === "stay";
    }

    const riskMatch = !riskFilter || String(p.Risk_Level || "").toLowerCase() === riskFilter.toLowerCase();
    const genderMatch = !genderFilter || String(p.Gender || "").toLowerCase() === genderFilter.toLowerCase();

    return searchMatch && deptMatch && roleMatch && isAttritionMatch && riskMatch && genderMatch;
  });

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to remove Employee ${id}?`)) {
      const updated = datasetPredictions.filter(p => (p.Employee_ID || p.employee_id) !== id);
      setDatasetPredictions(updated);
      toast.success("Employee removed successfully!");
    }
  };

  const getRiskBadgeClass = (level) => {
    switch (String(level).toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaFilter className="text-blue-600 text-lg" />
            Filter Employees
          </h2>
          <div className="relative flex items-center bg-slate-100 rounded-xl px-4 py-2.5 w-full lg:w-96 shadow-inner border border-slate-200/50">
            <FaSearch className="text-slate-400 mr-2.5" />
            <input
              type="text"
              placeholder="Search by Employee ID or Name..."
              className="bg-transparent outline-none w-full text-sm text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-semibold mb-1">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-semibold mb-1">Job Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-semibold mb-1">Risk Level</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="">All Risks</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-semibold mb-1">Attrition Status</label>
            <select
              value={attrFilter}
              onChange={(e) => setAttrFilter(e.target.value)}
              className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Yes">Risk of Leaving</option>
              <option value="No">Stable (Stay)</option>
            </select>
          </div>

          <div className="flex flex-col col-span-2 sm:col-span-1">
            <label className="text-xs text-slate-500 font-semibold mb-1">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Employee Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            Employee List ({filteredPredictions.length} records)
          </h2>
          {(deptFilter || roleFilter || attrFilter || riskFilter || genderFilter || search) && (
            <button
              onClick={() => {
                setSearch("");
                setDeptFilter("");
                setRoleFilter("");
                setAttrFilter("");
                setRiskFilter("");
                setGenderFilter("");
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Risk Level</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPredictions.length > 0 ? (
                filteredPredictions.map((emp, index) => {
                  const empId = emp.Employee_ID || emp.employee_id || `EMP${index + 1000}`;
                  const empName = emp.employeeName || emp.Employee_Name || `Employee ${empId}`;
                  return (
                    <tr
                      key={empId}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition cursor-pointer"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      <td className="p-4 pl-6 font-bold text-slate-500 text-sm">
                        {empId}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{empName}</div>
                        <div className="text-xs text-slate-400">Age {emp.Age || "N/A"} • {emp.Gender || "N/A"}</div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{emp.Department || "N/A"}</td>
                      <td className="p-4 text-sm text-slate-600">{emp.Job_Role || emp.JobRole || "N/A"}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeClass(emp.Risk_Level || "Low")}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {(emp.Risk_Level || "Low").toUpperCase()} ({emp.Risk_Percentage || emp.Confidence || 0}%)
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setSelectedEmployee(emp)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-xl text-sm transition"
                            title="View Profile Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDelete(empId)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-xl text-sm transition"
                            title="Delete Record"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-slate-400 font-medium">
                    No employee records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50 animate-fade-in" onClick={() => setSelectedEmployee(null)}>
          <div 
            className="w-full max-w-2xl bg-white h-screen overflow-y-auto shadow-2xl p-8 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                    <FaUser size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {selectedEmployee.employeeName || selectedEmployee.Employee_Name || "Employee Profile"}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">ID: {selectedEmployee.Employee_ID || selectedEmployee.employee_id || "N/A"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Attrition Risk Gauge Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-slate-600 font-semibold text-sm">Attrition Risk Status</h3>
                  <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border border-current capitalize ${getRiskBadgeClass(selectedEmployee.Risk_Level || "Low")}`}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {selectedEmployee.Risk_Level || "Low"} Risk
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Prediction: {selectedEmployee.Prediction === "Yes" || selectedEmployee.Prediction === "Leave" ? "Likely to Leave" : "Stable"}</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-slate-800">{selectedEmployee.Risk_Percentage || selectedEmployee.Confidence || 0}%</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Risk Score</p>
                  </div>
                  <div className="w-1.5 h-10 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        (selectedEmployee.Risk_Percentage || selectedEmployee.Confidence || 0) >= 70
                          ? "bg-red-500"
                          : (selectedEmployee.Risk_Percentage || selectedEmployee.Confidence || 0) >= 30
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ height: `${selectedEmployee.Risk_Percentage || selectedEmployee.Confidence || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Profile Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Department</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{selectedEmployee.Department || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Job Role</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{selectedEmployee.Job_Role || selectedEmployee.JobRole || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Monthly Income</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    {selectedEmployee.Monthly_Income || selectedEmployee.MonthlyIncome
                      ? `$${Number(selectedEmployee.Monthly_Income || selectedEmployee.MonthlyIncome).toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Years at Company</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{selectedEmployee.Years_at_Company || selectedEmployee.YearsAtCompany || 0} years</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Overtime Status</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{selectedEmployee.Overtime || "No"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Job Satisfaction</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{selectedEmployee.Job_Satisfaction || selectedEmployee.JobSatisfaction || "N/A"} / 4</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Demographics</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{selectedEmployee.Gender || "N/A"} • Age {selectedEmployee.Age || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Marital Status</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{selectedEmployee.Marital_Status || selectedEmployee.MaritalStatus || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Work Life Balance</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{selectedEmployee.Work_Life_Balance || selectedEmployee.WorkLifeBalance || "N/A"} / 4</p>
                </div>
              </div>

              {/* Explainable AI Factors */}
              <div className="border-t border-slate-100 pt-6 mb-6">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <FaExclamationTriangle className="text-red-500" />
                  Key Attrition Risk Drivers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedEmployee.Factors || selectedEmployee.factors || ["General tenure factors"]).map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 bg-red-50/50 border border-red-100/50 p-3 rounded-xl text-xs font-semibold text-slate-700">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {factor}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <FaLightbulb className="text-amber-500" />
                  AI Recommended Retention Steps
                </h4>
                <div className="space-y-2">
                  {(selectedEmployee.Recommendations || selectedEmployee.recommendations || ["Standard HR monitoring and development"]).map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 bg-blue-50/30 border border-blue-100/30 p-3.5 rounded-xl text-xs font-semibold text-slate-700">
                      <span className="text-base">🎯</span>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-6 mt-8 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;