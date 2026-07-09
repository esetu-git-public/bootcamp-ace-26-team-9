const PredictionResult = ({ result }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl mt-8 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Prediction Result
      </h2>

      <div className="space-y-4">

        <div>

          <h3 className="text-gray-500">
            Prediction
          </h3>

          <p
            className={`text-3xl font-bold ${
              result.prediction === "Likely to Leave"
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {result.prediction}
          </p>

        </div>

        <div>

          <h3 className="text-gray-500">
            Probability
          </h3>

          <p className="text-2xl font-bold">
            {result.probability}%
          </p>

        </div>

      </div>

    </div>
  );
};

export default PredictionResult;