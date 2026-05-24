import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1.5">{label}</p>
      <p className="text-danger font-mono">Error rate: {payload[0]?.value}%</p>
    </div>
  );
};

export default function ErrorRateChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fill: "#52525b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#52525b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="errorRate" radius={[2, 2, 0, 0]} maxBarSize={12}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.errorRate > 5 ? "#ef4444" : entry.errorRate > 2 ? "#f59e0b" : "#3f3f46"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
