import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const DepartmentChart = () => {
  const data = [
    { name: "IT", value: 35 },
    { name: "Sales", value: 25 },
    { name: "HR", value: 15 },
    { name: "Finance", value: 10 },
    { name: "Marketing", value: 15 },
  ];

  const COLORS = [
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Department Distribution
        </h2>

        <p className="text-gray-500 text-sm">
          Employees by department
        </p>

      </div>

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