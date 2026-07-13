import {
  FaUsers,
  FaChartLine,
  FaExclamationTriangle,
  FaShieldAlt,
  FaCheckCircle,
  FaDollarSign,
  FaSmile,
  FaBriefcase,
} from "react-icons/fa";

const DashboardCards = ({ predictions = [] }) => {
  const total = predictions.length;
  const likelyToLeave = predictions.filter(
    (p) => p.Prediction === "Yes" || p.Prediction === "Leave"
  ).length;
  
  const rate = total > 0 ? ((likelyToLeave / total) * 100).toFixed(1) + "%" : "0.0%";

  // Risk levels mapping
  const highRisk = predictions.filter(
    (p) => (p.Risk_Percentage || p.Confidence || 0) >= 70
  ).length;
  
  const medRisk = predictions.filter((p) => {
    const risk = p.Risk_Percentage || p.Confidence || 0;
    return risk >= 30 && risk < 70;
  }).length;
  
  const lowRisk = predictions.filter(
    (p) => (p.Risk_Percentage || p.Confidence || 0) < 30
  ).length;

  // Averages
  const avgIncome = total > 0
    ? (predictions.reduce((sum, p) => sum + Number(p.Monthly_Income || p.MonthlyIncome || 0), 0) / total)
    : 0;

  const avgSatisfaction = total > 0
    ? (predictions.reduce((sum, p) => sum + Number(p.Job_Satisfaction || p.JobSatisfaction || 0), 0) / total)
    : 0;

  const avgYears = total > 0
    ? (predictions.reduce((sum, p) => sum + Number(p.Years_at_Company || p.YearsAtCompany || 0), 0) / total)
    : 0;

  const cards = [
    {
      title: "Total Employees",
      value: total.toLocaleString(),
      icon: <FaUsers className="text-3xl text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Attrition Rate",
      value: rate,
      icon: <FaChartLine className="text-3xl text-purple-600" />,
      color: "bg-purple-100",
    },
    {
      title: "High Risk Employees",
      value: highRisk.toLocaleString(),
      icon: <FaExclamationTriangle className="text-3xl text-red-600" />,
      color: "bg-red-100",
    },
    {
      title: "Medium Risk Employees",
      value: medRisk.toLocaleString(),
      icon: <FaShieldAlt className="text-3xl text-orange-600" />,
      color: "bg-orange-100",
    },
    {
      title: "Low Risk Employees",
      value: lowRisk.toLocaleString(),
      icon: <FaCheckCircle className="text-3xl text-emerald-600" />,
      color: "bg-emerald-100",
    },
    {
      title: "Avg Monthly Income",
      value: `$${avgIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: <FaDollarSign className="text-3xl text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Avg Job Satisfaction",
      value: `${avgSatisfaction.toFixed(2)} / 4`,
      icon: <FaSmile className="text-3xl text-amber-600" />,
      color: "bg-amber-100",
    },
    {
      title: "Avg Years at Company",
      value: `${avgYears.toFixed(1)} yrs`,
      icon: <FaBriefcase className="text-3xl text-indigo-600" />,
      color: "bg-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition"
        >
          <div>
            <p className="text-gray-500 font-medium text-sm">{card.title}</p>
            <h2 className="text-2xl font-bold mt-2 text-gray-800">
              {card.value}
            </h2>
          </div>

          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.color}`}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;