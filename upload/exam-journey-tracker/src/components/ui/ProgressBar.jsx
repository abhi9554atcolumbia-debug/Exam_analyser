export default function ProgressBar({ percent = 0, color = "bg-primary-600", trackColor = "bg-gray-100", height = "h-2" }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={`w-full ${trackColor} rounded-full ${height} overflow-hidden`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
