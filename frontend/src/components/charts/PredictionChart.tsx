import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Safe", value: 82 },
  { name: "Low Risk", value: 10 },
  { name: "Medium Risk", value: 5 },
  { name: "High Risk", value: 3 },
];

const COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FFC107",
  "#F44336",
];

export default function PredictionChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={110}
          label
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}