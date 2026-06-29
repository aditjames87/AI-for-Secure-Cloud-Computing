import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { resource: "CPU", value: 54 },
  { resource: "Memory", value: 68 },
  { resource: "Storage", value: 42 },
  { resource: "Network", value: 76 },
];

export default function CloudUsageChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="resource" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="#2e7d32"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}