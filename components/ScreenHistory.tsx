import React from 'react';
import { HistoryItem } from '../types';
import { Calendar, ChevronRight } from 'lucide-react';

interface ScreenHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const ScreenHistory: React.FC<ScreenHistoryProps> = ({ history, onSelect }) => {
  return (
    <div className="p-6 pb-24 h-full animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Scan History</h2>
      
      {history.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No scans yet. Start by scanning a crop.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-all active:scale-[0.99] text-left group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border-2 border-white shadow-sm relative">
                {/* 
                  item.imageUrl contains the full Data URI (e.g. data:image/jpeg;base64,...) 
                  so we use it directly as the source.
                */}
                <img 
                    src={item.imageUrl} 
                    alt="Crop" 
                    className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 truncate pr-2 text-lg">{item.disease}</h3>
                </div>
                <p className="text-sm text-emerald-600 font-medium truncate">{item.cropDetails.cropType}</p>
                <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${
                        item.severity === 'high' ? 'bg-red-50 text-red-700 border-red-100' :
                        item.severity === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                        {item.severity}
                    </span>
                    <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};