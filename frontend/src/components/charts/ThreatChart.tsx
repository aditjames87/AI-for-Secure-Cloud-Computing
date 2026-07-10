import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";

import {
  getThreatHistory,
  type ThreatHistory,
} from "../../services/dashboardService";

export default function ThreatChart() {
  const [data, setData] = useState<ThreatHistory[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getThreatHistory();
        setData(response);
      } catch (error) {
        console.error("Failed to load threat history:", error);
      }
    };

    // Initial load
    loadData();

    // Refresh every second
    const interval = setInterval(loadData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="day" />

        <YAxis allowDecimals={false} />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="threats"
          stroke="#1976d2"
          strokeWidth={3}
          dot={{ r: 5 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}