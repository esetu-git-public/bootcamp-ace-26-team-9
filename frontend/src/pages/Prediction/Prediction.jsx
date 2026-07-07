import { useForm } from "react-hook-form";
import DashboardLayout from "../../components/layout/DashboardLayout";

import EmployeeInformation from "./EmployeeInformation";
import JobInformation from "./JobInformation";
import SalaryInformation from "./SalaryInformation";
import ExperienceInformation from "./ExperienceInformation";
import PerformanceInformation from "./PerformanceInformation";
import AdditionalInformation from "./AdditionalInformation";
import PredictButton from "./PredictButton";

function Prediction() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-slate-800">
          Employee Attrition Prediction
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Fill in employee information to predict attrition.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >

          <EmployeeInformation
            register={register}
            errors={errors}
          />

          <JobInformation
            register={register}
            errors={errors}
          />

          <SalaryInformation
            register={register}
            errors={errors}
          />

          <ExperienceInformation
            register={register}
            errors={errors}
          />

          <PerformanceInformation
            register={register}
            errors={errors}
          />

          <AdditionalInformation
            register={register}
            errors={errors}
          />

          <PredictButton />

        </form>

      </div>
    </DashboardLayout>
  );
}

export default Prediction;