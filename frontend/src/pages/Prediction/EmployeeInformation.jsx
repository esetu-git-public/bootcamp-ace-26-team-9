function EmployeeInformation({ register, errors }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Employee Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Age */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Age
          </label>

          <input
            type="number"
            placeholder="Enter Age"
            {...register("Age", {
              required: "Age is required",
              min: {
                value: 18,
                message: "Minimum age is 18",
              },
              max: {
                value: 65,
                message: "Maximum age is 65",
              },
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.Age && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Age.message}
            </p>
          )}
        </div>

        {/* Gender */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Gender
          </label>

          <select
            {...register("Gender", {
              required: "Gender is required",
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {errors.Gender && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Gender.message}
            </p>
          )}
        </div>

        {/* Marital Status */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Marital Status
          </label>

          <select
            {...register("Marital_Status", {
              required: "Marital Status is required",
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
          </select>

          {errors.Marital_Status && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Marital_Status.message}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default EmployeeInformation;