function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition ${className}`}
      {...props}
    />
  );
}

export default Input;