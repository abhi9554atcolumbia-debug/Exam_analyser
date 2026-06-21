'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Dot,
} from 'recharts';

interface TrendLineChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}

export function TrendLineChart({
  data,
  dataKey,
  xKey,
  color = '#059669',
  height = 280,
}: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
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
          domain={[0, 100]}
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
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          dot={(props: Record<string, unknown>) => {
            const { cx, cy, payload } = props as {
              cx: number;
              cy: number;
              payload: Record<string, unknown>;
            };
            return (
              <Dot
                key={`${xKey}-${payload[xKey]}`}
                cx={cx}
                cy={cy}
                r={4}
                fill={color}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            );
          }}
          activeDot={{
            r: 6,
            fill: color,
            stroke: 'hsl(var(--background))',
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}