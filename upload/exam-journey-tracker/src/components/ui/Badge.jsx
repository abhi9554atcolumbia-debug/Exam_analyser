const VARIANTS = {
  success: "bg-emerald-50 text-emerald-600",
  danger: "bg-red-50 text-red-500",
  warning: "bg-amber-50 text-amber-600",
  info: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  neutral: "bg-gray-100 text-gray-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

export default function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${VARIANTS[variant] || VARIANTS.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
