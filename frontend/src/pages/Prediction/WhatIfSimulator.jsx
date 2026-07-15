import React, { useState } from "react";
import axios from "axios";

const WhatIfSimulator = ({ baseEmployee, initialPrediction }) => {
  const [overTime, setOverTime] = useState(baseEmployee?.Overtime || baseEmployee?.OverTime || "No");
  const [monthlyIncome, setMonthlyIncome] = useState(baseEmployee?.Monthly_Income || baseEmployee?.MonthlyIncome || 5000);
  const [jobSatisfaction, setJobSatisfaction] = useState(baseEmployee?.Job_Satisfaction || baseEmployee?.JobSatisfaction || 3);
  const [workLifeBalance, setWorkLifeBalance] = useState(baseEmployee?.Work_Life_Balance || baseEmployee?.WorkLifeBalance || 3);

  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    if (!baseEmployee) return;
    setLoading(true);
    try {
      const payload = {
        employee: baseEmployee,
        modifications: {
          OverTime: overTime,
          Overtime: overTime,
          MonthlyIncome: Number(monthlyIncome),
          Monthly_Income: Number(monthlyIncome),
          JobSatisfaction: Number(jobSatisfaction),
          Job_Satisfaction: Number(jobSatisfaction),
          WorkLifeBalance: Number(workLifeBalance),
          Work_Life_Balance: Number(workLifeBalance),
        },
      };
      const response = await axios.post("http://127.0.0.1:8000/predict/what-if", payload);
      setSimulationResult(response.data);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-blue-900/10 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-lg">
      <div className="flex items-center justify-between pb-4 border-b border-indigo-100 dark:border-indigo-800/50">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Interactive AI Sandbox
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            What-If Retention Simulator
          </h3>
        </div>
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          {loading ? "Simulating..." : "Run Simulation"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-2">
            Overtime Schedule
          </label>
          <select
            value={overTime}
            onChange={(e) => setOverTime(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
          >
            <option value="No">No Overtime</option>
            <option value="Yes">Yes (Mandatory Overtime)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-2">
            Monthly Salary (${monthlyIncome})
          </label>
          <input
            type="range"
            min="2000"
            max="15000"
            step="500"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            className="w-full accent-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-2">
            Job Satisfaction ({jobSatisfaction}/4)
          </label>
          <select
            value={jobSatisfaction}
            onChange={(e) => setJobSatisfaction(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
          >
            <option value={1}>1 - Low</option>
            <option value={2}>2 - Medium</option>
            <option value={3}>3 - High</option>
            <option value={4}>4 - Very High</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-2">
            Work-Life Balance ({workLifeBalance}/4)
          </label>
          <select
            value={workLifeBalance}
            onChange={(e) => setWorkLifeBalance(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
          >
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Adequate</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Excellent</option>
          </select>
        </div>
      </div>

      {simulationResult && (
        <div className="mt-6 p-5 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Simulation Result</p>
              <p className="text-base text-gray-800 dark:text-gray-200 mt-1">
                {simulationResult.summary}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-xs text-gray-500">New Probability</span>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {simulationResult.simulated.probability}%
                </p>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">New Risk Level</span>
                <span className={`block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                  simulationResult.simulated.risk_level === "High"
                    ? "bg-red-100 text-red-800"
                    : simulationResult.simulated.risk_level === "Medium"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}>
                  {simulationResult.simulated.risk_level}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;
