import api from "./axiosInstance";

// Get all reports
export const getReports = async () => {
  const response = await api.get("/reports");
  return response.data;
};

// Get attrition report summary
export const getAttritionReport = async () => {
  const response = await api.get("/reports/attrition");
  return response.data;
};
