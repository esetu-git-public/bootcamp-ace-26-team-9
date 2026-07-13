import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDataset } from "../../context/DatasetContext";

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

const DepartmentChart = () => {
  const { datasetPredictions } = useDataset();

  const getDeptDistribution = () => {
    const depts = {};
    datasetPredictions.forEach((p) => {
      const dept = p.Department || "Other";
      depts[dept] = (depts[dept] || 0) + 1;
    });
    return Object.keys(depts).map((name) => ({
      name,
      value: depts[name],
    }));
  };

  const data = getDeptDistribution();

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Department Distribution</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentChart;