
import React, { useState, useMemo } from 'react';
import { 
  Lock, Activity, BrainCircuit, Trash2, AlertTriangle, 
  TrendingUp, Target, ShieldCheck, Download, 
  Printer, ChevronRight, FileText, Zap, X, Grid, Search,
  Wallet, Clock, CheckCircle2, XCircle, Info, HelpCircle,
  Map, PieChart, Star, CreditCard, ArrowRight, BookOpen,
  Ticket, Cloud, Check, Eye, Moon, Thermometer
} from 'lucide-react';
import { Button } from './ui/Button';
import { RealWorldItem } from './RealityCoupons';

type MasteryMap = Record<string, number>;

interface GuardianInterfaceProps {
  onBack: () => void;
  mastery: MasteryMap;
  onResetProfile: () => void;
  isZenMode: boolean;
  onToggleZenMode: (val: boolean) => void;
  isHighContrast: boolean;
  onToggleHighContrast: (val: boolean) => void;
  childName?: string;
  hasBackupInsurance?: boolean;
  onForceBackup?: () => Promise<void>;
  realWorldInventory?: RealWorldItem[];
  isPremium: boolean;
  hasOfflineKit: boolean;
  onTriggerCheckout: () => void;
  onTriggerUpsell: () => void;
  onApproveItem: (itemId: string) => void;
  onRefundItem: (itemId: string) => void;
}

// --- SUB-COMPONENTS ---

const PremiumLockOverlay: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => (
    <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-900/40 flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 border-dashed border-white/20">
        <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-xs w-full border-4 border-yellow-400 transform hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock size={24} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">Guardian Intel</h3>
            <p className="text-xs text-slate-500 font-bold mb-4">
                Unlock advanced neural metrics, velocity tracking, and gap analysis.
            </p>
            <Button onClick={onUnlock} className="w-full h-10 text-sm bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-lg">
                Unlock Data ($17)
            </Button>
        </div>
    </div>
);

const ROICard: React.FC<{ masteredCount: number }> = ({ masteredCount }) => {
  const savings = (masteredCount * 2.50).toFixed(2);
  
  return (
    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Wallet size={64} className="text-emerald-600" />
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
          <TrendingUp size={18} />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1">
          Valor Econômico Gerado <Info size={10} />
        </span>
      </div>
      
      <div className="relative z-10">
        <div className="text-4xl font-black text-emerald-700 tracking-tight">
          ${savings}
        </div>
        <p className="text-[10px] font-bold text-emerald-600/80 mt-1 uppercase tracking-wide leading-tight">
          Economia estimada em tutoria privada <br/>(Base: $2.50/fato dominado)
        </p>
      </div>
    </div>
  );
};

const VelocityGraph: React.FC<{ masteryPercent: number, isLocked: boolean, onUnlock: () => void }> = ({ masteryPercent, isLocked, onUnlock }) => {
  const days = 30;
  const startVal = 8.5;
  const currentVal = 8.5 - (6.5 * masteryPercent); 
  
  const points = [];
  const width = 300;
  const height = 80;
  
  for (let i = 0; i <= days; i++) {
    const progress = i / days;
    const val = startVal - ((startVal - currentVal) * (1 - Math.pow(1 - progress, 3)));
    const x = (i / days) * width;
    const y = height - ((8.5 - val) / 6.5) * height; 
    points.push(`${x},${y}`);
  }

  const polylinePoints = points.join(' ');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
      {isLocked && <PremiumLockOverlay onUnlock={onUnlock} />}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <Clock size={14} className="text-indigo-500" /> Velocidade Neural
          </h4>
          <p className="text-[10px] text-slate-400 font-bold">Tempo médio de resposta (30 dias)</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-indigo-600">{currentVal.toFixed(1)}s</div>
          <div className="text-[10px] text-green-500 font-bold flex items-center justify-end gap-1">
            <Zap size={8} fill="currentColor" /> {Math.round(masteryPercent * 100)}% mais rápido
          </div>
        </div>
      </div>

      <div className={`relative h-24 w-full overflow-hidden ${isLocked ? 'blur-sm opacity-50' : ''}`}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="0" x2={width} y2="0" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1={height} x2={width} y2={height} stroke="#f1f5f9" strokeWidth="1" />
          <polygon points={`0,${height} ${polylinePoints} ${width},${height}`} fill="url(#velocityGradient)" />
          <polyline points={polylinePoints} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={width} cy={points[points.length-1].split(',')[1]} r="4" fill="white" stroke="#4f46e5" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
};

const AuditLog: React.FC<{ mastery: MasteryMap, isLocked: boolean, onUnlock: () => void }> = ({ mastery, isLocked, onUnlock }) => {
  const logEntries = useMemo(() => {
    const entries = Object.entries(mastery).map(([key, score], idx) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - (idx * 45)); 
      
      const val = score as number;
      const isSuccess = val >= 0.8;
      const isFail = val < 0.4;
      const time = isSuccess ? (Math.random() * 1.5 + 0.5).toFixed(1) + 's' : (Math.random() * 5 + 3).toFixed(1) + 's';
      
      return {
        id: key,
        fact: key.replace('x', ' × '),
        timeStr: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateStr: date.toLocaleDateString(),
        score: val,
        duration: time,
        status: isSuccess ? 'SINAPSE CONSOLIDADA' : isFail ? 'FALHA - CORREÇÃO INICIADA' : 'EM PROCESSAMENTO',
        type: isSuccess ? 'SUCCESS' : isFail ? 'FAIL' : 'WARN'
      };
    });
    return entries.slice(0, 50); 
  }, [mastery]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden relative">
      {isLocked && <PremiumLockOverlay onUnlock={onUnlock} />}
      
      <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
          <FileText size={14} className="text-slate-500" /> Registro de Auditoria
        </h4>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Live Feed</span>
        </div>
      </div>
      
      <div className={`overflow-y-auto custom-scrollbar p-0 flex-1 max-h-[300px] lg:max-h-none bg-slate-50 ${isLocked ? 'blur-sm select-none' : ''}`}>
        {logEntries.length === 0 ? (
           <div className="p-8 text-center text-slate-400 text-xs font-mono">Nenhum dado registrado ainda.</div>
        ) : (
           <table className="w-full text-left border-collapse">
             <thead className="bg-slate-100 sticky top-0 z-10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
               <tr>
                 <th className="p-3 border-b border-slate-200">Hora</th>
                 <th className="p-3 border-b border-slate-200">Fato</th>
                 <th className="p-3 border-b border-slate-200">Latência</th>
                 <th className="p-3 border-b border-slate-200">Diagnóstico do Sistema</th>
               </tr>
             </thead>
             <tbody className="text-xs font-mono">
               {logEntries.map((entry) => (
                 <tr key={entry.id} className="border-b border-slate-100 hover:bg-white transition-colors">
                   <td className="p-3 text-slate-500 font-bold">{entry.timeStr}</td>
                   <td className="p-3 font-black text-slate-700">{entry.fact}</td>
                   <td className="p-3 text-slate-600">{entry.duration}</td>
                   <td className="p-3">
                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide
                       ${entry.type === 'SUCCESS' ? 'bg-green-50 text-green-700 border-green-200' : 
                         entry.type === 'FAIL' ? 'bg-red-50 text-red-700 border-red-200' : 
                         'bg-yellow-50 text-yellow-700 border-yellow-200'}
                     `}>
                       {entry.type === 'SUCCESS' ? <CheckCircle2 size={10} /> : entry.type === 'FAIL' ? <XCircle size={10} /> : <Activity size={10} />}
                       {entry.status}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        )}
      </div>
    </div>
  );
};

// Sub-component for Reward Item
const RewardItemRow: React.FC<{ item: RealWorldItem, onApprove: (id: string) => void, onRefund: (id: string) => void }> = ({ item, onApprove, onRefund }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
    <div>
        <div className="font-bold text-slate-800 text-sm">{item.name}</div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>{new Date(item.purchasedAt).toLocaleDateString()}</span>
            <span className="text-yellow-600 font-bold flex items-center gap-1">
                {item.cost} <Zap size={10} fill="currentColor" />
            </span>
        </div>
    </div>
    <div className="flex items-center gap-2">
        <button onClick={() => onRefund(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Refund coins to child">
            <X size={18} />
        </button>
        <button onClick={() => onApprove(item.id)} className="px-3 py-1.5 bg-green-500 hover:bg-green-400 text-white text-xs font-black uppercase rounded-lg shadow-sm flex items-center gap-1 transition-colors">
            <Check size={14} strokeWidth={3} /> Approve
        </button>
    </div>
  </div>
);

// --- ACADEMIC ROADMAP COMPONENTS ---

const AcademicRoadmap: React.FC<{ 
  masteryPercent: number, 
  isPremium: boolean, 
  onTriggerCheckout: () => void,
  onShowFractions: () => void,
  onShowLogic: () => void
}> = ({ masteryPercent, isPremium, onTriggerCheckout, onShowFractions, onShowLogic }) => {
  return (
    <div className="col-span-12 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Map size={20} />
            </div>
            <div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Curriculum Progress</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Academic Roadmap 2024</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. MULTIPLICATION (Active) */}
            <div className="bg-slate-50 rounded-2xl p-4 border-2 border-indigo-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-bl-xl">Active Protocol</div>
                <div className="flex flex-col h-full justify-between">
                    <div className="mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-3">
                            <X size={24} />
                        </div>
                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Multiplication<br/>Mastery</h3>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>Status</span>
                            <span>{Math.round(masteryPercent * 100)}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${masteryPercent * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. DIVISION (Next Step) */}
            <div 
                onClick={!isPremium ? onTriggerCheckout : undefined}
                className={`rounded-2xl p-4 border-2 relative group overflow-hidden transition-all cursor-pointer
                    ${isPremium ? 'bg-white border-green-200 hover:border-green-400' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 opacity-90'}
                `}
            >
                {!isPremium && <div className="absolute inset-0 bg-slate-200/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <Lock className="text-slate-400" size={32} />
                </div>}
                
                <div className="flex flex-col h-full justify-between relative z-0">
                    <div className="mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${isPremium ? 'bg-green-100 text-green-600' : 'bg-slate-300 text-slate-500'}`}>
                            <Grid size={24} />
                        </div>
                        <h3 className={`font-black text-sm uppercase tracking-wide ${isPremium ? 'text-slate-900' : 'text-slate-500'}`}>Division<br/>Fluency</h3>
                    </div>
                    <div>
                        {isPremium ? (
                            <div className="text-xs font-bold text-green-600 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Ready to Start
                            </div>
                        ) : (
                            <div className="text-[10px] font-black uppercase text-slate-500 bg-slate-300 inline-block px-2 py-1 rounded">
                                Locked
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. LOGIC (Upsell) */}
            <div 
                onClick={onShowLogic}
                className="bg-slate-900 rounded-2xl p-4 border-2 border-slate-800 relative group overflow-hidden cursor-pointer hover:border-amber-500/50 transition-colors"
            >
                <div className="absolute top-2 right-2 text-amber-500">
                    <Lock size={16} />
                </div>
                
                <div className="flex flex-col h-full justify-between">
                    <div className="mb-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-amber-500 mb-3 border border-slate-700">
                            <BrainCircuit size={24} />
                        </div>
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">Advanced<br/>Logic</h3>
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-amber-500 bg-amber-950/50 border border-amber-500/30 inline-block px-2 py-1 rounded">
                            Engineer Protocol
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. FRACTIONS (Smoke Test) */}
            <div 
                onClick={onShowFractions}
                className="bg-blue-600 rounded-2xl p-4 border-2 border-blue-400 relative group overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[9px] font-black uppercase px-2 py-1 rounded-bl-xl z-10">Coming Soon</div>
                
                <div className="flex flex-col h-full justify-between relative z-10">
                    <div className="mb-4">
                        <div className="w-12 h-12 bg-blue-500/50 rounded-xl flex items-center justify-center text-white mb-3 border border-blue-300/30">
                            <PieChart size={24} />
                        </div>
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">Fractions &<br/>Decimals</h3>
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-blue-200 border border-blue-300/50 inline-block px-2 py-1 rounded">
                            Founder's Pre-order
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}

// --- MODALS ---

const FractionsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-blue-600 w-full max-w-md rounded-3xl p-8 relative shadow-2xl border-4 border-blue-400 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] opacity-10 pointer-events-none"></div>
            
            <button onClick={onClose} className="absolute top-4 right-4 text-blue-200 hover:text-white"><X size={24} /></button>
            
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg relative z-10">
                <PieChart size={40} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2 relative z-10">Secure Your Spot</h2>
            <p className="text-blue-100 font-bold text-lg mb-8 relative z-10">Fractions Protocol</p>
            
            <div className="bg-blue-800/50 rounded-xl p-6 border border-blue-400/30 mb-8 relative z-10">
                <div className="flex justify-between items-center mb-4 text-blue-200 text-xs font-bold uppercase tracking-wider">
                    <span>Launch Price</span>
                    <span className="line-through opacity-50">$67.00</span>
                </div>
                <div className="flex justify-between items-center text-white">
                    <span className="font-black text-lg">Founder's Deal</span>
                    <span className="text-4xl font-black text-yellow-400">$27</span>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-400/20 text-blue-200 text-xs font-mono">
                    Est. Delivery: Fall 2025
                </div>
            </div>

            <Button className="w-full h-16 text-xl bg-yellow-400 hover:bg-yellow-300 text-blue-900 border-none relative z-10 shadow-xl">
                Reserve Now <ArrowRight className="ml-2" />
            </Button>
            <p className="mt-4 text-[10px] text-blue-300 font-bold relative z-10">
                By clicking, you are pre-ordering a digital product.
            </p>
        </div>
    </div>
);

const LogicStubModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-slate-900 w-full max-w-md rounded-3xl p-8 relative shadow-2xl border-2 border-amber-500/50 text-center">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <BrainCircuit size={40} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Engineer Protocol</h2>
            <p className="text-slate-400 font-medium mb-8">
                This module teaches critical thinking and applied mathematics through engineering puzzles.
            </p>
            <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-xl mb-6">
                <p className="text-amber-400 font-bold text-sm">One-time Upgrade: $27</p>
            </div>
            <Button onClick={onClose} className="w-full bg-amber-500 hover:bg-amber-400 text-black border-none">
                Unlock Access
            </Button>
        </div>
    </div>
);

export const GuardianInterface: React.FC<GuardianInterfaceProps> = ({ 
  onBack, mastery, onResetProfile, childName = "Hero", 
  hasBackupInsurance = false, onForceBackup, realWorldInventory = [],
  isPremium, hasOfflineKit, onTriggerCheckout, onTriggerUpsell,
  onApproveItem, onRefundItem, isZenMode, onToggleZenMode, isHighContrast, onToggleHighContrast
}) => {
  const [gateAnswer, setGateAnswer] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number, score: number} | null>(null);
  
  // Modals State
  const [activeModal, setActiveModal] = useState<'NONE' | 'FRACTIONS' | 'LOGIC'>('NONE');

  // Filter for Pending Rewards (Unused/Active)
  const pendingRewards = useMemo(() => {
      return (realWorldInventory || []).filter(i => i.status === 'UNUSED' || i.status === 'ACTIVE').sort((a,b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());
  }, [realWorldInventory]);

  // --- ANALYTICS ENGINE ---
  const { totalFacts, masteredFacts, criticalGaps, neuralEfficiency, learningFacts } = useMemo(() => {
    let total = 0;
    let mastered = 0;
    let gaps = 0;
    let learning = 0;
    let totalScore = 0;

    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
            const key = i < j ? `${i}x${j}` : `${j}x${i}`;
            const score = mastery[key] || 0;
            total++;
            totalScore += score;
            if (score >= 0.8) mastered++;
            else if (score >= 0.3) learning++;
            else gaps++;
        }
    }

    return {
        totalFacts: total,
        masteredFacts: mastered,
        learningFacts: learning,
        criticalGaps: gaps,
        neuralEfficiency: Math.round((totalScore / total) * 100)
    };
  }, [mastery]);

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gateAnswer === '12') setIsLocked(false);
  };

  const handleResetClick = () => {
      if (confirm("WARNING: This will permanently delete all progress. This cannot be undone. Proceed?")) {
          onResetProfile();
      }
  };

  const handleReportAction = () => {
      if (hasOfflineKit) {
          // Simulate Download
          alert("Downloading PDF Report...");
      } else {
          onTriggerUpsell();
      }
  };

  const getCellColor = (r: number, c: number) => {
      const key = r < c ? `${r}x${c}` : `${c}x${r}`;
      const score = mastery[key] || 0;
      if (score >= 0.8) return 'bg-emerald-500 border-emerald-600';
      if (score >= 0.3) return 'bg-yellow-400 border-yellow-500';
      return 'bg-red-500 border-red-600';
  };

  const getScore = (r: number, c: number) => {
      const key = r < c ? `${r}x${c}` : `${c}x${r}`;
      return mastery[key] || 0;
  };

  if (isLocked) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4 font-nunito">
        <form onSubmit={handleGateSubmit} className="bg-white p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <Lock className="text-slate-400" size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Parental Access</h2>
          <p className="text-slate-500 text-sm mb-6 font-bold">Security Check: What is 3 x 4?</p>
          <input 
            type="number" 
            value={gateAnswer} 
            onChange={e => setGateAnswer(e.target.value)} 
            className="w-full text-center text-4xl font-black border-2 border-slate-200 rounded-xl py-3 mb-6 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900" 
            autoFocus 
            placeholder="?"
          />
          <Button className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-500">Access Panel</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col animate-in fade-in duration-300">
      
      {activeModal === 'FRACTIONS' && <FractionsModal onClose={() => setActiveModal('NONE')} />}
      {activeModal === 'LOGIC' && <LogicStubModal onClose={() => setActiveModal('NONE')} />}

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Activity size={20} />
          </div>
          <div>
             <h1 className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none mb-1">Neural Audit Log</h1>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject: {childName}</p>
          </div>
        </div>
        <button onClick={onBack} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 md:px-6 py-2 rounded-lg font-bold text-xs uppercase transition-colors">
            Exit
        </button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid lg:grid-cols-12 gap-6 content-start pb-24">
        
        {/* --- ACADEMIC ROADMAP (BLOCK 2) --- */}
        <AcademicRoadmap 
            masteryPercent={masteredFacts / totalFacts} 
            isPremium={isPremium}
            onTriggerCheckout={onTriggerCheckout}
            onShowFractions={() => setActiveModal('FRACTIONS')}
            onShowLogic={() => setActiveModal('LOGIC')}
        />

        {/* --- BLOCK 3: CONTROL TOWER --- */}
        <div className="col-span-12 grid lg:grid-cols-12 gap-6">
            
            {/* REWARD QUEUE */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                        <Ticket size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 text-lg leading-none">Reward Approval Queue</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Manage Real-World Requests</p>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {pendingRewards.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                            <Ticket size={48} className="mb-2 opacity-20" />
                            <p className="font-bold text-sm">No pending requests</p>
                        </div>
                    ) : (
                        pendingRewards.map(item => (
                            <RewardItemRow 
                                key={item.id} 
                                item={item} 
                                onApprove={onApproveItem} 
                                onRefund={onRefundItem} 
                            />
                        ))
                    )}
                </div>
            </div>

            {/* NEURO SETTINGS */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <BrainCircuit size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 text-lg leading-none">Neuro-Settings</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Cognitive Load Control</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Neural Protocol Status */}
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <Thermometer size={14} className="text-orange-500" /> 15-Min Protocol
                            </div>
                            <p className="text-[10px] text-green-600 font-bold leading-tight mt-1 bg-green-50 px-2 py-1 rounded inline-block">
                                <Check size={8} className="inline mr-1" /> Active
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-[150px]">
                                Auto-locks campaign to prevent burnout. Cannot be disabled.
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100"></div>

                    {/* Zen Mode */}
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="font-bold text-slate-800 text-sm">Zen Mode (Low Sensory)</div>
                            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1 max-w-[150px]">
                                Reduces visual stimuli & removes timers for anxiety regulation.
                            </p>
                        </div>
                        <button 
                            onClick={() => onToggleZenMode(!isZenMode)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${isZenMode ? 'bg-green-500' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isZenMode ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>

                    <div className="w-full h-px bg-slate-100"></div>

                    {/* High Contrast */}
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="font-bold text-slate-800 text-sm">Focus Protocol</div>
                            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1 max-w-[150px]">
                                Maximizes legibility for attention deficit correction.
                            </p>
                        </div>
                        <button 
                            onClick={() => onToggleHighContrast(!isHighContrast)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${isHighContrast ? 'bg-green-500' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isHighContrast ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

        </div>

        {/* --- LEFT COL: METRICS & ROI (BLOCK 1) --- */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
            
            {/* 1. ROI CARD (New) */}
            <ROICard masteredCount={masteredFacts} />

            {/* 2. KPI CARDS (Existing Compacted) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <BrainCircuit size={14} /> Efficiency
                    </div>
                    <div className="text-3xl font-black text-slate-800">{neuralEfficiency}%</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <AlertTriangle size={14} /> Gaps
                    </div>
                    <div className="text-3xl font-black text-red-500">{criticalGaps}</div>
                </div>
            </div>

            {/* 3. NEURAL VELOCITY GRAPH (Locked if !Premium) */}
            <VelocityGraph masteryPercent={masteredFacts / totalFacts} isLocked={!isPremium} onUnlock={onTriggerCheckout} />

            {/* 4. ACTIONS (Existing) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mt-auto">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={handleReportAction}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${hasOfflineKit ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        {hasOfflineKit ? <Download size={20} /> : <Lock size={20} />}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Generate School Report</h4>
                        <p className="text-xs text-slate-500">Printable analysis PDF.</p>
                    </div>
                    {!hasOfflineKit && (
                        <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase rounded">Upgrade</div>
                    )}
                </div>
            </div>
        </div>

        {/* --- RIGHT COL: HEATMAP & LOGS --- */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* HEATMAP (Existing Refined) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Memory Heatmap</h3>
                    </div>
                    <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Fluent</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Learning</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Gap</div>
                    </div>
                </div>

                <div className="p-6 flex items-center justify-center bg-slate-50 relative min-h-[300px]">
                    {/* PAYWALL LOGIC */}
                    {!isPremium && <PremiumLockOverlay onUnlock={onTriggerCheckout} />}

                    <div className={`relative ${!isPremium ? 'filter blur-sm opacity-50' : ''}`}>
                        {/* Axis Top */}
                        <div className="flex mb-2 ml-6">
                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <div key={`h-${n}`} className="w-6 md:w-8 text-center text-[10px] font-black text-slate-400">{n}</div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1 md:gap-2">
                            {[1,2,3,4,5,6,7,8,9,10].map(row => (
                                <div key={`row-${row}`} className="flex gap-1 md:gap-2 items-center">
                                    <div className="w-4 md:w-6 text-right text-[10px] font-black text-slate-400 mr-2">{row}</div>
                                    {[1,2,3,4,5,6,7,8,9,10].map(col => (
                                        <div 
                                            key={`${row}-${col}`}
                                            onMouseEnter={() => isPremium && setHoveredCell({row, col, score: getScore(row, col)})}
                                            onMouseLeave={() => isPremium && setHoveredCell(null)}
                                            className={`
                                                w-6 h-6 md:w-8 md:h-8 rounded-md border shadow-sm transition-all duration-200 cursor-help
                                                ${getCellColor(row, col)}
                                                ${hoveredCell?.row === row && hoveredCell?.col === col ? 'scale-125 z-10 ring-2 ring-white shadow-xl' : 'hover:opacity-80'}
                                            `}
                                        ></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        {hoveredCell && (
                            <div className="absolute top-0 right-[-120px] bg-slate-900 text-white p-3 rounded-xl shadow-xl z-20 pointer-events-none w-28">
                                <div className="text-lg font-black text-center">{hoveredCell.row} × {hoveredCell.col}</div>
                                <div className={`text-[10px] font-bold text-center uppercase ${hoveredCell.score >= 0.8 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {hoveredCell.score >= 0.8 ? 'Mastered' : 'Needs Work'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AUDIT LOG (New) */}
            <AuditLog mastery={mastery} isLocked={!isPremium} onUnlock={onTriggerCheckout} />

        </div>

        {/* FOOTER: DANGER ZONE */}
        <div className="col-span-12 mt-8 pt-6 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                <Cloud size={14} />
                <span>Data Encrypted & Backed Up</span>
            </div>
            
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">ID: {childName?.substring(0, 3).toUpperCase()}-{Math.floor(Math.random()*1000)}</span>
                <button 
                    onClick={handleResetClick}
                    className="flex items-center gap-2 text-red-400 hover:text-red-600 text-xs font-bold transition-colors uppercase tracking-wider"
                >
                    <Trash2 size={14} /> Reset Profile
                </button>
            </div>
        </div>

      </main>
    </div>
  );
};
