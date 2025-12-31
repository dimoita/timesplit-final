
import React, { useEffect, useState } from 'react';
import { X, Trophy, Shield, ChevronUp, ChevronDown, Minus, Crown, Medal, Swords, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabaseClient';

export interface Rival {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isUser: boolean;
  division: string;
}

interface LeagueState {
  division: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  rivals: Rival[];
  expiresAt: number;
}

interface LeagueStandingsProps {
  leagueState?: LeagueState; // Optional now as we fetch real data
  onClose: () => void;
  onChallenge: (rival: Rival) => void;
  currentUserId?: string;
}

const DIVISION_CONFIG: any = {
  'BRONZE': { color: 'text-amber-700', bg: 'bg-amber-900/20', border: 'border-amber-700', icon: Shield },
  'SILVER': { color: 'text-slate-300', bg: 'bg-slate-400/20', border: 'border-slate-400', icon: Shield },
  'GOLD': { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500', icon: Trophy },
  'PLATINUM': { color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500', icon: Trophy },
  'DIAMOND': { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500', icon: Crown },
};

export const LeagueStandings: React.FC<LeagueStandingsProps> = ({ onClose, onChallenge, currentUserId }) => {
  const [rivals, setRivals] = useState<Rival[]>([]);
  const [loading, setLoading] = useState(true);
  const [userDivision, setUserDivision] = useState('BRONZE');

  // Fetch Real Data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!supabase) {
          // Fallback Offline Mock
          setRivals([
              { id: '1', name: 'Offline Hero', avatar: '🦖', score: 1500, isUser: true, division: 'BRONZE' },
              { id: '2', name: 'Bot Alpha', avatar: '🤖', score: 1200, isUser: false, division: 'BRONZE' },
              { id: '3', name: 'Bot Beta', avatar: '👾', score: 900, isUser: false, division: 'BRONZE' }
          ]);
          setLoading(false);
          return;
      }

      const { data, error } = await supabase
        .from('leaderboard')
        .select('user_id, nickname, avatar, score, division')
        .order('score', { ascending: false })
        .limit(50);

      if (data) {
        const mapped = data.map((row: any) => ({
            id: row.user_id,
            name: row.nickname,
            avatar: row.avatar,
            score: row.score,
            division: row.division,
            isUser: currentUserId ? row.user_id === currentUserId : false
        }));
        
        setRivals(mapped);
        
        const currentUserRow = mapped.find((r: Rival) => r.isUser);
        if (currentUserRow) setUserDivision(currentUserRow.division);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [currentUserId]);

  const config = DIVISION_CONFIG[userDivision] || DIVISION_CONFIG['BRONZE'];
  
  // Auto-scroll to user
  useEffect(() => {
      if (!loading) {
          setTimeout(() => {
              const userEl = document.getElementById('user-row');
              if (userEl) userEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
      }
  }, [loading]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
        
        {/* HEADER */}
        <div className={`p-6 pb-8 text-center relative overflow-hidden border-b border-white/10 ${config.bg}`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-20">
                <X size={24} />
            </button>

            <div className="relative z-10 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full border-4 ${config.border} flex items-center justify-center mb-3 bg-slate-900 shadow-lg`}>
                    <config.icon size={32} className={config.color} />
                </div>
                <h2 className={`text-2xl font-black uppercase tracking-widest ${config.color} text-shadow-glow`}>
                    {userDivision} League
                </h2>
                <div className="mt-2 bg-black/40 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">Season Active</span>
                </div>
            </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-950 custom-scrollbar relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                </div>
            )}

            {!loading && rivals.map((rival, index) => {
                const rank = index + 1;
                const isPromo = rank <= 3;
                
                let rankColor = "text-slate-500";
                if (rank === 1) rankColor = "text-yellow-400";
                if (rank === 2) rankColor = "text-slate-300";
                if (rank === 3) rankColor = "text-amber-600";

                return (
                    <div 
                        key={rival.id}
                        id={rival.isUser ? 'user-row' : undefined}
                        className={`
                            relative flex items-center gap-4 p-3 rounded-xl border-2 transition-all
                            ${rival.isUser 
                                ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] z-10 scale-[1.02]' 
                                : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                            }
                        `}
                    >
                        {/* Zone Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl
                            ${isPromo ? 'bg-green-500' : 'bg-transparent'}
                        `}></div>

                        <div className={`w-8 font-black text-lg text-center ${rankColor}`}>{rank}</div>
                        
                        <div className="text-2xl">{rival.avatar}</div>
                        
                        <div className="flex-1 min-w-0">
                            <div className={`font-bold truncate ${rival.isUser ? 'text-white' : 'text-slate-400'}`}>
                                {rival.name} {rival.isUser && "(You)"}
                            </div>
                            <div className="text-[10px] uppercase font-black tracking-wider text-slate-600 flex items-center gap-1">
                                {isPromo && <span className="text-green-500 flex items-center"><ChevronUp size={10}/> Promoting</span>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="font-black text-white">{rival.score.toLocaleString()}</div>
                                <div className="text-[10px] font-bold text-slate-500">XP</div>
                            </div>
                            {!rival.isUser && (
                                <button 
                                    onClick={() => onChallenge(rival)}
                                    className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg shadow-lg border border-red-400 flex items-center gap-1 transition-colors"
                                    title="Challenge Rival"
                                >
                                    <Swords size={16} fill="currentColor" />
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* FOOTER: PROMO MESSAGE */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 relative z-20">
             <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase">Top 3 Promote</span>
                <span className="text-white font-black text-sm">
                    Fight for Glory!
                </span>
            </div>
        </div>

      </div>
    </div>
  );
};
