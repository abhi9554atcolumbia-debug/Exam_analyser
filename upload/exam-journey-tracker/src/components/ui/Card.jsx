export default function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
