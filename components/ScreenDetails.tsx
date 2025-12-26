
import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, Sprout, Loader2, ArrowRight, Sparkles, Info, 
  Mountain, Droplets, Waves, RefreshCw, Layers, 
  Sun, ThermometerSnowflake, FlaskConical 
} from 'lucide-react';
import { CropDetails } from '../types';
import { predictCrop } from '../services/geminiService';

interface ScreenDetailsProps {
  onSubmit: (details: CropDetails) => void;
  onBack: () => void;
  isLoading: boolean;
  imageBase64: string | null;
}

const SOIL_TYPES = [
  { value: 'Loam', label: 'Loamy', description: 'Balanced mix, fertile.', icon: Sprout },
  { value: 'Clay', label: 'Clay', description: 'Heavy, holds water.', icon: Mountain },
  { value: 'Sandy', label: 'Sandy', description: 'Drains fast, light.', icon: Waves },
  { value: 'Silty', label: 'Silty', description: 'Fine, holds moisture.', icon: Droplets },
  { value: 'Peaty', label: 'Peaty', description: 'High organic matter.', icon: Layers },
  { value: 'Chalky', label: 'Chalky', description: 'Stony, alkaline.', icon: Info },
  { value: 'Alluvial', label: 'Alluvial', description: 'River basin deposits.', icon: Waves },
  { value: 'Black', label: 'Black/Regur', description: 'Volcanic, clay-rich.', icon: Mountain },
  { value: 'Red', label: 'Red/Yellow', description: 'Iron-rich, porous.', icon: Layers },
  { value: 'Laterite', label: 'Laterite', description: 'Tropical, weathered.', icon: Sun },
  { value: 'Arid', label: 'Arid/Desert', description: 'Low moisture, salt.', icon: ThermometerSnowflake },
  { value: 'Saline', label: 'Saline', description: 'High salt content.', icon: FlaskConical },
];

export const ScreenDetails: React.FC<ScreenDetailsProps> = ({ onSubmit, onBack, isLoading, imageBase64 }) => {
  const [formData, setFormData] = useState<CropDetails>({
    cropType: '',
    soilType: '',
    plantAge: '',
  });
  const [isPredictingCrop, setIsPredictingCrop] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const runPrediction = useCallback(async () => {
    if (imageBase64) {
      setIsPredictingCrop(true);
      try {
        const predicted = await predictCrop(imageBase64);
        if (predicted) {
          setFormData(prev => ({ ...prev, cropType: predicted }));
        }
      } catch (err) {
        console.error("Prediction failed", err);
      } finally {
        setIsPredictingCrop(false);
      }
    }
  }, [imageBase64]);

  useEffect(() => {
    if (imageBase64 && !formData.cropType) {
      runPrediction();
    }
  }, [imageBase64, runPrediction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
        setGeoLoading(false);
      },
      (error) => {
        console.error("Geo error:", error);
        alert("Unable to retrieve location. Please check permissions.");
        setGeoLoading(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cropType || !formData.soilType || !formData.plantAge) {
      alert("Please fill in all crop details.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="p-6 h-full flex flex-col animate-slide-in-right overflow-y-auto">
      <div className="mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1 font-bold text-sm transition-colors active:scale-95">
          &larr; Re-upload Image
        </button>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Farm Profile</h2>
        <p className="text-slate-500 font-medium">Context helps AI provide 99% accuracy.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 flex-1 pb-12">
        {/* Crop Type with Auto-Predict */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest">Crop Identification</label>
            <button 
              type="button"
              onClick={runPrediction}
              disabled={isPredictingCrop}
              className="text-emerald-600 hover:text-emerald-700 disabled:opacity-50 transition-all p-1 hover:bg-emerald-50 rounded-lg"
              title="Redetect Crop"
            >
              <RefreshCw size={14} className={isPredictingCrop ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'} />
            </button>
          </div>
          <div className="relative group">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors ${isPredictingCrop ? 'text-emerald-500' : 'text-slate-400'}`}>
              {isPredictingCrop ? <Loader2 size={18} className="animate-spin" /> : <Sprout size={18} />}
            </div>
            <input
              type="text"
              name="cropType"
              placeholder={isPredictingCrop ? "AI scanning pixels..." : "e.g. Tomato, Arabica Coffee"}
              value={formData.cropType}
              onChange={handleInputChange}
              className={`w-full pl-11 pr-4 py-4 rounded-2xl border-2 transition-all font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-300 ${
                isPredictingCrop 
                  ? 'border-emerald-300 bg-emerald-50/30 animate-pulse-glow' 
                  : formData.cropType 
                    ? 'border-emerald-500 bg-white ring-4 ring-emerald-50' 
                    : 'border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100'
              } outline-none`}
              required
            />
            {!isPredictingCrop && formData.cropType && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg animate-scale-up">
                <Sparkles size={10} />
                <span className="text-[9px] font-black uppercase tracking-widest">Detected</span>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Soil Selection */}
        <div>
          <div className="flex items-center gap-2 mb-4">
             <label className="block text-sm font-black text-slate-700 uppercase tracking-widest">Soil Composition</label>
             <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
            {SOIL_TYPES.map((soil, idx) => (
              <button
                key={soil.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, soilType: soil.value }))}
                className={`group p-4 rounded-2xl border-2 text-left transition-all flex flex-col items-center justify-center text-center relative animate-fade-in ${
                  formData.soilType === soil.value
                    ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-50 scale-[0.98]'
                    : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className={`p-2 rounded-xl mb-2 transition-transform group-hover:scale-110 ${formData.soilType === soil.value ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-400 border border-slate-100'}`}>
                  <soil.icon size={18} />
                </div>
                <span className={`text-[11px] font-black leading-none ${formData.soilType === soil.value ? 'text-emerald-900' : 'text-slate-600'}`}>
                  {soil.label}
                </span>
                <span className="text-[8px] text-slate-400 mt-1.5 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                  {soil.description}
                </span>
                {formData.soilType === soil.value && (
                  <div className="absolute top-2 right-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plant Age */}
        <div>
          <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">Growth Lifecycle</label>
          <div className="relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
               <Layers size={18} />
             </div>
             <input
              type="text"
              name="plantAge"
              placeholder="e.g. Vegetative stage, 45 days old"
              value={formData.plantAge}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition-all font-bold text-slate-800 placeholder:font-normal"
              required
            />
          </div>
        </div>

        {/* Location Section */}
        <div>
          <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">Local Micro-Climate</label>
          <button
            type="button"
            onClick={getGeolocation}
            className={`w-full p-5 rounded-2xl border-2 border-dashed transition-all active:scale-[0.99] group overflow-hidden relative ${
              formData.location
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {geoLoading && <div className="absolute inset-0 shimmer opacity-10" />}
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-3 rounded-2xl transition-transform group-hover:scale-105 ${formData.location ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                {geoLoading ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">
                  {formData.location ? 'Coordinates Locked' : 'Environmental GPS'}
                </p>
                <p className="text-[10px] font-bold opacity-70">
                  {formData.location
                    ? `${formData.location.latitude.toFixed(4)}, ${formData.location.longitude.toFixed(4)}`
                    : 'Analyze soil & weather by position'}
                </p>
              </div>
              {formData.location && (
                 <div className="bg-emerald-200/50 px-2 py-1 rounded text-[10px] font-black uppercase animate-scale-up">Active</div>
              )}
            </div>
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || isPredictingCrop}
            className="w-full py-6 bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white text-lg font-black rounded-[2rem] shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 active:scale-[0.98] group relative overflow-hidden"
          >
            {isLoading && <div className="absolute inset-0 shimmer opacity-20" />}
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span className="uppercase tracking-[0.2em] relative z-10">Synthesizing...</span>
              </>
            ) : (
              <>
                <span className="uppercase tracking-[0.2em] relative z-10">Start Diagnostics</span>
                <ArrowRight size={24} strokeWidth={3} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
