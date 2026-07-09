import { Alert, Box, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import ThreatChart from "../../components/charts/ThreatChart";
import CloudUsageChart from "../../components/charts/CloudUsageChart";
import PredictionChart from "../../components/charts/PredictionChart";

import {
  getDashboardData,
  type DashboardData,
} from "../../services/dashboardService";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");


  useEffect(() => {
  const loadDashboard = async () => {
    try {
      const data = await getDashboardData();
      setDashboard(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
      setDashboard(null);
      if (!dashboard) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography>Loading dashboard...</Typography>
    </Box>
  );
}
    }
  };
  // Initial load
  loadDashboard();

  // Refresh every second
  const interval = setInterval(loadDashboard, 1000);

  return () => clearInterval(interval);
}, []);


  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const cards = [
  {
    title: "Total Servers",
    value: dashboard?.total_servers ?? 0,
  },
  {
    title: "Active Servers",
    value: dashboard?.active_servers ?? 0,
  },
  {
    title: "Offline Servers",
    value: dashboard?.offline_servers ?? 0,
  },
  {
    title: "Threats Detected",
    value: dashboard?.total_threats ?? 0,
  },
  {
    title: "High Risk Alerts",
    value: dashboard?.high_risk_alerts ?? 0,
  },
  {
    title: "CPU Usage",
    value: `${dashboard?.cpu_usage ?? 0}%`,
  },
  {
    title: "Memory Usage",
    value: `${dashboard?.memory_usage ?? 0}%`,
  },
  {
    title: "Storage Usage",
    value: `${dashboard?.storage_usage ?? 0}%`,
  },
  {
    title: "Network Usage",
    value: `${dashboard?.network_usage ?? 0}%`,
  },
  {
    title: "AI Accuracy",
    value: `${dashboard?.prediction_accuracy ?? 0}%`,
  },
];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        AI Secure Cloud Dashboard
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Intelligent Cloud Security Monitoring Dashboard
      </Typography>

      
      {/* ================= KPI CARDS ================= */}
         

      <Box sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
      lg: "repeat(5, 1fr)",
    },
    gap: 3,
    mb: 3,
  }}
>
  {cards.map((card) => (
    <Paper
      key={card.title}
      elevation={3}
      sx={{
        borderRadius: 3,
        p: 2.5,
        height: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        {card.title}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          mt: 1,
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        {card.value}
      </Typography>
    </Paper>
  ))}
</Box>

      {/* ================= CHART ROW 1 ================= */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350, minWidth: 0, overflow: "hidden" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Threat Detection
            </Typography>
            <ThreatChart />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350, minWidth: 0, overflow: "hidden" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Cloud Resource Usage
            </Typography>
            <CloudUsageChart />
          </Paper>
        </Grid>
      </Grid>

      {/* ================= CHART ROW 2 ================= */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
  <Grid item xs={12} md={6}>
    <Paper
      sx={{
        p: 3,
        height: 350,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        AI Prediction Distribution
      </Typography>

      <PredictionChart />
    </Paper>
  </Grid>

  <Grid item xs={12} md={6}>
    <Paper
      sx={{
        p: 3,
        height: 350,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Threat Severity
      </Typography>

      {/* Add another chart here later */}
    </Paper>
  </Grid>
</Grid>
    </Box>
  );
}