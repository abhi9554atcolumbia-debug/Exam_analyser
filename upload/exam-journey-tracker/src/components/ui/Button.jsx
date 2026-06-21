export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-150 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    outline: "bg-transparent text-primary-600 border border-primary-200 hover:bg-primary-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-sm px-5 py-2.5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
