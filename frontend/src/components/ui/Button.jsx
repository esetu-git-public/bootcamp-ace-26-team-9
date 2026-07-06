function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;