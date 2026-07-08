import api from "./axiosInstance";

// Run single employee attrition prediction
export const predictEmployee = async (employeeData) => {
  const response = await api.post("/predict", employeeData);
  return response.data;
};

// Run batch CSV prediction
export const predictBatchCSV = async (formData) => {
  const response = await api.post("/predict/csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Get model performance metrics
export const getModelMetrics = async () => {
  const response = await api.get("/model/metrics");
  return response.data;
};

// Get all prediction history records
export const getPredictions = async () => {
  const response = await api.get("/predictions");
  return response.data;
};

// Get a single prediction by ID
export const getPredictionById = async (id) => {
  const response = await api.get(`/predictions/${id}`);
  return response.data;
};

// Delete a prediction record
export const deletePrediction = async (id) => {
  const response = await api.delete(`/predictions/${id}`);
  return response.data;
};

// Trigger model training
export const trainModel = async () => {
  const response = await api.post("/train");
  return response.data;
};
