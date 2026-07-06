import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sparkles, ArrowRight, RotateCcw, AlertCircle, ShieldAlert, CheckCircle2, UserCheck, Briefcase, HeartHandshake } from 'lucide-react';
import { predictAttrition } from '../services/api';

export default function PredictionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      Age: 32,
      Gender: 'Male',
      Department: 'Sales',
      JobRole: 'Sales Executive',
      MonthlyIncome: 5200,
      YearsAtCompany: 3,
      DistanceFromHome: 12,
      OverTime: 'Yes',
      JobSatisfaction: 2,
      WorkLifeBalance: 2,
      BusinessTravel: 'Travel_Frequently',
      Education: 3,
      EnvironmentSatisfaction: 2,
      RelationshipSatisfaction: 3,
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Format numeric fields
      const formattedData = {
        ...data,
        Age: Number(data.Age),
        MonthlyIncome: Number(data.MonthlyIncome),
        YearsAtCompany: Number(data.YearsAtCompany),
        DistanceFromHome: Number(data.DistanceFromHome),
        JobSatisfaction: Number(data.JobSatisfaction),
        WorkLifeBalance: Number(data.WorkLifeBalance),
        Education: Number(data.Education),
        EnvironmentSatisfaction: Number(data.EnvironmentSatisfaction),
        RelationshipSatisfaction: Number(data.RelationshipSatisfaction),
      };

      const result = await predictAttrition(formattedData);
      navigate('/result', { state: { result, inputData: formattedData } });
    } catch (err) {
      setError(err.message || 'Failed to generate prediction. Please ensure ML model is trained and API is online.');
    } finally {
      setLoading(false);
    }
  };

  const loadHighRiskSample = () => {
    setValue('Age', 26);
    setValue('Gender', 'Male');
    setValue('Department', 'Sales');
    setValue('JobRole', 'Sales Representative');
    setValue('MonthlyIncome', 2400);
    setValue('YearsAtCompany', 1);
    setValue('DistanceFromHome', 24);
    setValue('OverTime', 'Yes');
    setValue('JobSatisfaction', 1);
    setValue('WorkLifeBalance', 1);
    setValue('BusinessTravel', 'Travel_Frequently');
    setValue('Education', 2);
    setValue('EnvironmentSatisfaction', 1);
    setValue('RelationshipSatisfaction', 2);
  };

  const loadStableSample = () => {
    setValue('Age', 42);
    setValue('Gender', 'Female');
    setValue('Department', 'Research & Development');
    setValue('JobRole', 'Research Director');
    setValue('MonthlyIncome', 14500);
    setValue('YearsAtCompany', 12);
    setValue('DistanceFromHome', 4);
    setValue('OverTime', 'No');
    setValue('JobSatisfaction', 4);
    setValue('WorkLifeBalance', 4);
    setValue('BusinessTravel', 'Travel_Rarely');
    setValue('Education', 4);
    setValue('EnvironmentSatisfaction', 4);
    setValue('RelationshipSatisfaction', 4);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header & Quick Profiles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-hr-900 to-hr-800 text-white p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 bg-hr-700/50 px-3 py-1 rounded-full text-xs font-semibold text-hr-200 mb-2 border border-hr-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Inference Engine v1.0</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Employee Attrition Prediction Form</h1>
          <p className="text-sm text-hr-100 mt-1">Enter 14 employee attributes to calculate real-time turnover probability and AI retention strategies.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadHighRiskSample}
            className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Load High-Risk Sample</span>
          </button>
          <button
            type="button"
            onClick={loadStableSample}
            className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load Stable Sample</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Prediction Error</h4>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Demographics & Personal Info */}
        <div className="card-modern">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-6">
            <UserCheck className="w-5 h-5 text-hr-600" />
            <h3 className="text-lg font-bold text-slate-800">1. Demographics & Commute</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label-field">Age (Years)</label>
              <input
                type="number"
                {...register('Age', { required: true, min: 18, max: 65 })}
                className="input-field"
              />
              {errors.Age && <span className="text-xs text-rose-500">Must be between 18 and 65</span>}
            </div>

            <div>
              <label className="label-field">Gender</label>
              <select {...register('Gender')} className="input-field">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="label-field">Distance From Home (Miles)</label>
              <input
                type="number"
                {...register('DistanceFromHome', { required: true, min: 1, max: 50 })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Job Role & Compensation */}
        <div className="card-modern">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-6">
            <Briefcase className="w-5 h-5 text-hr-600" />
            <h3 className="text-lg font-bold text-slate-800">2. Job Role & Compensation</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label-field">Department</label>
              <select {...register('Department')} className="input-field">
                <option value="Sales">Sales</option>
                <option value="Research & Development">Research & Development</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="label-field">Job Role</label>
              <select {...register('JobRole')} className="input-field">
                <option value="Sales Executive">Sales Executive</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Research Scientist">Research Scientist</option>
                <option value="Laboratory Technician">Laboratory Technician</option>
                <option value="Manufacturing Director">Manufacturing Director</option>
                <option value="Healthcare Representative">Healthcare Representative</option>
                <option value="Research Director">Research Director</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="label-field">Monthly Income ($ USD)</label>
              <input
                type="number"
                {...register('MonthlyIncome', { required: true, min: 1000 })}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field">Years At Company</label>
              <input
                type="number"
                {...register('YearsAtCompany', { required: true, min: 0 })}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field">Overtime Required?</label>
              <select {...register('OverTime')} className="input-field">
                <option value="Yes">Yes (Overtime)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="label-field">Business Travel</label>
              <select {...register('BusinessTravel')} className="input-field">
                <option value="Travel_Rarely">Travel Rarely</option>
                <option value="Travel_Frequently">Travel Frequently</option>
                <option value="Non-Travel">Non-Travel</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Experience & Satisfaction Metrics */}
        <div className="card-modern">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-6">
            <HeartHandshake className="w-5 h-5 text-hr-600" />
            <h3 className="text-lg font-bold text-slate-800">3. Satisfaction & Education Metrics (1 to 4/5 Scale)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="label-field">Job Satisfaction</label>
              <select {...register('JobSatisfaction')} className="input-field">
                <option value={4}>4 - Very High</option>
                <option value={3}>3 - High</option>
                <option value={2}>2 - Medium</option>
                <option value={1}>1 - Low (Dissatisfied)</option>
              </select>
            </div>

            <div>
              <label className="label-field">Work-Life Balance</label>
              <select {...register('WorkLifeBalance')} className="input-field">
                <option value={4}>4 - Best Balance</option>
                <option value={3}>3 - Good Balance</option>
                <option value={2}>2 - Moderate</option>
                <option value={1}>1 - Bad Balance</option>
              </select>
            </div>

            <div>
              <label className="label-field">Environment Satisfaction</label>
              <select {...register('EnvironmentSatisfaction')} className="input-field">
                <option value={4}>4 - Very High</option>
                <option value={3}>3 - High</option>
                <option value={2}>2 - Medium</option>
                <option value={1}>1 - Low</option>
              </select>
            </div>

            <div>
              <label className="label-field">Relationship Satisfaction</label>
              <select {...register('RelationshipSatisfaction')} className="input-field">
                <option value={4}>4 - Very High</option>
                <option value={3}>3 - High</option>
                <option value={2}>2 - Medium</option>
                <option value={1}>1 - Low</option>
              </select>
            </div>

            <div>
              <label className="label-field">Education Level</label>
              <select {...register('Education')} className="input-field">
                <option value={3}>3 - Bachelor Degree</option>
                <option value={4}>4 - Master Degree</option>
                <option value={5}>5 - Doctorate</option>
                <option value={2}>2 - College Diploma</option>
                <option value={1}>1 - Below College</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-secondary space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 px-8 text-base shadow-lg shadow-hr-600/30 flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Run AI Attrition Prediction</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
