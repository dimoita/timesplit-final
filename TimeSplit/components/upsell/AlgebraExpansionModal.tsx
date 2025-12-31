
import React, { useEffect } from 'react';
import { X, BrainCircuit, BookOpen, Clock, ArrowRight, Lock, CheckCircle2, Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface AlgebraExpansionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const AlgebraExpansionModal: React.FC<AlgebraExpansionModalProps> = ({ isOpen, onClose, onCheckout }) => {
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
      
      <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-[2rem] overflow-hidden border-[3px] border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.2)] animate-pop-in flex flex-col max-h-[90vh]">
        
        {/* Background Algebra Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <BookOpen size={200} className="text-indigo-500" />
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-indigo-500/50 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-full transition-colors z-20"
        >
            <X size={24} />
        </button>

        {/* HEADER: FUTURISTIC ACADEMIC */}
        <div className="relative z-10 p-8 border-b-2 border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-transparent">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest mb-4 animate-pulse">
                <Clock size={10} /> Pre-Order Status: Early Bird
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide leading-tight">
                Project: <span className="text-indigo-400">Algebra</span> Bridge
            </h2>
            <p className="text-slate-400 font-bold mt-2 text-lg">
                Secure their future in High School Math today.
            </p>
        </div>

        {/* BODY: THE PITCH */}
        <div className="relative z-10 p-8 overflow-y-auto custom-scrollbar">
            
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-8 flex gap-4 items-start">
                <div className="bg-indigo-500/20 p-2 rounded-lg shrink-0">
                    <BrainCircuit className="text-indigo-400" size={24} />
                </div>
                <div>
                    <h4 className="text-indigo-200 font-black uppercase text-sm tracking-wider mb-1">The "X" Variable</h4>
                    <p className="text-indigo-300/70 text-sm font-medium leading-relaxed">
                        Algebra is the #1 reason students drop out of STEM paths. It requires abstract thinking that most schools introduce too late.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-gray-800 pb-2 mb-4">Founder's Package Includes</h3>
                
                {/* Feature 1 */}
                <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-green-400 shrink-0 border border-gray-700 group-hover:border-green-500/50 transition-colors">
                        <Download size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg">Immediate Bonus: Digital Guide</h4>
                        <p className="text-gray-400 text-sm">
                            Get the "Algebra Readiness Kit" PDF immediately. 50 pre-algebra puzzles to solve offline while we build the app module.
                        </p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-indigo-400 shrink-0 border border-gray-700 group-hover:border-indigo-500/50 transition-colors">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg">Locked Price Guarantee</h4>
                        <p className="text-gray-400 text-sm">
                            The public launch price will be $97. Your price today is locked at $27 forever.
                        </p>
                    </div>
                </div>
            </div>

        </div>

        {/* FOOTER: CTA */}
        <div className="relative z-10 p-6 bg-slate-950 border-t border-gray-800 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="text-center md:text-left">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 line-through">$97.00</div>
                <div className="text-3xl font-black text-white">$27</div>
            </div>

            <Button 
                onClick={onCheckout}
                className="w-full md:w-auto h-16 text-lg px-8 bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800 shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse"
            >
                Secure Founder's Rate <ArrowRight className="ml-2" />
            </Button>
        </div>

      </div>
    </div>
  );
};
