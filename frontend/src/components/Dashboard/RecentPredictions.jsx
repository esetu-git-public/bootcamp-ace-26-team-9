import {
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const RecentPredictions = ({ predictions = [] }) => {
  // Extract and map the first 5 predictions from the CSV data
  const displayPredictions = predictions.slice(0, 5).map((p, index) => {
    const isLeave = p.Prediction === "Yes" || p.Prediction === "Leave";
    const confidence = p.Confidence || 50;

    let risk = "Low";
    if (isLeave) {
      risk = confidence >= 70 ? "High" : "Medium";
    }

    return {
      id: p.Employee_ID || p.EmployeeNumber || `EMP-${index + 1}`,
      employee: p.EmployeeName || `Employee #${p.Employee_ID || p.EmployeeNumber || index + 1}`,
      department: p.Department || "Other",
      probability: `${confidence}%`,
      risk: risk,
      status: isLeave ? "Pending" : "Completed",
    };
  });

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="text-green-600" />;
      case "Reviewed":
        return <FaExclamationTriangle className="text-yellow-600" />;
      default:
        return <FaTimesCircle className="text-red-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Recent Predictions
          </h2>

          <p className="text-gray-500 text-sm">
            Latest employee attrition predictions
          </p>
        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-4">Employee</th>
              <th className="text-left py-4">Department</th>
              <th className="text-left py-4">Probability</th>
              <th className="text-left py-4">Risk</th>
              <th className="text-left py-4">Status</th>
              <th className="text-center py-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {displayPredictions.map((item) => (

              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="py-4 font-medium">
                  {item.employee}
                </td>

                <td>{item.department}</td>

                <td>{item.probability}</td>

                <td className={getRiskColor(item.risk)}>
                  <strong>{item.risk}</strong>
                </td>

                <td>

                  <div className="flex items-center gap-2">

                    {getStatusIcon(item.status)}

                    {item.status}

                  </div>

                </td>

                <td className="text-center">

                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition">

                    <FaEye />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentPredictions;