import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

import {
  getCloudUsage,
  type CloudUsage,
} from "../../services/dashboardService";

export default function CloudUsageChart() {
  const [data, setData] = useState<CloudUsage[]>([]);

  useEffect(() => {
  const loadData = async () => {
    const response = await getCloudUsage();
    setData(response);
  };

  loadData();

  const interval = setInterval(loadData, 1000);

  return () => clearInterval(interval);
}, []);
  return (
    // ✅ HARD FIX CONTAINER (stable width in all layouts)
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        height: 320,

        // IMPORTANT: prevents flex collapse in MUI Grid/Card
        display: "block",
        position: "relative",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          width={500}   // fallback width (prevents collapse bugs)
          height={300}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="resource"
            tick={{ fontSize: 12 }}
            interval={0}
          />

          <YAxis tick={{ fontSize: 12 }} />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#2e7d32"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}