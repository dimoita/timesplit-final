import React, { useState, useEffect } from 'react';
import { X, Share, PlusSquare, Download, Smartphone } from 'lucide-react';
import { Button } from './ui/Button';

export const InstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;
    
    if (isStandalone) return;

    // Check if dismissed previously
    const hasDismissed = localStorage.getItem('timeSplit_install_dismissed');
    if (hasDismissed) return;

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Capture install prompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a delay to not be annoying immediately
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, just show after delay if on mobile
    if (isIOSDevice) {
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
    localStorage.setItem('timeSplit_install_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] animate-slide-up">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl flex flex-col gap-4 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#312E81] rounded-xl flex items-center justify-center shadow-lg border border-white/10 shrink-0">
             <span className="text-white text-2xl font-black italic">T</span>
          </div>
          <div className="flex-1">
             <h3 className="text-white font-black text-lg leading-tight mb-1">Install App</h3>
             <p className="text-slate-400 text-xs font-bold leading-relaxed">
               Add TimeSplit to your home screen for full screen gameplay and better performance.
             </p>
          </div>
        </div>

        {isIOS ? (
          <div className="bg-white/10 rounded-xl p-3 border border-white/5 flex items-center justify-around text-white text-xs font-bold">
             <div className="flex flex-col items-center gap-1">
                <Share size={20} className="text-blue-400" />
                <span>1. Tap Share</span>
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <div className="flex flex-col items-center gap-1">
                <PlusSquare size={20} className="text-gray-300" />
                <span>2. Add to Home</span>
             </div>
          </div>
        ) : (
          <Button 
            onClick={handleInstallClick}
            className="w-full bg-[#4CAF50] hover:bg-[#43A047] border-green-700 text-white shadow-lg animate-pulse"
          >
             <Download size={18} className="mr-2" /> Install Now
          </Button>
        )}

      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};