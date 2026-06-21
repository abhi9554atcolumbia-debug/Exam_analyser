'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';

interface SimpleBarChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  height?: number;
  colorPositive?: string;
  colorNegative?: string;
}

export function SimpleBarChart({
  data,
  dataKey,
  xKey,
  height = 280,
  colorPositive = '#059669',
  colorNegative = '#dc2626',
}: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-border"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'hsl(var(--popover-foreground))',
          }}
        />
        <ReferenceLine y={0} stroke="hsl(var(--border))" />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry, index) => {
            const value = Number(entry[dataKey]) || 0;
            return (
              <Cell
                key={`cell-${index}`}
                fill={value >= 0 ? colorPositive : colorNegative}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}