import { useDataset } from "../../context/DatasetContext";
import MainLayout from "../../layouts/MainLayout";
import EmptyState from "../../components/EmptyState";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { FaChartBar, FaUsers, FaUserClock, FaMoneyBillWave, FaBriefcase } from "react-icons/fa";

const PIE_COLORS = ["#10B981", "#EF4444"]; // Stay vs Leave
const THEME_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

const Analytics = () => {
  const { datasetPredictions } = useDataset();
  const isDatasetUploaded = datasetPredictions && datasetPredictions.length > 0;

  if (!isDatasetUploaded) {
    return (
      <MainLayout>
        <EmptyState />
      </MainLayout>
    );
  }

  // 1. Department-wise Attrition Calculation
  const getDeptData = () => {
    const data = {};
    datasetPredictions.forEach((p) => {
      const dept = p.Department || "Other";
      if (!data[dept]) data[dept] = { name: dept, Stay: 0, Leave: 0 };
      const isLeave = p.Prediction === "Yes" || p.Prediction === "Leave";
      if (isLeave) data[dept].Leave += 1;
      else data[dept].Stay += 1;
    });
    return Object.values(data);
  };

  // 2. Gender-wise Attrition Calculation
  const getGenderData = () => {
    let stayCount = 0;
    let leaveCount = 0;
    datasetPredictions.forEach((p) => {
      const isLeave = p.Prediction === "Yes" || p.Prediction === "Leave";
      if (isLeave) leaveCount += 1;
      else stayCount += 1;
    });
    return [
      { name: "Stay (Low Risk)", value: stayCount },
      { name: "Leave (High Risk)", value: leaveCount },
    ];
  };

  // 3. Age Distribution Calculation
  const getAgeData = () => {
    const buckets = {
      "18-25": { name: "18-25", Stay: 0, Leave: 0 },
      "26-35": { name: "26-35", Stay: 0, Leave: 0 },
      "36-45": { name: "36-45", Stay: 0, Leave: 0 },
      "46-55": { name: "46-55", Stay: 0, Leave: 0 },
      "56+": { name: "56+", Stay: 0, Leave: 0 },
    };

    datasetPredictions.forEach((p) => {
      const age = p.Age || 30;
      let bucket = "36-45";
      if (age <= 25) bucket = "18-25";
      else if (age <= 35) bucket = "26-35";
      else if (age <= 45) bucket = "36-45";
      else if (age <= 55) bucket = "46-55";
      else bucket = "56+";

      const isLeave = p.Prediction === "Yes" || p.Prediction === "Leave";
      if (isLeave) buckets[bucket].Leave += 1;
      else buckets[bucket].Stay += 1;
    });

    return Object.values(buckets);
  };

  // 4. Job Role Distribution Calculation
  const getRoleData = () => {
    const roles = {};
    datasetPredictions.forEach((p) => {
      const role = p.Job_Role || p.JobRole || "Other";
      if (!roles[role]) roles[role] = { name: role, Count: 0, Leave: 0 };
      roles[role].Count += 1;
      const isLeave = p.Prediction === "Yes" || p.Prediction === "Leave";
      if (isLeave) roles[role].Leave += 1;
    });
    // Sort and take top roles to avoid UI overflow if many roles exist
    return Object.values(roles)
      .sort((a, b) => b.Count - a.Count)
      .slice(0, 8);
  };

  // 5. Overtime Attrition Rate Analysis
  const getOvertimeData = () => {
    const ot = { Yes: { name: "Overtime", Total: 0, Leave: 0 }, No: { name: "No Overtime", Total: 0, Leave: 0 } };
    datasetPredictions.forEach((p) => {
      const overtime = String(p.Overtime || "No").toLowerCase() === "yes" ? "Yes" : "No";
      ot[overtime].Total += 1;
      const isLeave = p.Prediction === "Yes" || p.Prediction === "Leave";
      if (isLeave) ot[overtime].Leave += 1;
    });

    return Object.values(ot).map((o) => ({
      name: o.name,
      "Attrition Rate (%)": o.Total > 0 ? Number(((o.Leave / o.Total) * 100).toFixed(1)) : 0,
      Total: o.Total,
      Leave: o.Leave,
    }));
  };

  // 6. Monthly Income Analysis Calculation
  const getIncomeData = () => {
    const brackets = {
      "< $4k": { name: "< $4k", Stay: 0, Leave: 0 },
      "$4k-$8k": { name: "$4k-$8k", Stay: 0, Leave: 0 },
      "$8k-$12k": { name: "$8k-$12k", Stay: 0, Leave: 0 },
      "$12k-$16k": { name: "$12k-$16k", Stay: 0, Leave: 0 },
      "$16k+": { name: "$16k+", Stay: 0, Leave: 0 },
    };

    datasetPredictions.forEach((p) => {
      const income = p.Monthly_Income || p.MonthlyIncome || 5000;
      let bracket = "$4k-$8k";
      if (income < 4000) bracket = "< $4k";
      else if (income < 8000) bracket = "$4k-$8k";
      else if (income < 12000) bracket = "$8k-$12k";
      else if (income < 16000) bracket = "$12k-$16k";
      else bracket = "$16k+";

      const isLeave = p.Prediction === "Yes" || p.Prediction === "Leave";
      if (isLeave) brackets[bracket].Leave += 1;
      else brackets[bracket].Stay += 1;
    });

    return Object.values(brackets);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaChartBar className="text-blue-600" />
            Advanced HR Analytics
          </h1>
          <p className="text-gray-500 mt-2">
            In-depth statistical breakdowns of employee turnover metrics, demographic patterns, and financial factors.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Department-wise Attrition (Stacked Bar Chart) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between min-h-[380px]">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-lg text-sm"><FaUsers /></div>
              <h3 className="font-bold text-slate-800">Attrition Risk by Department</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getDeptData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="Stay" fill="#10B981" name="Stay (Low Risk)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Leave" fill="#EF4444" name="Leave (High Risk)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Gender Attrition Split (Pie Chart) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between min-h-[380px]">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-lg text-sm"><FaChartBar /></div>
              <h3 className="font-bold text-slate-800">Overall Turnover Risk Split</h3>
            </div>
            <div className="h-72 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getGenderData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getGenderData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Age Distribution (Area Chart) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between min-h-[380px]">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg text-sm"><FaUsers /></div>
              <h3 className="font-bold text-slate-800">Age Bracket Distribution</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getAgeData()}>
                  <defs>
                    <linearGradient id="colorStay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLeave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend iconType="circle" />
                  <Area type="monotone" dataKey="Stay" stroke="#10B981" fillOpacity={1} fill="url(#colorStay)" name="Stay" />
                  <Area type="monotone" dataKey="Leave" stroke="#EF4444" fillOpacity={1} fill="url(#colorLeave)" name="Leave" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Job Role Distribution (Horizontal Bar Chart) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between min-h-[380px]">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg text-sm"><FaBriefcase /></div>
              <h3 className="font-bold text-slate-800">Top Roles Staffing & Risk</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getRoleData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} width={130} />
                  <Tooltip />
                  <Legend iconType="circle" />
                  <Bar dataKey="Count" fill="#3B82F6" name="Total Staff" radius={[0, 4, 4, 0]} barSize={10} />
                  <Bar dataKey="Leave" fill="#EF4444" name="Leaving Risk" radius={[0, 4, 4, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. Overtime Analysis (Side-by-side Bar Chart) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between min-h-[380px]">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-amber-50 text-amber-600 p-2 rounded-lg text-sm"><FaUserClock /></div>
              <h3 className="font-bold text-slate-800">Impact of Overtime on Attrition</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getOvertimeData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis unit="%" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend iconType="circle" />
                  <Bar dataKey="Attrition Rate (%)" fill="#F59E0B" name="Attrition Rate (%)" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6. Monthly Income Analysis (Line / Area Chart) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between min-h-[380px]">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-green-50 text-green-600 p-2 rounded-lg text-sm"><FaMoneyBillWave /></div>
              <h3 className="font-bold text-slate-800">Monthly Income Bracket Impact</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getIncomeData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="Stay" fill="#10B981" name="Stay" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Leave" fill="#EF4444" name="Leave" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
