import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaChartLine,
} from "react-icons/fa";

const DashboardCards = ({ predictions = [] }) => {
  const total = predictions.length;
  const likelyToLeave = predictions.filter(
    (p) => p.Prediction === "Yes" || p.Prediction === "Leave"
  ).length;
  const active = total - likelyToLeave;
  const rate = total > 0 ? ((likelyToLeave / total) * 100).toFixed(1) + "%" : "0.0%";

  const cards = [
    {
      title: "Total Employees",
      value: total.toLocaleString(),
      icon: <FaUsers className="text-3xl text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Active Employees",
      value: active.toLocaleString(),
      icon: <FaUserCheck className="text-3xl text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Likely to Leave",
      value: likelyToLeave.toLocaleString(),
      icon: <FaUserTimes className="text-3xl text-red-600" />,
      color: "bg-red-100",
    },
    {
      title: "Attrition Rate",
      value: rate,
      icon: <FaChartLine className="text-3xl text-purple-600" />,
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition"
        >
          <div>
            <p className="text-gray-500">{card.title}</p>

            <h2 className="text-3xl font-bold mt-2">
              {card.value}
            </h2>
          </div>

          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.color}`}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;