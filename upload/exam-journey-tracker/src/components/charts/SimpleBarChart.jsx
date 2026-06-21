import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

export default function SimpleBarChart({ data, dataKey = "gap", xKey = "exam", height = 220, colorPositive = "#34d399", colorNegative = "#f87171" }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <ReferenceLine y={0} stroke="#cbd5e1" />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
        <Bar dataKey={dataKey} radius={[4, 4, 4, 4]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry[dataKey] >= 0 ? colorPositive : colorNegative} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
