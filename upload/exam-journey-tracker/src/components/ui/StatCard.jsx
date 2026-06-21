import Card from "./Card";

const ICON_COLORS = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  indigo: "bg-indigo-50 text-indigo-600",
  red: "bg-red-50 text-red-600",
};

export default function StatCard({ icon: Icon, label, value, change, trend, color = "blue" }) {
  const trendColor = trend === "down" ? "text-red-500" : "text-emerald-600";
  return (
    <Card className="p-4 flex-1 min-w-[160px]">
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${ICON_COLORS[color]}`}>
            <Icon size={18} />
          </div>
        )}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {change && <div className={`text-xs mt-1 font-medium ${trendColor}`}>{change}</div>}
    </Card>
  );
}
