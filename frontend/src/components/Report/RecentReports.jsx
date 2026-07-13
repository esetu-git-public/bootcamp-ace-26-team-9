import { FaFileCsv, FaFilePdf } from "react-icons/fa";

const RecentReports = ({ onDownloadCSV, onDownloadPDF }) => {
  const reportsList = [
    {
      name: "Employee Predictions Matrix",
      format: "CSV",
      description: "Detailed attrition prediction scores, risk levels, and categories for all employee records.",
      icon: <FaFileCsv className="text-emerald-600 text-xl" />,
      action: onDownloadCSV,
      btnLabel: "Download CSV",
      btnClass: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
    },
    {
      name: "High Turnover Risk Cohort",
      format: "PDF",
      description: "Audit-ready report of employees identified as high risk (risk score >= 70%) with key driver factors.",
      icon: <FaFilePdf className="text-red-600 text-xl" />,
      action: onDownloadPDF,
      btnLabel: "Generate PDF",
      btnClass: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-8 border border-slate-100">
      <h2 className="text-xl font-bold mb-6 text-slate-800">Available AI Reports</h2>

      <div className="space-y-4">
        {reportsList.map((report, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-blue-200 transition gap-4 bg-slate-50/50"
          >
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm shrink-0">
                {report.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">{report.name}</h3>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                    {report.format}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{report.description}</p>
              </div>
            </div>

            <button
              onClick={report.action}
              className={`px-4 py-2 text-xs font-bold border rounded-xl transition shrink-0 self-start sm:self-center ${report.btnClass}`}
            >
              {report.btnLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReports;