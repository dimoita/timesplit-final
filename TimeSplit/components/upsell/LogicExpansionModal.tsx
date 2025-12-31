import React, { useEffect } from 'react';
import { X, BrainCircuit, HardHat, Coins, Ruler, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface LogicExpansionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const LogicExpansionModal: React.FC<LogicExpansionModalProps> = ({ isOpen, onClose, onCheckout }) => {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-[2rem] overflow-hidden border-[3px] border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-pop-in flex flex-col max-h-[90vh]">
        
        {/* Background Blueprint Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <BrainCircuit size={200} className="text-amber-500" />
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-amber-500/50 hover:text-amber-500 hover:bg-amber-500/10 rounded-full transition-colors z-20"
        >
            <X size={24} />
        </button>

        {/* HEADER: INDUSTRIAL STYLE */}
        <div className="relative z-10 p-8 border-b-2 border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-transparent">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-4">
                <Lock size={10} /> Clearance Level 2 Required
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide leading-tight">
                Unlock The <span className="text-amber-500">Engineer</span> Protocol
            </h2>
            <p className="text-slate-400 font-bold mt-2 text-lg">
                Stop memorizing. Start building.
            </p>
        </div>

        {/* BODY: THE PITCH */}
        <div className="relative z-10 p-8 overflow-y-auto custom-scrollbar">
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex gap-4 items-start">
                <div className="bg-amber-500/20 p-2 rounded-lg shrink-0">
                    <HardHat className="text-amber-500" size={24} />
                </div>
                <div>
                    <h4 className="text-amber-100 font-black uppercase text-sm tracking-wider mb-1">The "Robot" Problem</h4>
                    <p className="text-amber-200/70 text-sm font-medium leading-relaxed">
                        Most kids can recite "7x8=56", but fail when asked to calculate the cost of 7 toys. 
                        They memorize the <strong>sound</strong>, not the <strong>logic</strong>.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-gray-800 pb-2 mb-4">Module Capabilities</h3>
                
                {/* Feature 1 */}
                <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-amber-500 shrink-0 border border-gray-700 group-hover:border-amber-500/50 transition-colors">
                        <Ruler size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg">Real-World Engineering</h4>
                        <p className="text-gray-400 text-sm">
                            Word problems transformed into construction missions. Calculate loads, distances, and quantities to build bridges and towers.
                        </p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-green-400 shrink-0 border border-gray-700 group-hover:border-green-500/50 transition-colors">
                        <Coins size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg">Financial Literacy</h4>
                        <p className="text-gray-400 text-sm">
                            Applied math for money. Running a shop, calculating change, and understanding profit margins using multiplication.
                        </p>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-blue-400 shrink-0 border border-gray-700 group-hover:border-blue-500/50 transition-colors">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg">Logic Puzzles</h4>
                        <p className="text-gray-400 text-sm">
                            Non-linear challenges that require critical thinking, not just rote recall.
                        </p>
                    </div>
                </div>
            </div>

        </div>

        {/* FOOTER: CTA */}
        <div className="relative z-10 p-6 bg-slate-950 border-t border-gray-800 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="text-center md:text-left">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">One-time upgrade</div>
                <div className="text-3xl font-black text-white">$27</div>
            </div>

            <Button 
                onClick={onCheckout}
                className="w-full md:w-auto h-16 text-lg px-8 bg-amber-500 hover:bg-amber-400 text-black border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse"
            >
                Initialize Upgrade <ArrowRight className="ml-2" />
            </Button>
        </div>

      </div>
    </div>
  );
};