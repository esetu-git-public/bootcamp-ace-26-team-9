function JobInformation({ register, errors }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Job Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Department */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Department
          </label>

          <select
            {...register("Department", {
              required: "Department is required",
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
          </select>

          {errors.Department && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Department.message}
            </p>
          )}
        </div>

        {/* Job Role */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Job Role
          </label>

          <input
            type="text"
            placeholder="Software Engineer"
            {...register("Job_Role", {
              required: "Job Role is required",
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.Job_Role && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Job_Role.message}
            </p>
          )}
        </div>

        {/* Job Level */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Job Level
          </label>

          <input
            type="number"
            placeholder="Enter Job Level"
            {...register("Job_Level", {
              required: "Job Level is required",
              min: {
                value: 1,
                message: "Minimum Job Level is 1",
              },
              max: {
                value: 10,
                message: "Maximum Job Level is 10",
              },
            })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.Job_Level && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Job_Level.message}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default JobInformation;