import React, { useState } from 'react';
import { MapPin, Sprout, Loader2, ArrowRight } from 'lucide-react';
import { CropDetails } from '../types';

interface ScreenDetailsProps {
  onSubmit: (details: CropDetails) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const ScreenDetails: React.FC<ScreenDetailsProps> = ({ onSubmit, onBack, isLoading }) => {
  const [formData, setFormData] = useState<CropDetails>({
    cropType: '',
    soilType: '',
    plantAge: '',
  });
  const [geoLoading, setGeoLoading] = useState(false);

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
    <div className="p-6 h-full flex flex-col animate-slide-in-right">
      <div className="mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 mb-2">
          &larr; Back to Image
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Crop Details</h2>
        <p className="text-slate-500">Help the AI provide better accuracy.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Crop Type</label>
          <input
            type="text"
            name="cropType"
            placeholder="e.g. Tomato, Wheat, Corn"
            value={formData.cropType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Soil Type</label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition bg-white"
            required
          >
            <option value="">Select Soil Type</option>
            <option value="Loam">Loam</option>
            <option value="Clay">Clay</option>
            <option value="Sandy">Sandy</option>
            <option value="Silt">Silt</option>
            <option value="Peat">Peat</option>
            <option value="Chalk">Chalk</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Plant Age</label>
          <input
            type="text"
            name="plantAge"
            placeholder="e.g. 2 weeks, Flowering stage"
            value={formData.plantAge}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location (Optional)</label>
          <button
            type="button"
            onClick={getGeolocation}
            className={`w-full px-4 py-3 rounded-xl border border-dashed flex items-center justify-center space-x-2 transition ${
              formData.location
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-300 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {geoLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <MapPin size={20} />
            )}
            <span>
              {formData.location
                ? `Lat: ${formData.location.latitude.toFixed(4)}, Long: ${formData.location.longitude.toFixed(4)}`
                : 'Auto-detect GPS Location'}
            </span>
          </button>
        </div>

        <div className="pt-4 mt-auto">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-emerald-600 disabled:bg-slate-400 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Get Recommendations</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
