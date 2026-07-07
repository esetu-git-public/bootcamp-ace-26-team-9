function Button({
  children,
  className = "",
  loading = false,
  ...props
}) {
  return (
    <button
      disabled={loading}
      className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}

      {loading ? "Signing In..." : children}
    </button>
  );
}

export default Button;