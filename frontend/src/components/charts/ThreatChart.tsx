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
        console.log("Threat history data:", response);
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="day" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="threats"
          stroke="#1976d2"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}