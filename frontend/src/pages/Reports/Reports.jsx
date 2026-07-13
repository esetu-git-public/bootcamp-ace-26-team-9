import MainLayout from "../../layouts/MainLayout";
import { useDataset } from "../../context/DatasetContext";
import EmptyState from "../../components/EmptyState";
import ReportCards from "../../components/Report/ReportCards";
import DepartmentChart from "../../components/Report/DepartmentChart";
import RecentReports from "../../components/Report/RecentReports";
import { FaFilePdf, FaFileExcel, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Reports = () => {
  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;

  // CSV download handler
  const handleDownloadCSV = () => {
    if (datasetPredictions.length === 0) {
      toast.error("No dataset available to export.");
      return;
    }
    
    // Define headers
    const headers = [
      "Employee_ID", "Age", "Gender", "Marital_Status", "Department", "Job_Role",
      "Monthly_Income", "Years_at_Company", "Overtime", "Prediction", "Risk_Percentage", "Risk_Level"
    ];
    
    const csvRows = [headers.join(",")];
    
    for (const row of datasetPredictions) {
      const values = headers.map(header => {
        let val = row[header];
        if (val === undefined) {
          // Fallback check for different keys
          const lowerKey = header.toLowerCase();
          val = row[lowerKey] !== undefined ? row[lowerKey] : "";
        }
        
        // Wrap strings containing commas
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
    link.setAttribute("download", `employee_attrition_prediction_matrix_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV prediction report downloaded!");
  };

  // PDF report printing handler
  const handleDownloadPDF = () => {
    if (datasetPredictions.length === 0) {
      toast.error("No dataset available to generate PDF.");
      return;
    }
    
    const highRiskStaff = datasetPredictions.filter(
      (p) => (p.Risk_Percentage || p.Confidence || 0) >= 70
    );
    
    const printWindow = window.open("", "_blank");
    
    let rowsHtml = "";
    highRiskStaff.forEach((p, idx) => {
      const empId = p.Employee_ID || p.employee_id || `EMP${idx + 1000}`;
      const empName = p.employeeName || p.Employee_Name || `Employee ${empId}`;
      rowsHtml += `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
          <td style="padding: 12px 8px; font-weight: bold; color: #475569;">${empId}</td>
          <td style="padding: 12px 8px; font-weight: 600; color: #1e293b;">${empName}</td>
          <td style="padding: 12px 8px; color: #475569;">${p.Department || "N/A"}</td>
          <td style="padding: 12px 8px; color: #475569;">${p.Job_Role || p.JobRole || "N/A"}</td>
          <td style="padding: 12px 8px; text-align: center;">
            <span style="background-color: #fef2f2; color: #b91c1c; border: 1px solid #fee2e2; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 11px;">
              HIGH RISK (${p.Risk_Percentage || p.Confidence || 0}%)
            </span>
          </td>
          <td style="padding: 12px 8px; color: #475569; font-size: 12px;">${(p.Factors || []).join(", ") || "N/A"}</td>
        </tr>
      `;
    });

    if (highRiskStaff.length === 0) {
      rowsHtml = `
        <tr>
          <td colspan="6" style="padding: 30px; text-align: center; color: #64748b; font-size: 14px;">
            No high turnover risk cases (risk >= 70%) identified in this batch.
          </td>
        </tr>
      `;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>AI HR Attrition Risk Report</title>
          <style>
            body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-title { display: flex; align-items: center; gap: 10px; }
            h1 { color: #1e3a8a; margin: 0; font-size: 26px; }
            .meta-text { color: #64748b; font-size: 12px; margin-top: 4px; }
            .btn-print { background-color: #2563eb; color: white; border: none; padding: 10px 22px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
            .btn-print:hover { background-color: #1d4ed8; }
            .kpi-row { display: flex; gap: 20px; margin-bottom: 35px; }
            .kpi-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 12px; text-align: center; }
            .kpi-label { color: #64748b; font-size: 12px; font-weight: 600; text-uppercase: uppercase; letter-spacing: 0.05em; }
            .kpi-value { font-size: 28px; font-weight: 800; color: #1e3a8a; margin-top: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            th { background-color: #1e3a8a; color: white; padding: 12px 10px; text-align: left; font-size: 13px; font-weight: 600; }
            tr:nth-child(even) { background-color: #f8fafc; }
            @media print {
              .btn-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-title">
              <div>
                <h1>HR AI Attrition Risk Report</h1>
                <div class="meta-text">Employee Turnover Intelligence Auditing System</div>
              </div>
            </div>
            <button onclick="window.print()" class="btn-print">Print Report / Save as PDF</button>
          </div>
          
          <div style="margin-bottom: 25px; font-size: 13px; color: #475569;">
            <div>Report Generated On: <strong>${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString()}</strong></div>
            <div>Total Batch Size: <strong>${datasetPredictions.length} employees</strong></div>
          </div>
          
          <div class="kpi-row">
            <div class="kpi-card">
              <div class="kpi-label">HIGH TURNOVER RISK EMPLOYEES</div>
              <div class="kpi-value">${highRiskStaff.length}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">AVERAGE TURN OVER PROBABILITY</div>
              <div class="kpi-value">${(datasetPredictions.reduce((sum, p) => sum + (p.Risk_Percentage || p.Confidence || 0), 0) / datasetPredictions.length).toFixed(1)}%</div>
            </div>
          </div>
          
          <h3 style="color: #1e3a8a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">High Attrition Risk Cohort Audit (Risk Score &gt;= 70%)</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Job Role</th>
                <th style="text-align: center;">Risk Score</th>
                <th>Key Drivers / Indicators</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success("PDF print preview loaded!");
  };

  return (
    <MainLayout>
      {!isDatasetUploaded ? (
        <EmptyState />
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaFileAlt className="text-blue-600" />
                Reports & AI Auditing
              </h1>
              <p className="text-gray-500 mt-2">
                Export and print comprehensive data reports on turnover forecasting and metrics distributions.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold shadow transition transform active:scale-95 text-sm"
              >
                <FaFilePdf />
                Export PDF Audit
              </button>

              <button
                onClick={handleDownloadCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold shadow transition transform active:scale-95 text-sm"
              >
                <FaFileExcel />
                Export CSV Report
              </button>
            </div>
          </div>

          <ReportCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentReports onDownloadCSV={handleDownloadCSV} onDownloadPDF={handleDownloadPDF} />
            </div>
            <div>
              <DepartmentChart />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Reports;