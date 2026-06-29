import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", threats: 8 },
  { day: "Tue", threats: 12 },
  { day: "Wed", threats: 10 },
  { day: "Thu", threats: 15 },
  { day: "Fri", threats: 11 },
  { day: "Sat", threats: 18 },
  { day: "Sun", threats: 14 },
];

export default function ThreatChart() {
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