import React from 'react';
import { AnalysisResult } from '../types';
import { Droplets, AlertTriangle, ShieldCheck, Bug, Activity, Sprout, Leaf, FlaskConical } from 'lucide-react';

interface ScreenDashboardProps {
  result: AnalysisResult | null;
  onNewScan: () => void;
}

export const ScreenDashboard: React.FC<ScreenDashboardProps> = ({ result, onNewScan }) => {
  if (!result) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const isHealthy = result.disease.toLowerCase().includes('healthy');

  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Analysis Report</h2>
          <p className="text-slate-500 text-sm">{new Date().toLocaleDateString()}</p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase rounded-full">
          {result.confidence} Confidence
        </span>
      </div>

      {/* Disease Card */}
      <div className={`p-5 rounded-2xl border-l-4 shadow-sm ${isHealthy ? 'bg-green-50 border-green-500' : 'bg-white border-red-500'}`}>
        <div className="flex items-center space-x-3 mb-2">
          {isHealthy ? <ShieldCheck className="text-green-600" /> : <Bug className="text-red-500" />}
          <h3 className="text-lg font-bold text-slate-800">{result.disease}</h3>
        </div>
        {!isHealthy && (
           <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(result.severity)}`}>
             Severity: {result.severity.toUpperCase()}
           </div>
        )}
      </div>

      {/* Action Plan */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700 flex items-center space-x-2">
            <Activity size={18} />
            <span>Recommended Treatment</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-2 mb-1 text-blue-700">
                    <Droplets size={16} />
                    <span className="text-xs font-bold uppercase">Water</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">{result.recommended_water_liters}</p>
             </div>
             <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center space-x-2 mb-1 text-amber-700">
                    <Sprout size={16} />
                    <span className="text-xs font-bold uppercase">Fertilizer</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">{result.recommended_fertilizer}</p>
             </div>
        </div>
        
        {/* Solution Options */}
        {!isHealthy && (
          <div className="grid grid-cols-1 gap-4">
            {/* Organic Solution */}
            {result.organic_solution && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                   <Leaf size={64} />
                </div>
                <div className="flex items-center space-x-2 mb-2 text-green-700 relative z-10">
                  <Leaf size={18} />
                  <span className="text-xs font-bold uppercase">Organic Solution & Cost</span>
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed relative z-10">{result.organic_solution}</p>
              </div>
            )}

            {/* Inorganic Solution */}
            {result.inorganic_solution && (
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                   <FlaskConical size={64} />
                </div>
                <div className="flex items-center space-x-2 mb-2 text-slate-700 relative z-10">
                  <FlaskConical size={18} />
                  <span className="text-xs font-bold uppercase">Chemical Solution & Cost</span>
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed relative z-10">{result.inorganic_solution}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Fallback Pesticide display if explicit solutions aren't available */}
        {!result.organic_solution && !result.inorganic_solution && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2 mb-2 text-slate-700">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase">Pesticide</span>
              </div>
               <p className="text-sm font-semibold text-slate-700">{result.recommended_pesticide}</p>
          </div>
        )}

        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100">
            <h4 className="font-medium text-slate-800 mb-2">General Steps to Take:</h4>
            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{result.treatment_instructions}</p>
        </div>
      </div>

      {/* Warning Section */}
      <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start space-x-3">
        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
        <div>
            <h4 className="text-sm font-bold text-red-700">Safety Warning</h4>
            <p className="text-xs text-red-600 mt-1">{result.overuse_warning}</p>
        </div>
      </div>

      <button
        onClick={onNewScan}
        className="w-full py-3 bg-slate-900 text-white font-medium rounded-xl shadow hover:bg-slate-800 transition"
      >
        Start New Scan
      </button>
    </div>
  );
};