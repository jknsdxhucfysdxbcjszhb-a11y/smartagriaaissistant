
import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { 
  Droplets, AlertTriangle, ShieldCheck, Bug, Activity, 
  Sprout, Leaf, FlaskConical, CheckCircle2, 
  Target, ScanSearch, Layers, 
  ChevronRight, Search,
  Banknote, Waves, Microscope, Cherry,
  Grid3X3, Eye, Zap, Thermometer, ShieldAlert,
  ChevronDown, ChevronUp, Beaker, ClipboardCheck,
  Info, Sparkles, Scissors, Skull, CloudRain,
  ArrowDownNarrowWide, Circle, CheckCircle,
  Tag, Dna, Ban, Flame, Microscope as MicroscopeIcon,
  Wind, Biohazard, Fingerprint
} from 'lucide-react';

interface ScreenDashboardProps {
  result: AnalysisResult | null;
  onNewScan: () => void;
}

/**
 * Animated "Hotspot" for visual pathology mapping
 */
const PathologyHotspot: React.FC<{ top: string; left: string; delay: string }> = ({ top, left, delay }) => (
  <div 
    className="absolute h-3 w-3 pointer-events-none" 
    style={{ top, left, animationDelay: delay }}
  >
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-sm border border-white"></span>
  </div>
);

const SolutionDisplay: React.FC<{ value: string; isOrganic: boolean }> = ({ value, isOrganic }) => {
  const parts = value.split('|').map(s => s.trim());
  const productName = parts[0];
  const price = parts[1];
  const description = parts[2];

  return (
    <div className="flex flex-col w-full space-y-4 animate-scale-up">
      {/* Product & Price Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <div className={`p-1 rounded-md ${isOrganic ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
            {isOrganic ? <Leaf size={12} /> : <Beaker size={12} />}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isOrganic ? 'text-emerald-500' : 'text-blue-500'}`}>
            {isOrganic ? 'Eco-Safe Solution' : 'Chemical Intervention'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xl font-black text-slate-800 leading-tight tracking-tight">
            {productName}
          </p>
          {price && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 border border-white/10 shrink-0 hover:scale-105 transition-transform cursor-default">
              <Tag size={10} className={isOrganic ? 'text-emerald-400' : 'text-blue-400'} />
              <span className="text-[10px] font-black whitespace-nowrap">
                Est. Market Value: <span className="text-white/80">{price}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Benefit Section */}
      {description && (
        <div className={`relative p-4 rounded-2xl border ${isOrganic ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-blue-500/5 border-blue-500/10'} overflow-hidden group/benefit`}>
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/benefit:scale-125 transition-transform duration-500">
             <Sparkles size={32} />
          </div>
          <div className="flex items-start gap-3 relative z-10">
            <div className={`p-1.5 rounded-lg ${isOrganic ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
               <Info size={14} />
            </div>
            <div className="flex-1">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Biological Application</span>
               <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic pr-4">
                 {description}
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PartStatus: React.FC<{ icon: any; label: string; isAffected: boolean; color: string; pattern?: string }> = ({ icon: Icon, label, isAffected, color, pattern }) => (
  <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-500 ${isAffected ? `${color} border-current shadow-md scale-[1.05]` : 'bg-slate-50 border-slate-100 opacity-30'}`}>
    <div className={`p-2.5 rounded-xl relative ${isAffected ? 'bg-white/40' : 'bg-slate-200/50'}`}>
      <Icon size={26} strokeWidth={isAffected ? 2.5 : 2} />
      {isAffected && (
        <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-full rounded-full h-2.5 w-2.5 bg-current"></span>
        </div>
      )}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-center leading-none">{label}</span>
    {isAffected && pattern && (
      <span className="text-[8px] font-bold opacity-80 text-center leading-tight mt-1">{pattern}</span>
    )}
  </div>
);

const TreatmentStep: React.FC<{ step: string; color: string; activeColor: string }> = ({ step, color, activeColor }) => {
  const [done, setDone] = useState(false);
  
  return (
    <li 
      onClick={() => setDone(!done)}
      className={`flex gap-4 group/step cursor-pointer p-3 rounded-2xl transition-all duration-300 border ${done ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60' : 'bg-white/5 border-white/5 hover:bg-white/10 active:scale-95'}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${done ? 'bg-emerald-500 text-white' : `${color} text-white/40`}`}>
        {done ? <CheckCircle size={18} /> : <Circle size={18} />}
      </div>
      <div className="flex-1">
        <p className={`text-xs font-bold leading-relaxed transition-colors ${done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
          {step}
        </p>
      </div>
    </li>
  );
};

export const ScreenDashboard: React.FC<ScreenDashboardProps> = ({ result, onNewScan }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{organic: boolean; inorganic: boolean}>({
    organic: true,
    inorganic: false
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!result) return null;

  const isHealthy = result.disease.toLowerCase().includes('healthy');
  
  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return {
        bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', accent: 'bg-yellow-500', bar: 'w-1/3'
      };
      case 'medium': return {
        bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', accent: 'bg-orange-500', bar: 'w-2/3'
      };
      case 'high': return {
        bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500', bar: 'w-full'
      };
      default: return {
        bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', accent: 'bg-slate-500', bar: 'w-0'
      };
    }
  };

  const severityStyles = getSeverityStyles(result.severity);

  const getPathogenProfile = (disease: string, symptoms: string[]) => {
    const d = disease.toLowerCase();
    const s = symptoms.join(' ').toLowerCase();
    
    if (d.includes('fungal') || s.includes('mold') || s.includes('mildew') || s.includes('fungus')) {
      return { type: 'Fungal Pathogen', icon: <CloudRain className="text-blue-500" />, desc: 'Spore-based infection, often exacerbated by humidity.', color: 'border-blue-200 bg-blue-50' };
    }
    if (d.includes('viral') || s.includes('mosaic') || s.includes('mottle')) {
      return { type: 'Viral Infection', icon: <Dna className="text-purple-500" />, desc: 'Systemic cellular distortion, often spread by insect vectors.', color: 'border-purple-200 bg-purple-50' };
    }
    if (d.includes('bacterial') || s.includes('ooze') || s.includes('wilt')) {
      return { type: 'Bacterial Colony', icon: <Biohazard className="text-orange-500" />, desc: 'Rapid vascular collapse or localized tissue degradation.', color: 'border-orange-200 bg-orange-50' };
    }
    if (d.includes('pest') || d.includes('insect') || s.includes('chewed') || s.includes('larvae')) {
      return { type: 'Insect Infestation', icon: <Bug className="text-red-500" />, desc: 'Mechanical tissue damage and nutrient theft by pests.', color: 'border-red-200 bg-red-50' };
    }
    if (d.includes('deficiency') || s.includes('yellowing') || s.includes('chlorosis')) {
      return { type: 'Nutrient Imbalance', icon: <FlaskConical className="text-emerald-500" />, desc: 'Physiological stress due to lack of essential minerals.', color: 'border-emerald-200 bg-emerald-50' };
    }
    return { type: 'Pathological Anomaly', icon: <MicroscopeIcon className="text-slate-500" />, desc: 'Unspecified tissue abnormality detected via biometric analysis.', color: 'border-slate-200 bg-slate-50' };
  };

  const parseInstructions = (text: string) => {
    const cleanText = text || '';
    const organicMatch = cleanText.match(/ORGANIC PROTOCOL:([\s\S]*?)(?=INORGANIC PROTOCOL:|$)/i);
    const inorganicMatch = cleanText.match(/INORGANIC PROTOCOL:([\s\S]*?)$/i);

    const splitToSteps = (segment: string) => 
      segment
        .split(/\n+/)
        .map(line => line.trim().replace(/^[-*•\d.]+\s*/, ''))
        .filter(line => line.length > 0);

    const organic = organicMatch ? splitToSteps(organicMatch[1]) : [];
    const inorganic = inorganicMatch ? splitToSteps(inorganicMatch[1]) : [];

    if (organic.length === 0 && inorganic.length === 0) {
      return { 
        isFormatted: false, 
        general: splitToSteps(cleanText) 
      };
    }

    return { isFormatted: true, organic, inorganic };
  };

  const remediationData = parseInstructions(result.treatment_instructions);

  const toggleSection = (section: 'organic' | 'inorganic') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const symStr = result.symptoms.join(' ').toLowerCase();
  const affected = {
    leaves: { 
      active: symStr.includes('leaf') || symStr.includes('foliage') || symStr.includes('blade'),
      pattern: symStr.includes('spot') ? 'Necrosis' : symStr.includes('yellow') ? 'Chlorosis' : symStr.includes('mosaic') ? 'Viral' : 'General'
    },
    stem: {
      active: symStr.includes('stem') || symStr.includes('stalk') || symStr.includes('canker'),
      pattern: symStr.includes('brown') ? 'Canker' : symStr.includes('weak') ? 'Atrophy' : 'Lesion'
    },
    fruit: {
      active: symStr.includes('fruit') || symStr.includes('berry') || symStr.includes('cherry') || symStr.includes('bloom'),
      pattern: symStr.includes('rot') ? 'Decay' : symStr.includes('spot') ? 'Pitted' : 'Pathogen'
    },
    roots: {
      active: symStr.includes('root') || symStr.includes('soil') || symStr.includes('wilt') || symStr.includes('base'),
      pattern: symStr.includes('soft') ? 'Oomycete' : symStr.includes('dry') ? 'Blight' : 'Systemic'
    }
  };

  const getSymptomMetadata = (symptom: string) => {
    const s = symptom.toLowerCase();
    
    if (s.includes('spot') || s.includes('lesion') || s.includes('speck') || s.includes('dot') || s.includes('pitted')) {
      return { icon: <Target size={20} />, label: 'Visual: Lesion', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    }
    if (s.includes('yellow') || s.includes('chlorosis') || s.includes('pale')) {
      return { icon: <Layers size={20} />, label: 'Visual: Chlorosis', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    }
    if (s.includes('mold') || s.includes('fuzz') || s.includes('mildew') || s.includes('spore') || s.includes('fungal')) {
      return { icon: <CloudRain size={20} />, label: 'Visual: Fungal', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
    if (s.includes('wilt') || s.includes('droop') || s.includes('sag') || s.includes('collapse') || s.includes('dry')) {
      return { icon: <ArrowDownNarrowWide size={20} />, label: 'Visual: Wilt', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
    }
    if (s.includes('curl') || s.includes('twist') || s.includes('distort') || s.includes('crinkle')) {
      return { icon: <Activity size={20} />, label: 'Visual: Distortion', color: 'bg-violet-100 text-violet-700 border-violet-200' };
    }
    if (s.includes('mosaic') || s.includes('mottle') || s.includes('streak') || s.includes('variegated')) {
      return { icon: <Dna size={20} />, label: 'Visual: Viral', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    }
    if (s.includes('chewed') || s.includes('hole') || s.includes('bite') || s.includes('larvae') || s.includes('insect')) {
      return { icon: <Bug size={20} />, label: 'Visual: Pest', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    }
    if (s.includes('necrosis') || s.includes('brown') || s.includes('dead') || s.includes('rot') || s.includes('canker')) {
      return { icon: <Skull size={20} />, label: 'Visual: Necrotic', color: 'bg-slate-800 text-slate-100 border-slate-700 shadow-sm' };
    }
    if (s.includes('burn') || s.includes('scorch') || s.includes('scald')) {
        return { icon: <Flame size={20} />, label: 'Visual: Abiotic', color: 'bg-orange-600 text-white border-orange-700' };
    }
    if (s.includes('stunted') || s.includes('small') || s.includes('weak')) {
        return { icon: <Ban size={20} />, label: 'Visual: Stunted', color: 'bg-slate-200 text-slate-600 border-slate-300' };
    }

    return { icon: <Eye size={20} />, label: 'Biological Marker', color: 'bg-slate-50 text-slate-600 border-slate-100' };
  };

  const pathogen = getPathogenProfile(result.disease, result.symptoms);

  return (
    <div className="p-6 pb-24 space-y-8 animate-fade-in relative overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-start animate-slide-up">
        <div className="relative">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Diagnostic</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Biosensor Scan Complete</p>
          </div>
        </div>
        <div className="text-right">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Model Confidence</div>
           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 text-xs font-black tabular-nums hover:scale-105 transition-transform">
             <Zap size={10} className="text-yellow-400" />
             {result.confidence}
           </div>
        </div>
      </div>

      {/* Main Analysis Card */}
      <section className={`relative overflow-hidden p-6 rounded-[3rem] border transition-all duration-700 shadow-2xl shadow-slate-200/50 animate-scale-up ${isHealthy ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
        {isScanning && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-fade-out" style={{ animationDelay: '1.5s' }}>
            <div className="absolute inset-0 shimmer opacity-10" />
            <div className="relative w-20 h-20 mb-4 animate-scale-up">
               <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
               <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
               <Microscope className="absolute inset-0 m-auto text-emerald-600 animate-pulse" size={32} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse relative z-10">De-coding Biometrics</p>
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-10 animate-slide-up">
            <div className={`p-5 rounded-[2rem] shadow-xl relative group transition-transform hover:scale-105 ${isHealthy ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white shadow-red-200'}`}>
              {isHealthy ? <ShieldCheck size={36} strokeWidth={2.5} /> : <Bug size={36} strokeWidth={2.5} />}
              <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">{result.disease}</h3>
              {!isHealthy && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${severityStyles.text}`}>Severity Level</span>
                    <span className={`text-[10px] font-black uppercase ${severityStyles.text}`}>{result.severity}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${severityStyles.accent} rounded-full transition-all duration-1000 ease-out ${severityStyles.bar}`} />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {isHealthy ? (
            <div className="bg-emerald-100/50 p-6 rounded-[2rem] border border-emerald-200/50 flex items-start gap-4 animate-scale-up">
              <div className="bg-white p-2.5 rounded-xl text-emerald-600 shadow-sm"><CheckCircle2 size={24} /></div>
              <div>
                <h4 className="font-black text-emerald-900 text-sm mb-1 uppercase tracking-tight">System Normative</h4>
                <p className="text-emerald-700 text-xs font-bold leading-relaxed">No anomalies detected. Photosynthesis and cellular respiration appear optimized.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pathogen Nature Profile */}
              <div className={`p-5 rounded-[2.5rem] border-2 flex items-center gap-5 transition-all animate-scale-up ${pathogen.color}`}>
                <div className="p-4 bg-white rounded-3xl shadow-sm border border-current/10 text-2xl">
                  {pathogen.icon}
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                      <Fingerprint size={10} className="opacity-40" />
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Pathogen Profile</span>
                   </div>
                   <h4 className="text-sm font-black text-slate-800 leading-none mb-1">{pathogen.type}</h4>
                   <p className="text-[10px] font-bold text-slate-500 leading-tight italic">{pathogen.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3 animate-slide-in-right">
                   <div className="flex items-center gap-2 px-1">
                     <div className="p-1 bg-slate-100 rounded-md"><ScanSearch size={12} className="text-slate-500" /></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biometric Impact</span>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <PartStatus icon={Leaf} label="Leaves" isAffected={affected.leaves.active} color="bg-green-50 text-green-600" pattern={affected.leaves.pattern} />
                     <PartStatus icon={Sprout} label="Stalk" isAffected={affected.stem.active} color="bg-emerald-50 text-emerald-600" pattern={affected.stem.pattern} />
                     <PartStatus icon={Cherry} label="Fruit" isAffected={affected.fruit.active} color="bg-rose-50 text-rose-600" pattern={affected.fruit.pattern} />
                     <PartStatus icon={Activity} label="Roots" isAffected={affected.roots.active} color="bg-amber-50 text-amber-600" pattern={affected.roots.pattern} />
                   </div>
                </div>

                <div className="relative bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden group animate-scale-up">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                     <Sprout size={120} className="text-slate-300 group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  {affected.leaves.active && <PathologyHotspot top="30%" left="40%" delay="0.1s" />}
                  {affected.stem.active && <PathologyHotspot top="60%" left="50%" delay="0.5s" />}
                  {affected.fruit.active && <PathologyHotspot top="45%" left="65%" delay="0.8s" />}
                  {affected.roots.active && <PathologyHotspot top="85%" left="45%" delay="1.2s" />}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-md rounded-lg border border-slate-100 shadow-sm animate-pulse-glow">
                    <Thermometer size={10} className="text-red-500" />
                    <span className="text-[8px] font-black text-slate-500 uppercase">Pathogen Heatmap</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="p-1 bg-slate-100 rounded-md"><Search size={12} className="text-slate-500" /></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Manifestations</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {result.symptoms.map((symptom, idx) => {
                    const meta = getSymptomMetadata(symptom);
                    return (
                      <div key={idx} className="group flex items-center gap-4 p-4 bg-slate-50/50 hover:bg-white border border-slate-100/50 hover:border-emerald-100 rounded-[1.8rem] transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className={`flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 border shadow-sm transition-transform group-hover:rotate-12 ${meta.color}`}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 block mb-1">{meta.label}</span>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-black text-slate-700 leading-tight">{symptom}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Prescription / Care Plan */}
      <section className="space-y-8 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity size={14} className="text-emerald-500 animate-pulse" /> Bio-Remediation Protocol
          </h3>
          <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black border border-blue-100 uppercase animate-pulse">STRICT PROTOCOL</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 bg-blue-50/50 rounded-[3rem] border border-blue-100/50 hover:bg-blue-50 transition-all hover:shadow-xl hover:shadow-blue-100/20 group animate-scale-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                  <Droplets size={20} />
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Hydration</span>
              </div>
              <p className="text-2xl font-black text-slate-900 tabular-nums">{result.recommended_water_liters}</p>
              <p className="text-[10px] text-blue-400 mt-1.5 font-bold uppercase tracking-widest">Target L/Cycle</p>
           </div>
           
           <div className="p-6 bg-emerald-50/50 rounded-[3rem] border border-emerald-100/50 hover:bg-emerald-50 transition-all hover:shadow-xl hover:shadow-emerald-100/20 group animate-scale-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
                  <Sprout size={20} />
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Nutrients</span>
              </div>
              <p className="text-base font-black text-slate-900 leading-tight">{result.recommended_fertilizer}</p>
              <p className="text-[10px] text-emerald-400 mt-1.5 font-bold uppercase tracking-widest">Active Formula</p>
           </div>
        </div>

        {!isHealthy && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[3.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-200 animate-slide-up">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-45 transition-transform duration-1000">
                 <ShieldAlert size={120} />
              </div>
              
              <div className="relative z-10 mb-10 text-center">
                <h4 className="font-black text-[11px] uppercase tracking-[0.4em] text-emerald-400 inline-flex items-center gap-4">
                  <span className="h-px w-6 bg-emerald-400/30" />
                  RECOVERY WORKFLOW
                  <span className="h-px w-6 bg-emerald-400/30" />
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-6 relative z-10">
                {/* Organic Protocol Collapsible */}
                <div className="bg-emerald-950/40 rounded-[2.5rem] border border-emerald-500/10 overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => toggleSection('organic')}
                    className="w-full flex items-center justify-between p-6 hover:bg-emerald-500/5 transition-colors group/header"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover/header:bg-emerald-500 group-hover/header:text-white transition-all">
                        <Leaf size={20} className="transition-transform group-hover/header:rotate-12" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 block mb-1">Standard 01</span>
                        <h5 className="text-sm font-black text-white uppercase tracking-tight">Eco-Remediation Plan</h5>
                      </div>
                    </div>
                    {expandedSections.organic ? <ChevronUp className="text-emerald-500 animate-bounce" /> : <ChevronDown className="text-emerald-500" />}
                  </button>
                  
                  {expandedSections.organic && (
                    <div className="px-6 pb-8 space-y-8 animate-slide-up">
                      <div className="p-5 bg-emerald-900/30 rounded-[2rem] border border-emerald-500/10 shadow-inner">
                         <SolutionDisplay value={result.organic_solution} isOrganic={true} />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2 mb-2">
                           <div className="flex items-center gap-2">
                             <ClipboardCheck size={14} className="text-emerald-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Remediation Steps</span>
                           </div>
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Tap steps to complete</span>
                        </div>
                        <ul className="space-y-3">
                          {(remediationData.isFormatted ? remediationData.organic : remediationData.general).map((step, idx) => (
                            <TreatmentStep key={idx} step={step} color="bg-emerald-500/20" activeColor="bg-emerald-500" />
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Inorganic Protocol Collapsible */}
                <div className="bg-blue-950/40 rounded-[2.5rem] border border-blue-500/10 overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => toggleSection('inorganic')}
                    className="w-full flex items-center justify-between p-6 hover:bg-blue-500/5 transition-colors group/header"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl group-hover/header:bg-blue-500 group-hover/header:text-white transition-all">
                        <Beaker size={20} className="transition-transform group-hover/header:rotate-12" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/70 block mb-1">Standard 02</span>
                        <h5 className="text-sm font-black text-white uppercase tracking-tight">Chemical Treatment Plan</h5>
                      </div>
                    </div>
                    {expandedSections.inorganic ? <ChevronUp className="text-blue-500 animate-bounce" /> : <ChevronDown className="text-blue-500" />}
                  </button>
                  
                  {expandedSections.inorganic && (
                    <div className="px-6 pb-8 space-y-8 animate-slide-up">
                      <div className="p-5 bg-blue-900/30 rounded-[2rem] border border-blue-500/10 shadow-inner">
                         <SolutionDisplay value={result.inorganic_solution} isOrganic={false} />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2 mb-2">
                           <div className="flex items-center gap-2">
                             <ClipboardCheck size={14} className="text-blue-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/60">Intervention Steps</span>
                           </div>
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Tap steps to complete</span>
                        </div>
                        <ul className="space-y-3">
                          {(remediationData.isFormatted ? remediationData.inorganic : []).map((step, idx) => (
                            <TreatmentStep key={idx} step={step} color="bg-blue-500/20" activeColor="bg-blue-500" />
                          ))}
                        </ul>
                        {remediationData.isFormatted && remediationData.inorganic.length === 0 && (
                          <div className="p-6 text-center border-2 border-dashed border-blue-500/10 rounded-2xl">
                             <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Chemical protocol not required</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isHealthy && (
          <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden group shadow-xl animate-slide-up">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <CheckCircle2 size={120} />
            </div>
            <h4 className="font-black text-[11px] uppercase tracking-[0.4em] mb-12 flex items-center gap-4 text-emerald-400">
              <span className="w-8 h-px bg-emerald-400/30" />
              SYSTEM OPTIMIZATION
              <span className="w-8 h-px bg-emerald-400/30" />
            </h4>
            <div className="space-y-4">
              {remediationData.general?.map((step, index) => (
                <TreatmentStep key={index} step={step} color="bg-emerald-500/20" activeColor="bg-emerald-500" />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Safety Compliance */}
      {!isHealthy && (
        <div className={`p-8 rounded-[3rem] border-2 shadow-2xl shadow-slate-200/50 animate-slide-up ${severityStyles.bg} ${severityStyles.border} flex items-start gap-6 relative overflow-hidden group`}>
          <div className="absolute -top-4 -right-4 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-1000">
            <AlertTriangle size={120} />
          </div>
          <div className={`p-4 rounded-2xl text-white shadow-lg shrink-0 ${severityStyles.accent} relative z-10 transition-transform group-hover:rotate-6`}>
            <ShieldAlert size={28} />
          </div>
          <div className="relative z-10">
            <h4 className={`text-[10px] font-black uppercase tracking-[0.25em] ${severityStyles.text} mb-3`}>
              Compliance Directive
            </h4>
            <p className="text-xs font-bold text-slate-700 leading-relaxed opacity-90">{result.overuse_warning}</p>
          </div>
        </div>
      )}

      {/* New Scan Persistence */}
      <div className="pt-10 animate-fade-in">
        <button
          onClick={onNewScan}
          className="group w-full py-7 bg-emerald-600 hover:bg-slate-900 text-white font-black rounded-[3rem] shadow-2xl shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-5 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
          <span className="relative z-10 text-xl uppercase tracking-widest">New Diagnostics</span>
          <ScanSearch size={28} className="relative z-10 group-hover:rotate-90 transition-transform duration-700" />
        </button>
      </div>
    </div>
  );
};
