
import React, { useState, useMemo } from 'react';
import { HistoryItem } from '../types';
import { 
  Calendar, ChevronRight, X, Info, MapPin, Sprout, ArrowRight, 
  Filter, Search, CalendarDays, RotateCcw, ChevronDown, SlidersHorizontal,
  Clock, Check
} from 'lucide-react';

interface ScreenHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

type DatePreset = 'all' | 'today' | '7d' | '30d' | 'custom';

/**
 * Lazy Loading Thumbnail with smooth entry
 */
const LazyThumbnail: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-full relative bg-slate-50 flex items-center justify-center overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10 transition-opacity duration-500">
          <div className="p-2 bg-white rounded-full shadow-sm animate-pulse">
            <Sprout size={20} className="text-emerald-300" />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
        }`}
      />
    </div>
  );
};

export const ScreenHistory: React.FC<ScreenHistoryProps> = ({ history, onSelect }) => {
  const [viewingItem, setViewingItem] = useState<HistoryItem | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States
  const [filterCrop, setFilterCrop] = useState<string>('All');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Extract unique crop types from history
  const uniqueCrops = useMemo(() => {
    const crops = new Set(history.map(item => item.cropDetails.cropType));
    return ['All', ...Array.from(crops)].sort();
  }, [history]);

  // Apply filters
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      // Crop Match
      const matchesCrop = filterCrop === 'All' || item.cropDetails.cropType === filterCrop;
      
      // Date Processing
      const itemDate = new Date(item.timestamp);
      itemDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let matchesDate = true;

      if (datePreset === 'today') {
        matchesDate = itemDate.getTime() === today.getTime();
      } else if (datePreset === '7d') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        matchesDate = itemDate >= weekAgo;
      } else if (datePreset === '30d') {
        const monthAgo = new Date();
        monthAgo.setDate(today.getDate() - 30);
        matchesDate = itemDate >= monthAgo;
      } else if (datePreset === 'custom') {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && itemDate >= start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && itemDate <= end;
        }
      }
      
      return matchesCrop && matchesDate;
    });
  }, [history, filterCrop, datePreset, startDate, endDate]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCrop !== 'All') count++;
    if (datePreset !== 'all') count++;
    if (datePreset === 'custom' && (startDate || endDate)) count++;
    return count;
  }, [filterCrop, datePreset, startDate, endDate]);

  const resetFilters = () => {
    setFilterCrop('All');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
  };

  const PresetChip = ({ label, value, icon: Icon }: { label: string; value: DatePreset; icon?: any }) => (
    <button
      onClick={() => setDatePreset(value)}
      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border whitespace-nowrap ${
        datePreset === value 
          ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100' 
          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
      }`}
    >
      {Icon && <Icon size={12} />}
      {label}
      {datePreset === value && <Check size={10} strokeWidth={4} />}
    </button>
  );

  return (
    <>
      <div className="p-6 pb-24 h-full animate-fade-in overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Scan History</h2>
            <p className="text-sm text-slate-500 font-medium">Your biometric archives</p>
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-3 rounded-2xl transition-all relative active:scale-95 ${
              isFilterOpen || activeFilterCount > 0 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-white text-slate-400 border border-slate-200'
            }`}
          >
            <SlidersHorizontal size={20} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 border-2 border-white text-[10px] font-black text-white flex items-center justify-center shadow-sm">
                  {activeFilterCount}
                </span>
              </span>
            )}
          </button>
        </div>

        {/* Quick Presets Row */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 mb-2">
          <PresetChip label="All Time" value="all" />
          <PresetChip label="Today" value="today" icon={Clock} />
          <PresetChip label="7 Days" value="7d" icon={Calendar} />
          <PresetChip label="30 Days" value="30d" icon={CalendarDays} />
          <PresetChip label="Custom" value="custom" icon={SlidersHorizontal} />
        </div>

        {/* Expandable Filter Panel */}
        {isFilterOpen && (
          <div className="mb-8 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 space-y-6 animate-slide-down">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Diagnostic Filters</span>
              {activeFilterCount > 0 && (
                <button 
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-rose-500 font-black text-[9px] uppercase tracking-widest hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                >
                  <RotateCcw size={10} />
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Crop Type Select */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Filter by Crop Variety</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Sprout size={16} />
                  </div>
                  <select
                    value={filterCrop}
                    onChange={(e) => setFilterCrop(e.target.value)}
                    className="w-full pl-11 pr-8 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500/20 appearance-none transition-all"
                  >
                    {uniqueCrops.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Custom Date Range (Only visible if 'custom' is selected) */}
              <div className={`space-y-4 transition-all duration-300 ${datePreset === 'custom' ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                <div className="flex items-center gap-2 mb-2">
                   <div className="h-px flex-1 bg-slate-100" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Custom Range</span>
                   <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">From</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <CalendarDays size={14} />
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setDatePreset('custom');
                        }}
                        className="w-full pl-9 pr-2 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">To</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <CalendarDays size={14} />
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setDatePreset('custom');
                        }}
                        className="w-full pl-9 pr-2 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
                {datePreset !== 'custom' && (
                  <button 
                    onClick={() => setDatePreset('custom')}
                    className="w-full py-2 text-[10px] font-black text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors uppercase tracking-widest"
                  >
                    Enable Custom Range
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-scale-up">
              <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner border border-slate-200">
                {activeFilterCount > 0 ? <Search size={40} className="text-slate-300" /> : <Calendar size={40} className="text-slate-300" />}
              </div>
              <p className="text-slate-900 font-black text-xl">No scans found.</p>
              <p className="text-slate-400 text-sm mt-2 font-medium max-w-[220px] leading-relaxed">
                {activeFilterCount > 0 
                  ? "Adjust your filters or date range to find specific biometric records." 
                  : "Start scanning your crops to populate your diagnostic history."}
              </p>
              {activeFilterCount > 0 && (
                <button 
                  onClick={resetFilters}
                  className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Reset All Filters
                </button>
              )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {activeFilterCount > 0 ? `Matched ${filteredHistory.length} records` : `Recent ${filteredHistory.length} Diagnostics`}
              </span>
            </div>
            {filteredHistory.map((item, idx) => (
              <div
                key={item.id}
                className="w-full group bg-white p-4 rounded-[2.5rem] border border-slate-200/60 flex items-center space-x-5 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-emerald-100 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div 
                  className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-50 shrink-0 border border-slate-100 relative cursor-pointer"
                  onClick={() => setViewingItem(item)}
                >
                  <LazyThumbnail src={item.imageUrl} alt={item.cropDetails.cropType} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <h3 className="font-black text-slate-800 truncate text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                      {item.disease}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="p-1 bg-emerald-50 text-emerald-600 rounded-md">
                      <Sprout size={10} />
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide truncate">
                      {item.cropDetails.cropType}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border ${
                          item.severity === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                          item.severity === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          'bg-yellow-50 text-yellow-600 border-yellow-100'
                      }`}>
                          {item.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-black tabular-nums">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelect(item)}
                      className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      <ArrowRight size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal View */}
      {viewingItem && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-6 animate-fade-in"
          onClick={() => setViewingItem(null)}
        >
          <div 
            className="bg-white rounded-[3rem] overflow-hidden w-full max-w-sm shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full">
              <img 
                src={viewingItem.imageUrl} 
                alt="Diagnosis preview" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setViewingItem(null)}
                className="absolute top-6 right-6 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-lg border border-white/20 transition-all"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                 <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-1 block">Full Resolution Scan</span>
                 <h4 className="text-xl font-black text-white leading-tight">{viewingItem.disease}</h4>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Crop</p>
                  <p className="text-sm font-black text-slate-800">{viewingItem.cropDetails.cropType}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Age</p>
                  <p className="text-sm font-black text-slate-800">{viewingItem.cropDetails.plantAge}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelect(viewingItem);
                  setViewingItem(null);
                }}
                className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <span>Analysis Summary</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
