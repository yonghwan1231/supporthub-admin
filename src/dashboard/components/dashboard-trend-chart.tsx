"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function DashboardTrendChart({
  data,
}: {
  data: $Dashboard.TrendPoint[];
}) {
  return (
    <ResponsiveContainer height="100%" width="100%">
      <ComposedChart data={data}>
        <CartesianGrid stroke="#e5e7eb" vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="label"
          tickLine={false}
          tickMargin={10}
        />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            border: "1px solid #d8dde8",
            borderRadius: 6,
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
          }}
        />
        <Bar
          dataKey="created"
          fill="#0f3f9f"
          name="신규 문의"
          radius={[4, 4, 0, 0]}
        />
        <Line
          dataKey="resolved"
          dot={{ r: 4 }}
          name="해결 처리"
          stroke="#059669"
          strokeWidth={3}
          type="monotone"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
