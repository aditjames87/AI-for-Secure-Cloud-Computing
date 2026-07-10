import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { Paper, Typography } from "@mui/material";

import {
  getThreatSeverity,
  type ThreatSeverity,
} from "../../services/dashboardService";

const COLORS: Record<string, string> = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
  critical: "#7b1fa2",
};

export default function ThreatSeverityChart() {
  const [data, setData] = useState<ThreatSeverity[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getThreatSeverity();
        setData(response);
      } catch (error) {
        console.error("Failed to load threat severity:", error);
      }
    };

    loadData();

    const interval = setInterval(loadData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2 }}
      >
        Threat Severity
      </Typography>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="severity" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar dataKey="count">
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[entry.severity.toLowerCase()] || "#2196f3"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}