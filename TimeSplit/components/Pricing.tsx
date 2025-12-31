
import React from 'react';
import { Button } from './ui/Button';
import { Check, Shield, Zap, Gift, Pizza, Clock, AlertCircle, Sparkles, Lock, Star, Activity } from 'lucide-react';
import { useScarcity } from '../hooks/useScarcity';

interface PricingProps {
  childName?: string;
  onCheckout: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ childName, onCheckout }) => {
  const { percentage, isUpdating } = useScarcity();
  
  // Critical urgency mode if > 95%
  const isCritical = percentage > 95;

  // Dynamic Title Logic
  const bundleTitle = childName 
    ? <>{childName}'s <span className="text-indigo-200">Rescue Protocol</span></>
    : "The Math Rescue Bundle";

  const buttonText = childName
    ? `Start ${childName}'s Protocol`
    : "Start The Rescue Protocol";

  return (
    <section className="w-full bg-[#FFFBF0] py-20 lg:py-32 overflow-hidden" id="pricing">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADLINE */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 border border-green-200 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider mb-6">
             <span className="animate-pulse">●</span> Founder's Batch Application
          </div>
          <h2 className="text-4xl lg:text-7xl font-black text-gray-900 mb-8 text-3d leading-tight">
             Cheaper Than <span className="text-[#FF6B35] underline decoration-4 decoration-[#FF6B35]/30 underline-offset-4">Friday Night Pizza</span>.
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 font-bold max-w-2xl mx-auto leading-relaxed">
            For less than the price of a meal that lasts 20 minutes, you can give your child a skill that lasts a lifetime.
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-6xl mx-auto">
          
          {/* ANCHOR: THE PIZZA (Left Side / Top) */}
          <div className="w-full lg:col-span-5 relative group">
             {/* Comparison Card */}
             <div className="bg-white rounded-3xl p-8 border-4 border-gray-100 shadow-xl opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-105">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-500 font-black text-xs px-4 py-2 rounded-full uppercase tracking-wider">
                   The Old Way
                </div>
                
                <div className="flex flex-col items-center text-center grayscale group-hover:grayscale-0 transition-all duration-500">
                   <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mb-6 relative">
                      <Pizza size={64} className="text-orange-500" />
                      <div className="absolute bottom-0 right-0 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-lg">
                         ~2,500 Cal
                      </div>
                   </div>
                   
                   <h3 className="text-2xl font-black text-gray-400 mb-2">One Family Dinner</h3>
                   <div className="text-4xl font-black text-gray-900 mb-6 strike-through decoration-red-500 line-through">~$45.00</div>
                   
                   <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 text-left">
                      <div className="flex items-center gap-3 text-gray-400 font-bold">
                         <Clock size={18} /> Gone in 30 minutes
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 font-bold">
                         <AlertCircle size={18} /> "I'm hungry again"
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 font-bold">
                         <Lock size={18} /> Zero long-term value
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* VS BADGE (Middle) */}
          <div className="lg:col-span-2 flex justify-center py-4 lg:py-0">
             <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white font-black text-xl border-4 border-[#FFFBF0] shadow-xl z-10">
                VS
             </div>
          </div>

          {/* THE OFFER: THE BUNDLE (Right Side) */}
          <div className="w-full lg:col-span-5 relative">
             
             {/* Scarcity Bar */}
             <div className="bg-gray-900 text-white rounded-t-3xl p-4 pt-6 pb-8 -mb-6 relative z-0">
                <div className="flex justify-between items-end mb-2">
                   <span className={`text-xs font-black uppercase tracking-widest ${isCritical ? 'text-red-500 animate-pulse' : 'text-[#FF6B35]'} transition-colors duration-500`}>
                      {isCritical ? "Almost Gone! Closing Soon" : "Founder's Batch Closing"}
                   </span>
                   <span className={`text-xs font-bold transition-all duration-500 ${isUpdating ? 'text-white scale-110' : 'text-gray-400'}`}>
                      {percentage.toFixed(1)}% Claimed
                   </span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                   <div 
                      className={`h-full rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)] transition-all duration-1000 ease-out
                        ${isCritical ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-[#FF6B35] to-red-600'}
                      `}
                      style={{ width: `${percentage}%` }}
                   ></div>
                </div>
             </div>

             <div className="bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(79,70,229,0.3)] border-[6px] border-[#4F46E5] relative z-10 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                
                {/* Header */}
                <div className="bg-gradient-to-br from-[#4F46E5] to-[#312E81] p-8 text-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                   
                   {/* CSS 3D Box Representation */}
                   <div className="perspective-1000 w-32 h-32 mx-auto mb-6 animate-float">
                      <div className="relative w-full h-full transform-style-3d rotate-y-[-25deg] rotate-x-[10deg]">
                         {/* Front Face */}
                         <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] border-2 border-indigo-300 rounded-lg flex items-center justify-center flex-col shadow-inner backface-hidden z-20">
                            <span className="text-4xl mb-1">🚀</span>
                            <span className="text-white font-black text-[10px] uppercase tracking-wider">TimeSplit</span>
                         </div>
                         {/* Side Face */}
                         <div className="absolute inset-0 bg-indigo-900 w-8 h-full left-full origin-left transform rotate-y-90 border border-indigo-700"></div>
                         {/* Top Face */}
                         <div className="absolute inset-0 bg-indigo-400 w-full h-8 -top-8 origin-bottom transform rotate-x-90 border border-indigo-300"></div>
                      </div>
                   </div>

                   <h3 className="text-2xl font-black text-white uppercase tracking-wide text-3d mb-1">
                      {bundleTitle}
                   </h3>
                   {childName && (
                       <div className="inline-block bg-white/20 px-3 py-1 rounded-full mt-2">
                           <p className="text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                               <Sparkles size={10} /> Customized for {childName}
                           </p>
                       </div>
                   )}
                </div>

                {/* The Stack */}
                <div className="p-8 space-y-6">
                   <div className="space-y-4">
                      {/* Core Item */}
                      <div className="flex justify-between items-center group">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-[#4F46E5]">
                               <Zap size={18} fill="currentColor" />
                            </div>
                            <span className="font-black text-gray-800">TimeSplit Lifetime App</span>
                         </div>
                         <span className="text-gray-400 font-bold decoration-red-400 line-through decoration-2">$197</span>
                      </div>

                      {/* Bonus 1 */}
                      <div className="flex justify-between items-center group">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                               <Gift size={18} />
                            </div>
                            <div className="flex flex-col">
                               <span className="font-bold text-gray-800 text-sm">Bonus: "Parent's Cheat Sheet" PDF</span>
                               <span className="text-[10px] text-orange-500 font-black uppercase">Instant Download</span>
                            </div>
                         </div>
                         <span className="text-gray-400 font-bold decoration-red-400 line-through decoration-2">$47</span>
                      </div>

                       {/* Bonus 2 */}
                       <div className="flex justify-between items-center group">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                               <Gift size={18} />
                            </div>
                            <div className="flex flex-col">
                               <span className="font-bold text-gray-800 text-sm">Bonus: Printable Battle Cards</span>
                               <span className="text-[10px] text-blue-500 font-black uppercase">Offline Fun</span>
                            </div>
                         </div>
                         <span className="text-gray-400 font-bold decoration-red-400 line-through decoration-2">$29</span>
                      </div>
                   </div>
                   
                   {/* Total Calculation */}
                   <div className="border-t-2 border-dashed border-gray-200 pt-4 flex justify-between items-end">
                      <div className="text-right w-full">
                         <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Total Value: $273.00</div>
                         <div className="flex items-center justify-end gap-3">
                            <span className="text-5xl font-black text-[#4CAF50] text-3d">$37</span>
                            <span className="text-sm font-bold text-gray-400">one-time</span>
                         </div>
                      </div>
                   </div>

                   {/* CTA */}
                   <Button onClick={onCheckout} variant="primary" className="w-full text-xl py-6 h-auto shadow-green-500/30 animate-pulse-slow">
                      {buttonText}
                   </Button>

                   {/* TELEMETRY DISCLAIMER (PIONEER FRAME) */}
                   <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex gap-3 items-start">
                       <Activity size={24} className="text-indigo-500 shrink-0 mt-1" />
                       <div className="text-left">
                           <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-1">
                               Why is this 80% off?
                           </p>
                           <p className="text-xs text-indigo-900 font-medium leading-tight">
                               We are collecting anonymous gameplay data to train our AI. By joining the Founder's Batch, you agree to share usage stats (telemetry) in exchange for this discount.
                           </p>
                       </div>
                   </div>

                   {/* Guarantee Badge */}
                   <div className="flex items-center justify-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <Shield size={16} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-500">30-Day "Better Grades" Guarantee</span>
                   </div>

                </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-90 {
            transform: rotateY(90deg);
        }
        .rotate-x-90 {
            transform: rotateX(90deg);
        }
        @keyframes pulse-slow {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 2s infinite;
        }
      `}</style>
    </section>
  );
};
