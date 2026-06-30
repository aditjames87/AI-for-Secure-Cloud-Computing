import { Box, Grid, Paper, Typography } from "@mui/material";
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

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    };

    loadDashboard();
  }, []);

  const cards = dashboard
    ? [
        {
          title: "Active Servers",
          value: dashboard.active_servers,
        },
        {
          title: "Threats",
          value: dashboard.threats_detected,
        },
        {
          title: "CPU Usage",
          value: `${dashboard.cpu_usage}%`,
        },
        {
          title: "AI Accuracy",
          value: `${dashboard.prediction_accuracy}%`,
        },
      ]
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        AI for Secure Cloud Computing
      </Typography>

      <Typography
        component="p"
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Intelligent Cloud Security Monitoring Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <Typography variant="h6">{card.title}</Typography>

              <Typography
                variant="h3"
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                }}
              >
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: 320,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Threat Detection
            </Typography>

            <ThreatChart />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: 320,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Cloud Resource Usage
            </Typography>

            <CloudUsageChart />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              sx={{ mb: 2 }}
            >
              AI Prediction Distribution
            </Typography>

            <PredictionChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}