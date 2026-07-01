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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();

        console.log("Dashboard Response:", data);
        setDashboard(data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const cards = [
    {
      title: "Active Servers",
      value: dashboard?.active_servers ?? 0,
    },
    {
      title: "Threats Detected",
      value: dashboard?.threats_detected ?? 0,
    },
    {
      title: "CPU Usage",
      value: `${dashboard?.cpu_usage ?? 0}%`,
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
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                height: 170,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minWidth: 0,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {card.title}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

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
        <Grid item xs={12}>
          <Paper sx={{ p: 3, minWidth: 0, overflow: "hidden" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              AI Prediction Distribution
            </Typography>

            <PredictionChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}