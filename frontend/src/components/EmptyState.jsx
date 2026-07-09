import { Link } from "react-router-dom";
import { FaDatabase } from "react-icons/fa";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-md border border-gray-100 max-w-lg mx-auto mt-20 text-center animate-fade-in">
      <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
        <FaDatabase size={40} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">No Dataset Uploaded</h2>
      <p className="text-gray-500 mb-8 leading-relaxed">
        No dataset uploaded. Please upload a CSV dataset to continue.
      </p>
      <Link
        to="/upload-dataset"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2"
      >
        Go to Upload Page
      </Link>
    </div>
  );
};

export default EmptyState;
