import { useEffect, useState } from "react";

import {
  fetchDashboardStats,
  fetchApis,
  fetchIncidents,
  fetchAnomalies,
} from "../services/api";


export default function useDashboardData() {

  const [stats, setStats] = useState(null);

  const [apis, setApis] = useState([]);

  const [incidents, setIncidents] = useState([]);

  const [anomalies, setAnomalies] = useState([]);

  const [loading, setLoading] = useState(true);


  const loadDashboard = async () => {

    try {

      const [
        statsData,
        apisData,
        incidentsData,
        anomaliesData
      ] = await Promise.all([
        fetchDashboardStats(),
        fetchApis(),
        fetchIncidents(),
        fetchAnomalies()
      ]);

      setStats(statsData);

      setApis(apisData);

      setIncidents(incidentsData);

      setAnomalies(anomaliesData);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    loadDashboard();

    const interval = setInterval(
      loadDashboard,
      5000
    );

    return () => clearInterval(interval);

  }, []);


  return {
    stats,
    apis,
    incidents,
    anomalies,
    loading,
    reload: loadDashboard
  };
}