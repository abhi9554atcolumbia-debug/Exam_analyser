'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

const DEFAULT_COLORS = [
  '#059669', // emerald-600
  '#0891b2', // cyan-600
  '#d97706', // amber-600
  '#dc2626', // red-600
  '#7c3aed', // violet-600
  '#db2777', // pink-600
  '#2563eb', // blue-600 (ok in charts data)
  '#65a30d', // lime-600
];

interface DonutChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  nameKey: string;
  centerLabel?: string;
  centerValue?: string | number;
  height?: number;
  colors?: string[];
}

export function DonutChart({
  data,
  dataKey,
  nameKey,
  centerLabel,
  centerValue,
  height = 280,
  colors = DEFAULT_COLORS,
}: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={height * 0.25}
          outerRadius={height * 0.4}
          paddingAngle={2}
          cornerRadius={4}
          strokeWidth={0}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'hsl(var(--popover-foreground))',
          }}
        />
        {/* Center label rendered via absolute positioning */}
        {centerLabel && (
          <text
            x="50%"
            y={centerValue ? '46%' : '50%'}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-xs"
          >
            {centerLabel}
          </text>
        )}
        {centerValue !== undefined && (
          <text
            x="50%"
            y={centerLabel ? '56%' : '50%'}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-2xl font-bold"
          >
            {centerValue}
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}