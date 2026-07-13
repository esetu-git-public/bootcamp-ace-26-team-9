import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaChartLine,
} from "react-icons/fa";
import { useDataset } from "../../context/DatasetContext";

const ReportCards = () => {
  const { datasetPredictions } = useDataset();
  const total = datasetPredictions.length;
  const likelyToLeave = datasetPredictions.filter(
    (p) => p.Prediction === "Yes" || p.Prediction === "Leave"
  ).length;
  const active = total - likelyToLeave;
  const rate = total > 0 ? ((likelyToLeave / total) * 100).toFixed(1) + "%" : "0.0%";

  const cards = [
    {
      title: "Total Employees",
      value: total.toLocaleString(),
      icon: <FaUsers />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Employees",
      value: active.toLocaleString(),
      icon: <FaUserCheck />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Likely To Leave",
      value: likelyToLeave.toLocaleString(),
      icon: <FaUserTimes />,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Attrition Rate",
      value: rate,
      icon: <FaChartLine />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center"
        >
          <div>
            <p className="text-gray-500">{card.title}</p>
            <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
          </div>
          <div className={`text-3xl p-4 rounded-xl ${card.color}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportCards;