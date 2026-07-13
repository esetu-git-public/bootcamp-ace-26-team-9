import { useState } from "react";
import { useDataset } from "../../context/DatasetContext";
import MainLayout from "../../layouts/MainLayout";
import EmptyState from "../../components/EmptyState";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import { FaBalanceScale, FaUser, FaUserPlus, FaChevronRight, FaSpinner, FaCheck, FaExclamationCircle } from "react-icons/fa";

const DEFAULT_CANDIDATE = {
  candidateName: "Jane Doe (Candidate)",
  Age: 28,
  Gender: "Female",
  Marital_Status: "Single",
  Department: "Sales",
  Job_Role: "Sales Executive",
  Monthly_Income: 5000,
  Years_at_Company: 3, // Proposed experience
  Overtime: "No",
  Distance_From_Home: 4,
};

const Compare = () => {
  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;

  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [existingEmployee, setExistingEmployee] = useState(null);
  
  const [candidateForm, setCandidateForm] = useState(DEFAULT_CANDIDATE);
  const [candidateResult, setCandidateResult] = useState(null);
  const [loadingCandidate, setLoadingCandidate] = useState(false);

  if (!isDatasetUploaded) {
    return (
      <MainLayout>
        <EmptyState />
      </MainLayout>
    );
  }

  // Handle choosing an existing employee
  const handleSelectEmployee = (e) => {
    const id = e.target.value;
    setSelectedEmpId(id);
    if (!id) {
      setExistingEmployee(null);
      return;
    }
    const emp = datasetPredictions.find(p => String(p.Employee_ID || p.employee_id) === String(id));
    setExistingEmployee(emp);
  };

  const handleCandidateChange = (e) => {
    const { name, value } = e.target;
    const isNumeric = ["Age", "Monthly_Income", "Years_at_Company", "Distance_From_Home"].includes(name);
    setCandidateForm({
      ...candidateForm,
      [name]: isNumeric ? (value === "" ? "" : Number(value)) : value
    });
  };

  const handlePredictCandidate = async (e) => {
    e.preventDefault();
    setLoadingCandidate(true);
    setCandidateResult(null);

    try {
      // Build full feature payload for candidate
      const payload = {
        Age: candidateForm.Age,
        Gender: candidateForm.Gender,
        Marital_Status: candidateForm.Marital_Status,
        Department: candidateForm.Department,
        Job_Role: candidateForm.Job_Role,
        Job_Level: candidateForm.Monthly_Income >= 10000 ? 4 : candidateForm.Monthly_Income >= 6000 ? 3 : 2,
        Monthly_Income: candidateForm.Monthly_Income,
        Hourly_Rate: Math.round(candidateForm.Monthly_Income / 160) || 45,
        Years_at_Company: candidateForm.Years_at_Company,
        Years_in_Current_Role: Math.max(0, candidateForm.Years_at_Company - 1),
        Years_Since_Last_Promotion: 0,
        Work_Life_Balance: 3,
        Job_Satisfaction: 3,
        Performance_Rating: 3,
        Training_Hours_Last_Year: 2,
        Overtime: candidateForm.Overtime,
        Project_Count: 3,
        Average_Hours_Worked_Per_Week: candidateForm.Overtime === "Yes" ? 50 : 40,
        Absenteeism: 1,
        Work_Environment_Satisfaction: 3,
        Relationship_with_Manager: 3,
        Job_Involvement: 3,
        Distance_From_Home: candidateForm.Distance_From_Home,
        Number_of_Companies_Worked: 1
      };

      const response = await apiClient.post("/predict", payload);

      if (response.data) {
        setCandidateResult({
          ...candidateForm,
          ...response.data
        });
        toast.success("Candidate attrition risk predicted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to run prediction on candidate.");
    } finally {
      setLoadingCandidate(false);
    }
  };

  // Decision logic
  const getDecision = () => {
    if (!existingEmployee || !candidateResult) return null;

    const empRisk = existingEmployee.Risk_Percentage || existingEmployee.Confidence || 0;
    const candRisk = candidateResult.risk_percentage || candidateResult.probability || 0;
    const empIncome = existingEmployee.Monthly_Income || existingEmployee.MonthlyIncome || 0;
    const candIncome = candidateResult.Monthly_Income || 0;

    let recommendation = "";
    let reason = "";
    let alertType = "";

    if (empRisk >= 65 && candRisk < 35) {
      recommendation = "HIRE NEW CANDIDATE";
      reason = `The existing employee has a very high attrition risk of ${empRisk}%, indicating high likelihood of near-term exit. The candidate shows low turnover risk (${candRisk}%) and can stabilize this role.`;
      alertType = "bg-red-50 text-red-800 border-red-200";
    } else if (empRisk < 35 && candRisk >= 60) {
      recommendation = "KEEP EXISTING EMPLOYEE";
      reason = `The existing employee is highly stable with low turnover risk (${empRisk}%) and familiar with organization policies. The candidate shows high predicted attrition risk (${candRisk}%) which could result in high turnover costs.`;
      alertType = "bg-emerald-50 text-emerald-800 border-emerald-200";
    } else if (empRisk < 40 && candRisk < 40) {
      if (candIncome < empIncome * 0.85) {
        recommendation = "HIRE CANDIDATE (COST ADVANTAGE)";
        reason = `Both show low attrition risk (Staff: ${empRisk}%, Candidate: ${candRisk}%). However, the candidate offers a salary saving of $${(empIncome - candIncome).toLocaleString()}/month, representing high financial efficiency.`;
        alertType = "bg-blue-50 text-blue-800 border-blue-200";
      } else {
        recommendation = "KEEP EXISTING EMPLOYEE";
        reason = `Both individuals show stable risk scores (Staff: ${empRisk}%, Candidate: ${candRisk}%). Retaining the existing employee is recommended to preserve domain expertise and avoid onboarding friction.`;
        alertType = "bg-emerald-50 text-emerald-800 border-emerald-200";
      }
    } else {
      recommendation = "INTERVENE & AUDIT BOTH";
      reason = `Both individuals show moderate-to-high risk levels (Staff: ${empRisk}%, Candidate: ${candRisk}%). Consider offering retention bonuses to the existing employee while checking alternative candidate pools.`;
      alertType = "bg-amber-50 text-amber-800 border-amber-200";
    }

    return { recommendation, reason, alertType };
  };

  const decision = getDecision();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaBalanceScale className="text-blue-600" />
            Hiring & Retention Comparison
          </h1>
          <p className="text-gray-500 mt-2">
            Benchmark current staff profiles against job candidates to optimize resource planning and salary distribution.
          </p>
        </div>

        {/* Comparison Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Existing Staff */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                <FaUser className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Existing Employee</h3>
                <p className="text-xs text-slate-400">Select a team member to compare</p>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-500 font-semibold mb-1">Search Employee</label>
              <select
                value={selectedEmpId}
                onChange={handleSelectEmployee}
                className="border border-slate-200 p-3 rounded-xl text-sm bg-white outline-none focus:border-blue-500 w-full"
              >
                <option value="">-- Choose Employee --</option>
                {datasetPredictions.map((p, idx) => {
                  const empId = p.Employee_ID || p.employee_id || `EMP${idx + 1000}`;
                  const empName = p.employeeName || p.Employee_Name || `Employee ${empId}`;
                  return (
                    <option key={empId} value={empId}>
                      {empName} ({empId})
                    </option>
                  );
                })}
              </select>
            </div>

            {existingEmployee ? (
              <div className="space-y-6 animate-fade-in">
                {/* Risk Score Card */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Turnover Risk Score</p>
                    <span className="text-2xl font-black text-slate-800 mt-1 block">
                      {existingEmployee.Risk_Percentage || existingEmployee.Confidence || 0}%
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    (existingEmployee.Risk_Percentage || existingEmployee.Confidence || 0) >= 70
                      ? "bg-red-50 text-red-700 border-red-200"
                      : (existingEmployee.Risk_Percentage || existingEmployee.Confidence || 0) >= 30
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {existingEmployee.Risk_Level || ((existingEmployee.Risk_Percentage || existingEmployee.Confidence || 0) >= 70 ? "High" : (existingEmployee.Risk_Percentage || existingEmployee.Confidence || 0) >= 30 ? "Medium" : "Low")} Risk
                  </span>
                </div>

                {/* Specific features list */}
                <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Job Role</span>
                    <p className="font-semibold text-slate-700 mt-0.5">{existingEmployee.Job_Role || existingEmployee.JobRole || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Monthly income</span>
                    <p className="font-semibold text-slate-700 mt-0.5">${Number(existingEmployee.Monthly_Income || existingEmployee.MonthlyIncome || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Years at Company</span>
                    <p className="font-semibold text-slate-700 mt-0.5">{existingEmployee.Years_at_Company || existingEmployee.YearsAtCompany || 0} years</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Working Overtime</span>
                    <p className="font-semibold text-slate-700 mt-0.5">{existingEmployee.Overtime || "No"}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400 font-medium">Key Driver Factors</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(existingEmployee.Factors || existingEmployee.factors || ["Tenure details"]).map((f, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Please choose a current employee to load details.
              </div>
            )}
          </div>

          {/* Right Panel: Candidate Predictor */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                <FaUserPlus className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Job Candidate</h3>
                <p className="text-xs text-slate-400">Configure parameters for the candidate</p>
              </div>
            </div>

            <form onSubmit={handlePredictCandidate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-semibold mb-1">Candidate Name</label>
                <input
                  name="candidateName"
                  value={candidateForm.candidateName}
                  onChange={handleCandidateChange}
                  className="border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-semibold mb-1">Job Role</label>
                <select
                  name="Job_Role"
                  value={candidateForm.Job_Role}
                  onChange={handleCandidateChange}
                  className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
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
                <label className="text-xs text-slate-500 font-semibold mb-1">Proposed Salary ($/mo)</label>
                <input
                  type="number"
                  name="Monthly_Income"
                  value={candidateForm.Monthly_Income}
                  onChange={handleCandidateChange}
                  className="border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-semibold mb-1">Years of Experience</label>
                <input
                  type="number"
                  name="Years_at_Company"
                  value={candidateForm.Years_at_Company}
                  onChange={handleCandidateChange}
                  className="border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-semibold mb-1">Overtime Expectation</label>
                <select
                  name="Overtime"
                  value={candidateForm.Overtime}
                  onChange={handleCandidateChange}
                  className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-semibold mb-1">Commute Distance (miles)</label>
                <input
                  type="number"
                  name="Distance_From_Home"
                  value={candidateForm.Distance_From_Home}
                  onChange={handleCandidateChange}
                  className="border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={loadingCandidate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow flex items-center justify-center gap-2 active:scale-95 disabled:bg-blue-400"
                >
                  {loadingCandidate ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Analyzing Risk Profile...
                    </>
                  ) : (
                    "Predict Candidate Risk"
                  )}
                </button>
              </div>
            </form>

            {candidateResult && (
              <div className="space-y-6 border-t border-slate-100 pt-6 animate-fade-in">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Predicted Turnover Risk</p>
                    <span className="text-2xl font-black text-slate-800 mt-1 block">
                      {candidateResult.risk_percentage || candidateResult.probability || 0}%
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    (candidateResult.risk_percentage || candidateResult.probability || 0) >= 70
                      ? "bg-red-50 text-red-700 border-red-200"
                      : (candidateResult.risk_percentage || candidateResult.probability || 0) >= 30
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {candidateResult.risk_level || "Low"} Risk
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Benchmarking Comparison and decision output */}
        {existingEmployee && candidateResult && (
          <div className={`rounded-3xl border p-8 shadow-md flex flex-col md:flex-row gap-6 items-start md:items-center justify-between animate-fade-in ${decision?.alertType}`}>
            <div className="space-y-3">
              <h3 className="text-lg font-black tracking-wide uppercase flex items-center gap-2">
                <FaBalanceScale className="text-xl" />
                AI Recommendation: {decision?.recommendation}
              </h3>
              <p className="text-sm font-semibold leading-relaxed">
                {decision?.reason}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 bg-white px-5 py-3.5 rounded-2xl border shadow-sm font-black text-xs uppercase tracking-widest text-slate-700">
              <FaCheck className="text-emerald-500" /> Comparison Active
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Compare;
