import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/ui/Input";

function Prediction() {
  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold text-slate-800">
        Employee Attrition Prediction
      </h1>

      <p className="text-gray-500 mt-2">
        Enter employee details to predict employee attrition.
      </p>

      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

        <h2 className="text-2xl font-semibold mb-8">
          Employee Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Age
            </label>

            <Input
              type="number"
              placeholder="Enter Age"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Gender
            </label>

            <select className="w-full rounded-xl border border-gray-300 px-4 py-3">

              <option>Male</option>

              <option>Female</option>

            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Marital Status
            </label>

            <select className="w-full rounded-xl border border-gray-300 px-4 py-3">

              <option>Single</option>

              <option>Married</option>

              <option>Divorced</option>

            </select>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Prediction;