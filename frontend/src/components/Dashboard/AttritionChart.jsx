import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", attrition: 12 },
  { month: "Feb", attrition: 15 },
  { month: "Mar", attrition: 10 },
  { month: "Apr", attrition: 18 },
  { month: "May", attrition: 14 },
  { month: "Jun", attrition: 20 },
];

const AttritionChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Monthly Attrition Trend
        </h2>

        <p className="text-gray-500 text-sm">
          Employee attrition over the last six months
        </p>

      </div>

      <ResponsiveContainer width="100%" height={320}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="attrition"
            stroke="#2563EB"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default AttritionChart;