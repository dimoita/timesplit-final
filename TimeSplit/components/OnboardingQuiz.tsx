
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { X, ChevronRight, Brain, Calculator, Zap, Trophy, User, Check, Loader2, Hand, AlertTriangle, Clock } from 'lucide-react';

interface QuizData {
  name: string;
  villain: string;
  avatar: string;
}

interface OnboardingQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: QuizData) => void;
}

export const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizData>({ name: '', villain: '', avatar: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) { // Increased steps
      setStep(step + 1);
    } else {
      // Finish Step
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        onComplete(data);
      }, 3000); 
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Renders for each step
  const renderStep = () => {
    if (isAnalyzing) {
      return (
        <div className="text-center py-10 px-4">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Loader2 className="w-10 h-10 text-[#4F46E5] animate-spin" />
            <div className="absolute inset-0 border-4 border-[#4F46E5]/20 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Analyzing Learning Profile...</h3>
          <p className="text-gray-500 font-bold animate-pulse">Building custom curriculum for {data.name}</p>
          
          <div className="mt-8 max-w-xs mx-auto space-y-4 text-sm font-bold text-gray-400 text-left">
             <div className="flex items-center gap-2 text-[#4CAF50] animate-pop-in" style={{animationDelay: '0s'}}>
                <Check size={16} /> <span className="text-gray-600">Checking cognitive retention patterns...</span>
             </div>
             <div className="flex items-center gap-2 text-[#4CAF50] animate-pop-in" style={{animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards'}}>
                <Check size={16} /> <span className="text-gray-600">Calibrating "Inverse Division" difficulty...</span>
             </div>
             <div className="flex items-center gap-2 text-[#4CAF50] animate-pop-in" style={{animationDelay: '1.6s', opacity: 0, animationFillMode: 'forwards'}}>
                <Check size={16} /> <span className="text-gray-600">Optimizing dopamine reward schedule...</span>
             </div>
             <div className="flex items-center gap-2 text-[#4CAF50] animate-pop-in" style={{animationDelay: '2.4s', opacity: 0, animationFillMode: 'forwards'}}>
                <Check size={16} /> <span className="text-gray-600">Finalizing 30-Day Mastery Path...</span>
             </div>
          </div>
        </div>
      );
    }

    switch (step) {
      case 1: // Name
        return (
          <div className="space-y-6 animate-pop-in">
            <div className="text-center">
               <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 inline-block">Step 1 of 4</span>
               <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Who is the future genius?</h3>
               <p className="text-gray-500 font-bold">We'll personalize their dashboard.</p>
            </div>
            
            <div className="max-w-xs mx-auto">
               <input 
                 type="text" 
                 placeholder="Enter child's first name..." 
                 className="w-full text-center text-xl font-bold p-4 border-4 border-gray-200 rounded-2xl focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 transition-all placeholder:text-gray-300"
                 value={data.name}
                 onChange={(e) => setData({...data, name: e.target.value})}
                 autoFocus
               />
            </div>
            
            <div className="pt-4">
               <Button 
                  className="w-full text-lg h-14" 
                  disabled={!data.name.trim()} 
                  onClick={handleNext}
               >
                  Next Step <ChevronRight className="ml-1" />
               </Button>
            </div>
          </div>
        );

      case 2: // Villain
        return (
          <div className="space-y-6 animate-pop-in">
             <div className="text-center">
               <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 inline-block">Step 2 of 4</span>
               <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Who is the biggest villain?</h3>
               <p className="text-gray-500 font-bold">What struggles do you want to fix?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
               {[
                 { id: 'tables', label: 'Times Tables (6, 7, 8, 9)', icon: <Calculator className="w-5 h-5"/> },
                 { id: 'division', label: 'Division & Logic', icon: <Brain className="w-5 h-5"/> },
                 { id: 'focus', label: 'Focus / ADHD Struggles', icon: <Zap className="w-5 h-5"/> },
                 { id: 'all', label: 'All of the above', icon: <Trophy className="w-5 h-5"/> }
               ].map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setData({...data, villain: opt.id})}
                   className={`flex items-center gap-4 p-4 rounded-2xl border-[3px] transition-all text-left group ${
                     data.villain === opt.id 
                       ? 'border-[#4F46E5] bg-[#EEF2FF]' 
                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                   }`}
                 >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                        data.villain === opt.id ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-white text-gray-400 border-gray-200'
                    }`}>
                       {opt.icon}
                    </div>
                    <span className={`text-lg font-black ${data.villain === opt.id ? 'text-[#4F46E5]' : 'text-gray-700'}`}>
                       {opt.label}
                    </span>
                    {data.villain === opt.id && <Check className="ml-auto text-[#4F46E5]" />}
                 </button>
               ))}
            </div>

            <div className="pt-4 flex gap-3">
               <button onClick={handleBack} className="px-6 font-bold text-gray-400 hover:text-gray-600">Back</button>
               <Button className="flex-1 text-lg h-14" disabled={!data.villain} onClick={handleNext}>
                  Continue <ChevronRight className="ml-1" />
               </Button>
            </div>
          </div>
        );

      case 3: // THE PARENTAL CONTRACT (New Step)
        return (
          <div className="space-y-6 animate-pop-in">
             <div className="text-center">
               <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 inline-block">Step 3 of 4</span>
               <div className="flex justify-center mb-4">
                   <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                       <Clock className="w-10 h-10 text-orange-600" />
                   </div>
               </div>
               <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">The "Stop" Protocol</h3>
               <p className="text-gray-600 font-bold max-w-sm mx-auto leading-relaxed">
                   We deliberately <strong>LOCK the app</strong> after 15 minutes of campaign play daily.
               </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
                <p className="text-sm font-medium text-orange-900">
                    <strong className="block text-orange-700 uppercase text-xs mb-1">Neuroscience Fact:</strong>
                    Learning happens during sleep consolidation, not during binging. We prioritize long-term retention over screen time addiction.
                </p>
            </div>

            <div className="pt-4 flex gap-3">
               <button onClick={handleBack} className="px-6 font-bold text-gray-400 hover:text-gray-600">Back</button>
               <Button className="flex-1 text-lg h-14" onClick={handleNext}>
                  I Agree (It's for their good) <ChevronRight className="ml-1" />
               </Button>
            </div>
          </div>
        );

      case 4: // Avatar
        return (
          <div className="space-y-6 animate-pop-in">
             <div className="text-center">
               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 inline-block">Step 4 of 4</span>
               <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Choose their character</h3>
               <p className="text-gray-500 font-bold">They can change this later.</p>
            </div>

            <div className="flex justify-center gap-4 py-4">
               {['🚀', '🦄', '🦁', '🤖'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setData({...data, avatar: emoji})}
                    className={`w-16 h-16 md:w-20 md:h-20 text-4xl flex items-center justify-center rounded-2xl border-4 transition-all transform hover:scale-110 ${
                       data.avatar === emoji 
                       ? 'border-[#4CAF50] bg-green-50 shadow-[0_4px_0_#2E7D32] -translate-y-1' 
                       : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                     {emoji}
                  </button>
               ))}
            </div>
             
             <div className="text-center text-sm font-bold text-gray-400">
               {data.avatar ? `Selected: ${data.avatar}` : 'Pick an icon above'}
             </div>

            <div className="pt-4 flex gap-3">
               <button onClick={handleBack} className="px-6 font-bold text-gray-400 hover:text-gray-600">Back</button>
               <Button className="flex-1 text-lg h-14" disabled={!data.avatar} onClick={handleNext}>
                  Build Plan <ChevronRight className="ml-1" />
               </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e1b4b]/80 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border-[6px] border-gray-900/10">
          
          {/* Progress Bar */}
          {!isAnalyzing && (
            <div className="h-2 bg-gray-100 w-full">
               <div 
                  className="h-full bg-[#4F46E5] transition-all duration-300 ease-out"
                  style={{ width: `${(step / 4) * 100}%` }}
               ></div>
            </div>
          )}

          {/* Close Button (only if not analyzing) */}
          {!isAnalyzing && (
             <button 
               onClick={onClose}
               className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
             >
                <X size={24} strokeWidth={3} />
             </button>
          )}

          <div className="p-6 md:p-10">
             {renderStep()}
          </div>
       </div>
    </div>
  );
};
