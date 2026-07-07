function SalaryInformation({ register, errors }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Salary Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Monthly Income */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Monthly Income
          </label>

          <input
            type="number"
            placeholder="Enter Monthly Income"
            {...register("Monthly_Income", {
              required: "Monthly Income is required",
              min: {
                value: 1000,
                message: "Income must be greater than 1000",
              },
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.Monthly_Income && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Monthly_Income.message}
            </p>
          )}
        </div>

        {/* Hourly Rate */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Hourly Rate
          </label>

          <input
            type="number"
            placeholder="Enter Hourly Rate"
            {...register("Hourly_Rate", {
              required: "Hourly Rate is required",
              min: {
                value: 1,
                message: "Hourly Rate must be greater than 0",
              },
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.Hourly_Rate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Hourly_Rate.message}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default SalaryInformation;