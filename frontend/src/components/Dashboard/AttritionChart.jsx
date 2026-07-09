import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const AttritionChart = ({ predictions = [] }) => {
  const stayCount = predictions.filter(
    (p) => p.Prediction === "No" || p.Prediction === "Stay"
  ).length;
  const leaveCount = predictions.filter(
    (p) => p.Prediction === "Yes" || p.Prediction === "Leave"
  ).length;

  const data = [
    { name: "Stay", count: stayCount, fill: "#10B981" },
    { name: "Leave", count: leaveCount, fill: "#EF4444" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Attrition Prediction Summary
        </h2>
        <p className="text-gray-500 text-sm">
          Number of employees predicted to stay vs leave
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3B82F6" name="Employees">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttritionChart;