const PrimaryButton = ({
  title,
  onClick,
  loading = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:bg-gray-400"
    >
      {loading ? "Signing In..." : title}
    </button>
  );
};

export default PrimaryButton;