
import React, { useState } from 'react';
import { ArrowLeft, Lock, Loader2, Sparkles, CheckCircle, AlertCircle, Mail, KeyRound } from 'lucide-react';
import { Button } from './ui/Button';
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
        setErrorMsg("Erro de configuração: Supabase não conectado. (Verifique lib/supabaseClient.ts)");
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
                    // Garante que o link no email aponte para este site
                    emailRedirectTo: window.location.origin, 
                }
            });
            
            if (error) throw error;
            
            if (data.user) {
                // Check if email confirmation is required
                // Se a sessão vier nula, o Supabase está esperando confirmação por email.
                if (data.session) {
                    onLoginSuccess();
                } else {
                    setSuccessMsg("Conta criada! Verifique seu e-mail (e Spam) ou desative a confirmação no Supabase.");
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
        // Traduz erros comuns
        let msg = err.message || "Ocorreu um erro. Tente novamente.";
        if (msg.includes("Invalid login credentials")) msg = "E-mail ou senha incorretos.";
        if (msg.includes("Email not confirmed")) msg = "E-mail não confirmado. Verifique sua caixa de entrada.";
        
        setErrorMsg(msg);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-nunito">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5]/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/20 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-pop-in">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute -top-16 left-0 text-gray-400 hover:text-white flex items-center gap-2 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} /> Voltar ao Início
        </button>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">{mode === 'LOGIN' ? 'Acesso de Membro' : 'Criar Conta'}</h2>
            <p className="text-gray-400 font-medium text-sm">
                {mode === 'LOGIN' ? 'Entre para sincronizar seu progresso.' : 'Salve o progresso do seu filho na nuvem.'}
            </p>
          </div>

          {errorMsg && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-200 text-sm font-bold animate-shake">
                  <AlertCircle size={18} /> {errorMsg}
              </div>
          )}

          {successMsg && (
              <div className="mb-6 bg-green-500/10 border border-green-500/50 p-3 rounded-xl flex items-center gap-3 text-green-200 text-sm font-bold animate-pulse">
                  <CheckCircle size={18} /> {successMsg}
              </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1"><Mail size={10}/> E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pai@exemplo.com"
                className="w-full bg-black/20 border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#4F46E5] focus:bg-black/40 transition-all font-bold text-lg"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1"><KeyRound size={10}/> Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/20 border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#4F46E5] focus:bg-black/40 transition-all font-bold text-lg"
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading || !email || !password}
              className={`
                w-full h-16 rounded-xl font-black text-lg uppercase tracking-wide transition-all relative overflow-hidden mt-2
                ${isLoading ? 'bg-[#4F46E5] cursor-wait opacity-80' : 'bg-white hover:bg-gray-50 text-[#0f172a] hover:scale-[1.02] active:scale-[0.98]'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3 text-white">
                  <Loader2 className="animate-spin" /> 
                  <span>Processando...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'LOGIN' ? 'Entrar no Sistema' : 'Criar Acesso Seguro'} <Sparkles size={18} className="text-[#4F46E5]" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
             <button 
                onClick={() => { setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-bold underline decoration-2 underline-offset-4 transition-colors"
             >
                 {mode === 'LOGIN' ? 'Não tem conta? Cadastre-se grátis' : 'Já tem conta? Faça login'}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
