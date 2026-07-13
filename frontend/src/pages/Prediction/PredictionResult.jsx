import React from "react";
import { FaExclamationCircle, FaShieldAlt, FaLightbulb, FaUser, FaInfoCircle } from "react-icons/fa";
import WhatIfSimulator from "./WhatIfSimulator";

const PredictionResult = ({ result, baseEmployee }) => {
  if (!result) return null;

  const isHighRisk = result.risk_level === "High";
  const isMediumRisk = result.risk_level === "Medium";

  // Badge styling
  let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let textColor = "text-emerald-600";
  let circleColor = "stroke-emerald-500";
  if (isHighRisk) {
    badgeColor = "bg-red-50 text-red-700 border-red-200";
    textColor = "text-red-600";
    circleColor = "stroke-red-500";
  } else if (isMediumRisk) {
    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
    textColor = "text-amber-600";
    circleColor = "stroke-amber-500";
  }

  // Calculate circular stroke offset
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((result.risk_percentage || result.probability || 0) / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-in mt-8">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
          <FaInfoCircle className="text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Attrition Analysis for {result.employeeName || "Employee"}
          </h2>
          <p className="text-sm text-slate-500">Employee ID: {result.employeeId || "N/A"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk meter panel */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center">
          <h3 className="text-slate-600 font-semibold text-sm mb-4">Attrition Risk Score</h3>

          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-200 fill-none"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className={`${circleColor} fill-none transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800">
                {result.risk_percentage || result.probability || 0}%
              </span>
            </div>
          </div>

          <div className={`mt-6 px-4 py-1.5 rounded-full border text-sm font-semibold capitalize ${badgeColor}`}>
            {result.risk_level} Risk Level
          </div>

          <div className="mt-4 text-xs text-slate-400 font-medium">
            Calculated via AI model: {result.model_name || "Gradient Boosting"}
          </div>
        </div>

        {/* Factors & Explanations */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <FaExclamationCircle className="text-red-500" />
              Explainable AI: Key Attrition Drivers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(result.factors || result.top_factors || []).map((factor, index) => (
                <div key={index} className="flex items-start gap-3 bg-red-50/40 p-4 rounded-xl border border-red-100/50">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
                  <p className="text-sm font-medium text-slate-700">{factor}</p>
                </div>
              ))}
              {(!result.factors && !result.top_factors) && (
                <div className="p-4 text-sm text-slate-500 bg-slate-50 rounded-xl w-full">
                  No critical negative drivers found. Employee is in safe thresholds.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <FaLightbulb className="text-amber-500" />
              AI Recommendations & Intervention Plan
            </h3>

            <div className="space-y-3">
              {(result.recommendations || []).map((rec, index) => (
                <div key={index} className="flex items-start gap-3 bg-blue-50/30 p-4 rounded-xl border border-blue-100/40">
                  <span className="text-lg mt-0.5 shrink-0">🎯</span>
                  <p className="text-sm font-medium text-slate-700">{rec}</p>
                </div>
              ))}
              {(!result.recommendations || result.recommendations.length === 0) && (
                <div className="p-4 text-sm text-slate-500 bg-slate-50 rounded-xl w-full">
                  No immediate interventions required. Focus on standard career progression support.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive What-If Sandbox */}
      {baseEmployee && (
        <WhatIfSimulator baseEmployee={baseEmployee} initialPrediction={result} />
      )}
    </div>
  );
};

export default PredictionResult;
