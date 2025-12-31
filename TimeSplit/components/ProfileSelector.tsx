
import React, { useState } from 'react';
import { UserPlus, Star, Trophy, ArrowRight, Lock, Shield, Cpu, ChevronRight, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Profile } from '../App';
import { OneTimeOffer } from './OneTimeOffer';

interface ProfileSelectorProps {
  profiles: Profile[];
  onSelect: (id: string) => void;
  onAddNew: () => void;
  isPremium: boolean;
  isFamilyPlan: boolean;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ profiles, onSelect, onAddNew, isPremium, isFamilyPlan }) => {
  const [showUpsell, setShowUpsell] = useState(false);

  // Logic: Allow 1 profile freely. If 1 exists, require Family Plan to add more.
  const isLocked = profiles.length >= 1 && !isFamilyPlan;

  const handleAddClick = () => {
      if (isLocked) {
          setShowUpsell(true);
      } else {
          onAddNew();
      }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-nunito flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Upsell Overlay */}
      {showUpsell && (
          <OneTimeOffer 
            onDecline={() => setShowUpsell(false)} 
            onAccept={() => {
                // The OneTimeOffer component handles the redirect.
                // We just keep the modal open or close it if needed.
            }} 
          />
      )}

      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_100%)] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Animated Scanline */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-10">
        <div className="w-full h-1 bg-cyan-400 blur-sm animate-scan-line"></div>
      </div>

      <div className="relative z-20 w-full max-w-5xl">
        <div className="text-center mb-12 animate-pop-in">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4">
            System Identity Manager
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white text-3d leading-tight">
            WHO IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">READY</span> TO TRAIN?
          </h1>
          <p className="text-slate-500 font-bold mt-2">Select your Hero profile to initiate neural uplink.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, idx) => (
            <div 
              key={profile.id}
              onClick={() => onSelect(profile.id)}
              className="group relative cursor-pointer animate-pop-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              
              <div className="relative bg-slate-900 border-2 border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center transition-all duration-300 group-hover:-translate-y-2 group-hover:border-indigo-500/50">
                <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  {profile.avatar}
                </div>
                
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-cyan-400 transition-colors">
                  {profile.name}
                </h3>

                <div className="flex gap-4 w-full mt-4 pt-4 border-t border-white/5">
                   <div className="flex-1 text-center">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Level</div>
                      <div className="text-xl font-black text-white">{profile.progress.unlockedLevel}</div>
                   </div>
                   <div className="w-px h-8 bg-white/5"></div>
                   <div className="flex-1 text-center">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stars</div>
                      <div className="text-xl font-black text-yellow-500 flex items-center justify-center gap-1">
                        {profile.progress.totalStars} <Star size={14} fill="currentColor" />
                      </div>
                   </div>
                </div>

                <div className="mt-8 w-full">
                  <Button variant="primary" className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 border-indigo-800 rounded-xl group-hover:animate-pulse">
                    Select Hero <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Slot */}
          <div 
            onClick={handleAddClick}
            className={`group relative cursor-pointer animate-pop-in ${isLocked ? 'opacity-90' : ''}`}
            style={{ animationDelay: `${profiles.length * 100}ms` }}
          >
            <div className={`relative h-full bg-slate-900/50 border-2 border-dashed ${isLocked ? 'border-yellow-500/30' : 'border-white/10'} rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-slate-800/50 hover:border-indigo-500/50`}>
              
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-slate-500 group-hover:scale-110 transition-all mb-6 ${isLocked ? 'bg-yellow-900/20 text-yellow-500' : 'bg-slate-800'}`}>
                {isLocked ? <Lock size={40} /> : <UserPlus size={40} />}
              </div>
              
              {isLocked ? (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-500/30">
                    <Lock size={10} /> Upgrade Required
                  </div>
                  <h3 className="text-xl font-black text-white/80">Add Sibling Hero</h3>
                  <p className="text-slate-400 text-xs font-bold leading-relaxed px-4">
                    Unlock Family Mode to add unlimited child profiles.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">Create New Hero</h3>
                  <p className="text-slate-500 text-xs font-bold">Start a fresh journey.</p>
                </div>
              )}

              <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className={`animate-ping ${isLocked ? 'text-yellow-500' : 'text-indigo-500'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Indicator */}
        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-6 bg-slate-900/80 border border-white/5 px-8 py-4 rounded-3xl backdrop-blur-xl">
               <div className="flex items-center gap-3">
                  <Cpu className="text-cyan-500" />
                  <div className="text-left">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Server Status</div>
                     <div className="text-xs font-bold text-white">Orbital Link Stable</div>
                  </div>
               </div>
               <div className="w-px h-8 bg-white/5"></div>
               <div className="flex items-center gap-3">
                  <Shield className="text-green-500" />
                  <div className="text-left">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Data Safety</div>
                     <div className="text-xs font-bold text-white">Local Encrypted Backup</div>
                  </div>
               </div>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan-line {
          animation: scan-line 4s linear infinite;
        }
      `}</style>
    </div>
  );
};
