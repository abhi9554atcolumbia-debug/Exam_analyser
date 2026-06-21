import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function DonutChart({ data, dataKey = "value", nameKey = "category", centerLabel, centerValue, height = 220 }) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && <span className="text-lg font-bold text-gray-900">{centerValue}</span>}
          {centerLabel && <span className="text-[11px] text-gray-500 text-center px-6">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
