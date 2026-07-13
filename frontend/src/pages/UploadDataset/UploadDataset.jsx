import { useState, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useDataset } from "../../context/DatasetContext";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import {
  FaCloudUploadAlt,
  FaFileCsv,
  FaDownload,
  FaSpinner,
  FaSearch,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10B981", "#EF4444"]; // Stay (No) vs Leave (Yes)

const UploadDataset = () => {
  const {
    datasetPredictions: predictions,
    setDatasetPredictions: setPredictions,
    datasetFile: file,
    setDatasetFile: setFile,
  } = useDataset();

  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [validationReport, setValidationReport] = useState(null);
  const fileInputRef = useRef(null);

  const validateCSV = (fileToValidate) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length < 2) {
        setValidationReport({
          isValid: false,
          errors: ["CSV file is empty or missing data rows."],
          warnings: [],
          rowCount: 0
        });
        return;
      }
      
      const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
      const requiredColumns = [
        "Age", "Gender", "Marital_Status", "Department", "Job_Role", "Job_Level",
        "Monthly_Income", "Hourly_Rate", "Years_at_Company", "Years_in_Current_Role",
        "Years_Since_Last_Promotion", "Work_Life_Balance", "Job_Satisfaction",
        "Performance_Rating", "Training_Hours_Last_Year", "Overtime", "Project_Count",
        "Average_Hours_Worked_Per_Week", "Absenteeism", "Work_Environment_Satisfaction",
        "Relationship_with_Manager", "Job_Involvement", "Distance_From_Home",
        "Number_of_Companies_Worked"
      ];
      
      const missingColumns = [];
      requiredColumns.forEach(col => {
        const match = headers.some(h => 
          h.toLowerCase() === col.toLowerCase() || 
          h.toLowerCase().replace(/_/g, "") === col.toLowerCase().replace(/_/g, "")
        );
        if (!match) {
          missingColumns.push(col);
        }
      });
      
      const errorsList = [];
      const warningsList = [];
      if (missingColumns.length > 0) {
        errorsList.push(`Missing required features: ${missingColumns.join(", ")}`);
      }
      
      let duplicateCount = 0;
      let missingValueCount = 0;
      const seenRows = new Set();
      
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        if (seenRows.has(row)) {
          duplicateCount++;
        } else {
          seenRows.add(row);
        }
        
        const cells = row.split(",");
        cells.forEach(cell => {
          const val = cell.trim();
          if (val === "" || val.toLowerCase() === "null" || val.toLowerCase() === "na") {
            missingValueCount++;
          }
        });
      }
      
      if (duplicateCount > 0) {
        warningsList.push(`Found ${duplicateCount} duplicate records.`);
      }
      if (missingValueCount > 0) {
        warningsList.push(`Found ${missingValueCount} missing or blank cells.`);
      }
      
      setValidationReport({
        isValid: errorsList.length === 0,
        errors: errorsList,
        warnings: warningsList,
        rowCount: lines.length - 1,
        columnCount: headers.length
      });
    };
    reader.readAsText(fileToValidate);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        setError(null);
        validateCSV(droppedFile);
      } else {
        setError("Only CSV files are supported.");
        setValidationReport(null);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        setError(null);
        validateCSV(selectedFile);
      } else {
        setError("Only CSV files are supported.");
        setValidationReport(null);
      }
    }
  };


  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first.");
      toast.error("Please select a CSV file first.");
      return;
    }

    if (validationReport && !validationReport.isValid) {
      setError("Cannot upload. CSV validation failed.");
      toast.error("Please fix CSV validation errors before uploading.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post("/predict/csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.predictions) {
        setPredictions(response.data.predictions);
        toast.success("Dataset uploaded and predictions completed!");
      } else {
        setError("Invalid response format from the server.");
        toast.error("Invalid response format from the server.");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || "An error occurred while uploading and analyzing the dataset.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };


  const handleDownloadCSV = () => {
    if (predictions.length === 0) return;

    // Convert predictions back to CSV
    const headers = Object.keys(predictions[0]);
    const csvRows = [headers.join(",")];

    for (const row of predictions) {
      const values = headers.map((header) => {
        const val = row[header];
        // Handle strings that might contain commas
        if (typeof val === "string" && val.includes(",")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(","));
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attrition_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Data processing for analytics
  const totalEmployees = predictions.length;
  const attritionCount = predictions.filter(
    (p) => p.Prediction === "Yes" || p.Prediction === "Leave"
  ).length;
  const retentionCount = totalEmployees - attritionCount;
  const attritionRate = totalEmployees > 0 ? ((attritionCount / totalEmployees) * 100).toFixed(1) : 0;
  
  const avgConfidence = totalEmployees > 0
    ? (predictions.reduce((sum, p) => sum + (p.Confidence || 0), 0) / totalEmployees).toFixed(1)
    : 0;

  // Pie chart data
  const pieData = totalEmployees > 0 ? [
    { name: "Retained (Stay)", value: retentionCount },
    { name: "Attrition Risk (Leave)", value: attritionCount },
  ] : [];

  // Department-wise bar chart data
  const getDeptData = () => {
    if (totalEmployees === 0) return [];
    
    const departments = {};
    predictions.forEach((p) => {
      // Backend dataset column could be Department or Department_Name
      const dept = p.Department || "Other";
      if (!departments[dept]) {
        departments[dept] = { name: dept, Stay: 0, Leave: 0 };
      }
      if (p.Prediction === "Yes" || p.Prediction === "Leave") {
        departments[dept].Leave += 1;
      } else {
        departments[dept].Stay += 1;
      }
    });

    return Object.values(departments);
  };

  const deptData = getDeptData();

  // Search filter
  const filteredPredictions = predictions.filter((p) => {
    const employeeId = String(p.Employee_ID || p.employee_id || "").toLowerCase();
    const gender = String(p.Gender || "").toLowerCase();
    const department = String(p.Department || "").toLowerCase();
    const role = String(p.Job_Role || p.JobRole || p.job_role || p.Job_role || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      employeeId.includes(query) ||
      gender.includes(query) ||
      department.includes(query) ||
      role.includes(query)
    );
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Batch Attrition Analysis</h1>
            <p className="text-gray-500 mt-1">
              Upload employee records in CSV format to run bulk attrition predictions and view analytics.
            </p>
          </div>
          {predictions.length > 0 && (
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium shadow-md transition-all transform active:scale-95"
            >
              <FaDownload />
              Download Predicted CSV
            </button>
          )}
        </div>

        {/* Upload Zone */}
        {predictions.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[300px] ${
                dragActive
                  ? "border-blue-600 bg-blue-50/50 scale-[1.02]"
                  : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
              <FaCloudUploadAlt className={`text-6xl mb-4 ${dragActive ? "text-blue-600" : "text-gray-400"}`} />
              <p className="text-xl font-semibold text-gray-700">
                {file ? file.name : "Drag & drop your CSV file here"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                or click to browse from your device
              </p>
              {file && (
                <div className="mt-4 flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  <FaFileCsv size={16} />
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-700">
                <FaExclamationCircle className="text-xl shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* CSV Validation Report */}
            {file && validationReport && (
              <div className="mt-6 space-y-4">
                {validationReport.isValid ? (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <FaCheckCircle className="text-lg" />
                      CSV Schema Validation Passed
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">
                      Ready to analyze {validationReport.rowCount} records across {validationReport.columnCount} columns.
                    </p>
                    {validationReport.warnings.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-semibold text-amber-700">Warnings / Information:</p>
                        {validationReport.warnings.map((w, idx) => (
                          <p key={idx} className="text-xs text-amber-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                            {w}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                    <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                      <FaExclamationCircle className="text-lg" />
                      CSV Schema Validation Failed
                    </div>
                    <div className="mt-2 space-y-1">
                      {validationReport.errors.map((errText, idx) => (
                        <p key={idx} className="text-xs text-red-600 font-medium">
                          • {errText}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                disabled={loading || !file || (validationReport && !validationReport.isValid)}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md ${
                  !file || (validationReport && !validationReport.isValid)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 text-white transform active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    Processing Predictions...
                  </>
                ) : (
                  "Run Analytics"
                )}
              </button>
            </div>

          </div>
        )}

        {/* Live Analysis Results */}
        {predictions.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">Uploaded Records</p>
                  <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{totalEmployees}</h3>
                </div>
                <div className="bg-blue-100 text-blue-600 rounded-2xl p-4 text-2xl font-bold">💡</div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">Predicted Attrition Cases</p>
                  <h3 className="text-3xl font-extrabold text-red-600 mt-2">{attritionCount}</h3>
                </div>
                <div className="bg-red-100 text-red-600 rounded-2xl p-4 text-2xl font-bold">⚠️</div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">Overall Attrition Rate</p>
                  <h3 className="text-3xl font-extrabold text-orange-500 mt-2">{attritionRate}%</h3>
                </div>
                <div className="bg-orange-100 text-orange-600 rounded-2xl p-4 text-2xl font-bold">📈</div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">Avg Prediction Confidence</p>
                  <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">{avgConfidence}%</h3>
                </div>
                <div className="bg-emerald-100 text-emerald-600 rounded-2xl p-4 text-2xl font-bold">🛡️</div>
              </div>
            </div>

            {/* Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Pie Chart: Retention Distribution */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Attrition Risk Split</h3>
                <div className="h-64 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart: Attrition by Department */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:col-span-3">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Attrition Risk by Department</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Stay" fill="#10B981" name="Stay" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Leave" fill="#EF4444" name="Leave" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Prediction Table Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Employee Attrition Predictions</h3>
                  <p className="text-gray-500 text-sm mt-1">Detailed list of analyzed employee profiles</p>
                </div>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 w-full md:w-80 shadow-inner">
                  <FaSearch className="text-gray-400 mr-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, Department, Role..."
                    className="bg-transparent outline-none w-full text-sm text-gray-700"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-sm font-semibold">
                      <th className="py-4 px-4">Employee ID</th>
                      <th className="py-4 px-4">Demographics</th>
                      <th className="py-4 px-4">Department & Job Role</th>
                      <th className="py-4 px-4 text-center">Prediction</th>
                      <th className="py-4 px-4 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPredictions.length > 0 ? (
                      filteredPredictions.map((row, index) => {
                        const hasAttrition = row.Prediction === "Yes" || row.Prediction === "Leave";
                        return (
                          <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                            <td className="py-4 px-4 font-semibold text-gray-800">
                              EMP{row.Employee_ID || row.employee_id || index + 1000}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm font-medium text-gray-700">
                                Age {row.Age || "N/A"}
                              </div>
                              <div className="text-xs text-gray-400">{row.Gender || "N/A"}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm font-medium text-gray-700">
                                {row.Department || "N/A"}
                              </div>
                              <div className="text-xs text-gray-400">
                                {row.Job_Role || row.JobRole || row.job_role || row.Job_role || "N/A"}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  hasAttrition
                                    ? "bg-red-50 text-red-700"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {hasAttrition ? "Yes (Leave)" : "No (Stay)"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-bold text-gray-800">{row.Confidence}%</span>
                              <div className="w-24 bg-gray-100 rounded-full h-1.5 ml-auto mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    hasAttrition ? "bg-red-500" : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${row.Confidence || 0}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                          No predictions match search filter
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UploadDataset;
