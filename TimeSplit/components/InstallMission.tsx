
import React, { useState, useEffect } from 'react';
import { X, Share, PlusSquare, Download, Smartphone, Zap, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

export const InstallMission: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if already installed (Standalone Mode)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    if (checkStandalone) return;

    // 2. Check Cooldown (24h)
    const lastDismissed = localStorage.getItem('install_mission_dismissed');
    if (lastDismissed) {
        const diff = Date.now() - parseInt(lastDismissed);
        if (diff < 24 * 60 * 60 * 1000) return; 
    }

    // 3. Detect Platform
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // 4. Capture Android Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a slight delay for better UX
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, trigger visibility based on timer if not standalone
    if (ios) {
        setTimeout(() => setIsVisible(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('install_mission_dismissed', Date.now().toString());
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end pointer-events-none font-nunito">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto transition-opacity duration-500 animate-in fade-in" 
        onClick={handleDismiss}
      ></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-auto p-4 animate-slide-up pointer-events-auto">
        <div className="bg-[#0f172a] border-t-4 border-indigo-500 rounded-t-[2rem] rounded-b-xl shadow-2xl overflow-hidden relative ring-1 ring-white/10">

            {/* Header / Mission Brief */}
            <div className="p-6 pb-4 bg-gradient-to-b from-indigo-900/50 to-slate-900 border-b border-white/5 relative">
                <button 
                    onClick={handleDismiss} 
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full p-1"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-pulse shadow-lg shadow-indigo-500/30">
                        <Smartphone className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-black uppercase tracking-wider text-sm mb-1">Mission: Secure Uplink</h3>
                        <p className="text-indigo-300 text-xs font-bold leading-tight">Install App to access full protocol.</p>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full text-green-400 text-[10px] font-black uppercase tracking-wide">
                    <Zap size={12} fill="currentColor" /> Reward: +500 Splitz Pending
                </div>
            </div>

            {/* Instructions */}
            <div className="p-6 bg-slate-900">
                {isIOS ? (
                    <div className="space-y-5">
                        <p className="text-slate-300 text-sm font-bold leading-relaxed text-center">
                            To save your progress permanently, enable the <span className="text-white">Neural Link</span>.
                        </p>
                        
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <Share size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-bold text-sm">1. Tap "Share"</div>
                                    <div className="text-slate-500 text-xs font-medium">Located at bottom of screen</div>
                                </div>
                            </div>
                            <div className="w-full h-px bg-slate-700/50"></div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center text-gray-300 group-hover:bg-white group-hover:text-black transition-colors">
                                    <PlusSquare size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-bold text-sm">2. "Add to Home Screen"</div>
                                    <div className="text-slate-500 text-xs font-medium">Scroll down to find it</div>
                                </div>
                            </div>
                        </div>

                        {/* Bouncing Arrow pointing down */}
                        <div className="flex flex-col items-center pt-2 animate-bounce">
                            <span className="text-[10px] uppercase font-black text-indigo-400 tracking-widest mb-1">Tap Below</span>
                            <ChevronDown className="text-indigo-500 w-6 h-6" strokeWidth={3} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-slate-300 text-sm font-bold mb-6 leading-relaxed">
                            Initialize the <span className="text-indigo-400">Offline Interface</span> for lag-free gameplay and instant loading.
                        </p>
                        <Button
                            onClick={handleInstallClick}
                            className="w-full h-16 text-lg bg-indigo-600 hover:bg-indigo-500 border-indigo-800 shadow-indigo-500/30 animate-pulse flex items-center justify-center gap-2"
                        >
                            <Download className="mr-1" /> INSTALL SYSTEM
                        </Button>
                    </div>
                )}
            </div>

        </div>
      </div>

      <style>{`
        @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
