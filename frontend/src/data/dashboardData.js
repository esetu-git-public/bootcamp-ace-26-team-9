const dashboardData = {
  stats: [
    {
      id: 1,
      title: "Total Employees",
      value: 1245,
      color: "bg-blue-100",
      icon: "users",
    },
    {
      id: 2,
      title: "Active Employees",
      value: 1050,
      color: "bg-green-100",
      icon: "active",
    },
    {
      id: 3,
      title: "Likely to Leave",
      value: 195,
      color: "bg-red-100",
      icon: "warning",
    },
    {
      id: 4,
      title: "Attrition Rate",
      value: "15.7%",
      color: "bg-purple-100",
      icon: "chart",
    },
  ],

  trend: [
    { month: "Jan", employees: 15 },
    { month: "Feb", employees: 18 },
    { month: "Mar", employees: 12 },
    { month: "Apr", employees: 22 },
    { month: "May", employees: 16 },
    { month: "Jun", employees: 28 },
    { month: "Jul", employees: 24 },
    { month: "Aug", employees: 20 },
    { month: "Sep", employees: 18 },
    { month: "Oct", employees: 26 },
    { month: "Nov", employees: 19 },
    { month: "Dec", employees: 30 },
  ],

  departments: [
    { name: "IT", value: 35 },
    { name: "Sales", value: 25 },
    { name: "HR", value: 15 },
    { name: "Finance", value: 10 },
    { name: "Marketing", value: 15 },
  ],

  recentPredictions: [
    {
      id: 1,
      employee: "John Smith",
      department: "Sales",
      probability: "91%",
      risk: "High",
      status: "Pending",
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      department: "HR",
      probability: "63%",
      risk: "Medium",
      status: "Reviewed",
    },
    {
      id: 3,
      employee: "Michael Brown",
      department: "IT",
      probability: "18%",
      risk: "Low",
      status: "Completed",
    },
    {
      id: 4,
      employee: "Emily Davis",
      department: "Finance",
      probability: "84%",
      risk: "High",
      status: "Pending",
    },
    {
      id: 5,
      employee: "David Wilson",
      department: "Marketing",
      probability: "40%",
      risk: "Medium",
      status: "Reviewed",
    },
  ],
};

export default dashboardData;