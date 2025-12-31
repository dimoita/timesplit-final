
import React, { useState } from 'react';
import { ArrowLeft, Users, Copy, Check, Gift, Shield, Zap, Crosshair, Share2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useGameSound } from '../hooks/useGameSound';

interface SquadronCenterProps {
  onBack: () => void;
  referralCode: string;
  recruitsCount: number;
  onRedeemCode: (code: string) => boolean; // Returns success
}

export const SquadronCenter: React.FC<SquadronCenterProps> = ({ onBack, referralCode, recruitsCount, onRedeemCode }) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const { playCorrect, playWin, playDamage } = useGameSound();

  const handleCopy = () => {
    navigator.clipboard.writeText(`Use meu código de Agente "${referralCode}" no TimeSplit para ganhar 500 Moedas grátis! 🚀`);
    setCopied(true);
    playCorrect();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareNative = async () => {
      const text = `Preciso de reforços no TimeSplit! Use meu código de Agente "${referralCode}" para começar com 500 Moedas e me ajudar a desbloquear o Dragão! 🐉`;
      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'Convite para o Esquadrão TimeSplit',
                  text: text,
                  url: window.location.href
              });
          } catch (err) {}
      } else {
          handleCopy();
      }
  };

  const handleRedeem = () => {
      if (!inputCode) return;
      const success = onRedeemCode(inputCode);
      if (success) {
          setRedeemStatus('SUCCESS');
          playWin();
          setInputCode('');
      } else {
          setRedeemStatus('ERROR');
          playDamage();
          setTimeout(() => setRedeemStatus('IDLE'), 2000);
      }
  };

  const REWARDS = [
      { count: 1, reward: '500 Moedas', icon: '💰', unlocked: recruitsCount >= 1 },
      { count: 3, reward: 'Escudo de Titânio', icon: '🛡️', unlocked: recruitsCount >= 3 },
      { count: 5, reward: 'Pet Dragão (Raro)', icon: '🐉', unlocked: recruitsCount >= 5 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 font-nunito flex flex-col relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)]"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Base
            </button>
            <div className="flex items-center gap-2 text-blue-400">
                <Users size={24} />
                <span className="font-black uppercase tracking-wider text-sm">Central do Esquadrão</span>
            </div>
        </div>

        <main className="flex-1 p-6 max-w-2xl mx-auto w-full overflow-y-auto">
            
            {/* HERO CARD */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-center text-white shadow-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Crosshair size={120} /></div>
                
                <h2 className="text-3xl font-black uppercase tracking-tight mb-2 relative z-10">Recrute Agentes</h2>
                <p className="text-blue-100 font-bold text-sm mb-6 relative z-10 max-w-sm mx-auto">
                    A batalha é difícil demais para lutar sozinho. Convide amigos para o seu esquadrão e ganhem recompensas juntos.
                </p>

                <div className="bg-black/30 rounded-2xl p-4 border border-white/10 mb-6 relative z-10">
                    <div className="text-[10px] uppercase font-black tracking-widest text-blue-300 mb-1">Seu Código de Acesso</div>
                    <div className="text-4xl font-mono font-black tracking-widest text-white mb-2">{referralCode}</div>
                    <div className="text-[10px] font-bold text-blue-200">Envie este código para um amigo.</div>
                </div>

                <div className="flex gap-3 justify-center relative z-10">
                    <Button onClick={handleShareNative} className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg">
                        <Share2 size={18} className="mr-2" /> Convidar (Ganhe 500 <Zap size={10} fill="currentColor" className="inline"/>)
                    </Button>
                </div>
            </div>

            {/* PROGRESS TRACKER */}
            <div className="mb-10">
                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <Gift size={14} className="text-yellow-400" /> Recompensas de Recrutamento
                </h3>
                
                <div className="space-y-4">
                    {REWARDS.map((r, i) => (
                        <div key={i} className={`relative p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${r.unlocked ? 'bg-green-500/10 border-green-500/50' : 'bg-slate-800 border-slate-700'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${r.unlocked ? 'bg-green-500 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-slate-900 border-slate-600 grayscale opacity-50'}`}>
                                {r.icon}
                            </div>
                            <div className="flex-1">
                                <div className={`font-black uppercase text-sm ${r.unlocked ? 'text-green-400' : 'text-slate-400'}`}>
                                    {r.count} {r.count === 1 ? 'Recruta' : 'Recrutas'}
                                </div>
                                <div className="text-white font-bold text-lg leading-none">{r.reward}</div>
                            </div>
                            {r.unlocked ? (
                                <div className="bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">Coletado</div>
                            ) : (
                                <div className="text-slate-500 text-xs font-bold"><Lock size={14} /></div>
                            )}
                            
                            {/* Connector Line */}
                            {i < REWARDS.length - 1 && (
                                <div className={`absolute left-10 top-16 w-1 h-6 ${r.unlocked && REWARDS[i+1].unlocked ? 'bg-green-500' : 'bg-slate-700'} -z-10`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* REDEEM SECTION */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <Shield size={14} className="text-blue-400" /> Já tem um código?
                </h3>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={inputCode}
                        onChange={(e) => { setInputCode(e.target.value.toUpperCase()); setRedeemStatus('IDLE'); }}
                        placeholder="CÓDIGO DO AMIGO"
                        maxLength={10}
                        className="flex-1 bg-slate-900 border-2 border-slate-600 rounded-xl px-4 text-white font-mono font-bold tracking-widest focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                    />
                    <button 
                        onClick={handleRedeem}
                        disabled={!inputCode || redeemStatus === 'SUCCESS'}
                        className={`px-6 rounded-xl font-black uppercase text-sm transition-all ${
                            redeemStatus === 'SUCCESS' ? 'bg-green-500 text-white' : 
                            redeemStatus === 'ERROR' ? 'bg-red-500 text-white' :
                            'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                    >
                        {redeemStatus === 'SUCCESS' ? <Check size={20} /> : redeemStatus === 'ERROR' ? <span className="text-xs">Inválido</span> : 'Resgatar'}
                    </button>
                </div>
                {redeemStatus === 'SUCCESS' && (
                    <p className="text-green-400 text-xs font-bold mt-2 text-center animate-pulse">+500 Moedas Adicionadas!</p>
                )}
            </div>

        </main>
    </div>
  );
};
