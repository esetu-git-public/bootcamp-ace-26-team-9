function ExperienceInformation({ register, errors }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Experience Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Years at Company */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Years at Company
          </label>

          <input
            type="number"
            placeholder="Enter Years"
            {...register("Years_at_Company", {
              required: "Years at Company is required",
              min: {
                value: 0,
                message: "Cannot be negative",
              },
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.Years_at_Company && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Years_at_Company.message}
            </p>
          )}
        </div>

        {/* Years in Current Role */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Years in Current Role
          </label>

          <input
            type="number"
            placeholder="Enter Years"
            {...register("Years_in_Current_Role", {
              required: "Years in Current Role is required",
              min: {
                value: 0,
                message: "Cannot be negative",
              },
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.Years_in_Current_Role && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Years_in_Current_Role.message}
            </p>
          )}
        </div>

        {/* Years Since Last Promotion */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Years Since Last Promotion
          </label>

          <input
            type="number"
            placeholder="Enter Years"
            {...register("Years_Since_Last_Promotion", {
              required: "Years Since Last Promotion is required",
              min: {
                value: 0,
                message: "Cannot be negative",
              },
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.Years_Since_Last_Promotion && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Years_Since_Last_Promotion.message}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default ExperienceInformation;