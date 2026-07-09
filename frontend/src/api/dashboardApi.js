import api from "./axiosInstance";

// Get dataset information (rows, columns, column names)
export const getDatasetInfo = async () => {
  const response = await api.get("/dataset/info");
  return response.data;
};

// Get dataset summary statistics
export const getDatasetSummary = async () => {
  const response = await api.get("/dataset/summary");
  return response.data;
};

// Get prepared feature columns
export const getDatasetFeatures = async () => {
  const response = await api.get("/dataset/features");
  return response.data;
};

// Get target variable distribution (Attrition: Yes/No counts)
export const getTargetDistribution = async () => {
  const response = await api.get("/dataset/target-distribution");
  return response.data;
};

// Get dashboard KPI data (from dashboard_routes)
export const getDashboardData = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};
