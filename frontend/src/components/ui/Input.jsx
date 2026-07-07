import React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;