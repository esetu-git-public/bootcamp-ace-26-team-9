function PredictButton() {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
      >
        Predict Attrition
      </button>
    </div>
  );
}

export default PredictButton;