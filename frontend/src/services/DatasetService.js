import api from "./api";

export const getDatasetInfo = async () => {
  const response = await api.get("/dataset/info");
  return response.data;
};

export const getDatasetSummary = async () => {
  const response = await api.get("/dataset/summary");
  return response.data;
};

export const getDatasetFeatures = async () => {
  const response = await api.get("/dataset/features");
  return response.data;
};

export const getModelMetrics = async () => {
  const response = await api.get("/model/metrics");
  return response.data;
};