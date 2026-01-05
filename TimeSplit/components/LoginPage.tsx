import React, { useState } from 'react';
import { ArrowLeft, Lock, Loader2, Sparkles, CheckCircle, AlertCircle, Mail, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!supabase) {
        setErrorMsg("Configuration Error: Supabase not connected.");
        return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
        if (mode === 'SIGNUP') {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin, 
                }
            });
            
            if (error) throw error;
            
            if (data.user) {
                if (data.session) {
                    onLoginSuccess();
                } else {
                    setSuccessMsg("Account created! Please verify your email.");
                    setMode('LOGIN');
                }
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                onLoginSuccess();
            }
        }
    } catch (err: any) {
        console.error(err);
        let msg = err.message || "An error occurred.";
        if (msg.includes("Invalid login credentials")) msg = "Invalid email or password.";
        
        setErrorMsg(msg);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-4 font-nunito animate-in fade-in duration-300">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-pop-in">
        
        <div className="bg-[#1e293b] border border-slate-700 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
          
            {/* BACK BUTTON */}
            <button 
                onClick={onBack}
                className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-bold text-xs uppercase tracking-wider group z-20"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                Back
            </button>

          <div className="text-center mb-8 relative z-10 mt-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                {mode === 'LOGIN' ? 'Member Access' : 'Create Account'}
            </h2>
            <p className="text-slate-400 font-medium text-sm">
                {mode === 'LOGIN' ? 'Log in to sync your progress.' : 'Start your math journey today.'}
            </p>
          </div>

          {errorMsg && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-200 text-sm font-bold animate-shake relative z-10">
                  <AlertCircle size={20} className="shrink-0" /> 
                  <span>{errorMsg}</span>
              </div>
          )}

          {successMsg && (
              <div className="mb-6 bg-green-500/10 border border-green-500/50 p-4 rounded-xl flex items-center gap-3 text-green-200 text-sm font-bold animate-pulse relative z-10">
                  <CheckCircle size={20} className="shrink-0" /> 
                  <span>{successMsg}</span>
              </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                  <Mail size={12}/> Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#4F46E5] focus:bg-slate-900 transition-all font-bold text-lg"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <KeyRound size={12}/> Password
                  </label>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#4F46E5] focus:bg-slate-900 transition-all font-bold text-lg"
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading || !email || !password}
              className={`
                w-full h-14 rounded-xl font-black text-lg uppercase tracking-wide transition-all relative overflow-hidden shadow-lg mt-4
                ${isLoading ? 'bg-[#4F46E5] cursor-wait opacity-80' : 'bg-white hover:bg-indigo-50 text-[#0f172a] hover:scale-[1.02] active:scale-[0.98]'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3 text-white">
                  <Loader2 className="animate-spin" /> 
                  <span>Connecting...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'LOGIN' ? 'Access Now' : 'Create Access'} <Sparkles size={18} className="text-[#4F46E5]" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center relative z-10">
             <p className="text-slate-400 text-sm mb-2">
                 {mode === 'LOGIN' ? 'Not a member yet?' : 'Already have an account?'}
             </p>
             <button 
                onClick={() => { setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-[#818cf8] hover:text-white text-base font-bold underline decoration-2 underline-offset-4 transition-colors"
             >
                 {mode === 'LOGIN' ? 'Create free account' : 'Log In'}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
