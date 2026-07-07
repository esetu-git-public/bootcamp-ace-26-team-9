function PerformanceInformation({ register, errors }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Performance Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Work Life Balance */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Work Life Balance
          </label>

          <select
            {...register("Work_Life_Balance", {
              required: "Work Life Balance is required",
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Excellent</option>
          </select>

          {errors.Work_Life_Balance && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Work_Life_Balance.message}
            </p>
          )}
        </div>

        {/* Job Satisfaction */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Job Satisfaction
          </label>

          <select
            {...register("Job_Satisfaction", {
              required: "Job Satisfaction is required",
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="1">1 - Low</option>
            <option value="2">2 - Medium</option>
            <option value="3">3 - High</option>
            <option value="4">4 - Very High</option>
          </select>

          {errors.Job_Satisfaction && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Job_Satisfaction.message}
            </p>
          )}
        </div>

        {/* Performance Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Performance Rating
          </label>

          <select
            {...register("Performance_Rating", {
              required: "Performance Rating is required",
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          {errors.Performance_Rating && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Performance_Rating.message}
            </p>
          )}
        </div>

        {/* Training Hours */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Training Hours Last Year
          </label>

          <input
            type="number"
            placeholder="Hours"
            {...register("Training_Hours_Last_Year", {
              required: "Training Hours are required",
              min: {
                value: 0,
                message: "Cannot be negative",
              },
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.Training_Hours_Last_Year && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Training_Hours_Last_Year.message}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default PerformanceInformation;