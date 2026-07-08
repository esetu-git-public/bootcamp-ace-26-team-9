import { FaEnvelope, FaLock } from "react-icons/fa";

const InputField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="mb-5">
      <label className="block mb-2 font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">

        {type === "email" ? (
          <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
        ) : (
          <FaLock className="absolute left-4 top-4 text-gray-400" />
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </div>
  );
};

export default InputField;