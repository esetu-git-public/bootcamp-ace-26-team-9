const reports = [
  {
    name: "Monthly Attrition Report",
    date: "08 Jul 2026",
    status: "Completed",
  },
  {
    name: "Department Analysis",
    date: "07 Jul 2026",
    status: "Completed",
  },
  {
    name: "High Risk Employees",
    date: "06 Jul 2026",
    status: "Pending",
  },
];

const RecentReports = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Recent Reports
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-4">Report</th>
            <th className="text-left p-4">Generated On</th>
            <th className="text-left p-4">Status</th>

          </tr>

        </thead>

        <tbody>

          {reports.map((report, index) => (

            <tr
              key={index}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-4 font-semibold">
                {report.name}
              </td>

              <td>{report.date}</td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    report.status === "Completed"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {report.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default RecentReports;