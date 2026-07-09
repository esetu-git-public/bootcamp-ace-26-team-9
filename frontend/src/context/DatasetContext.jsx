import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const DatasetContext = createContext();

export const DatasetProvider = ({ children }) => {
  const [datasetPredictions, setDatasetPredictions] = useState([]);
  const [datasetFile, setDatasetFile] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [loadingSystem, setLoadingSystem] = useState(true);
  const [errorSystem, setErrorSystem] = useState(null);

  const fetchSystemStats = async () => {
    setLoadingSystem(true);
    setErrorSystem(null);
    try {
      const response = await apiClient.get("/dashboard/stats");
      setSystemStats(response.data);
    } catch (err) {
      console.error("Error fetching dashboard statistics", err);
      setErrorSystem("Failed to load dashboard statistics from backend.");
    } finally {
      setLoadingSystem(false);
    }
  };

  useEffect(() => {
    fetchSystemStats();
  }, []);

  return (
    <DatasetContext.Provider
      value={{
        datasetPredictions,
        setDatasetPredictions,
        datasetFile,
        setDatasetFile,
        systemStats,
        setSystemStats,
        loadingSystem,
        errorSystem,
        refetchSystemStats: fetchSystemStats,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => useContext(DatasetContext);
