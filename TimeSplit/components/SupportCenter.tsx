import React, { useState, useEffect, useRef } from 'react';
import { 
  LifeBuoy, Wrench, RefreshCw, MessageSquare, Send, 
  CheckCircle, AlertCircle, ShieldCheck, ChevronRight, 
  X, Loader2, FileText, Download, HelpCircle, Lock 
} from 'lucide-react';
import { Button } from './ui/Button';
import { getSupportResponse } from '../services/GeminiService';

interface SupportCenterProps {
  onBack: () => void;
  childName?: string;
}

type ToolStatus = 'IDLE' | 'RUNNING' | 'SUCCESS';
type RefundStep = 'IDLE' | 'REASON' | 'RETENTION_OFFER' | 'PROCESSING' | 'DONE';

export const SupportCenter: React.FC<SupportCenterProps> = ({ onBack, childName = "Student" }) => {
  // --- AI CHAT STATE ---
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: `Hello! I'm the TimeSplit Support Agent. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- TOOLS STATE ---
  const [toolsState, setToolsState] = useState<Record<string, ToolStatus>>({
    sync: 'IDLE',
    restore: 'IDLE',
    cache: 'IDLE'
  });

  // --- REFUND STATE ---
  const [refundStep, setRefundStep] = useState<RefundStep>('IDLE');
  const [purchaseDate] = useState(() => {
    // Simulate a purchase date (e.g., 15 days ago for demo purposes)
    const date = new Date();
    date.setDate(date.getDate() - 15); 
    return date;
  });

  // Calculate days since purchase
  const daysSincePurchase = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
  const isRefundEligible = daysSincePurchase <= 30;

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- HANDLERS: CHAT ---
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getSupportResponse(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to the support database. Please try the Self-Repair tools on the right." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- HANDLERS: TOOLS ---
  const runTool = (tool: string) => {
    setToolsState(prev => ({ ...prev, [tool]: 'RUNNING' }));
    
    // Simulate technical operation
    setTimeout(() => {
      setToolsState(prev => ({ ...prev, [tool]: 'SUCCESS' }));
      
      // Actual logic simulation
      if (tool === 'cache') {
         // In a real app, we might clear specific keys or service workers
         console.log("Cache cleared");
      }
    }, 2000);
  };

  // --- HANDLERS: REFUND ---
  const handleRefundRequest = () => {
    setRefundStep('REASON');
  };

  const handleReasonSelect = () => {
    // Immediate deflection to retention offer
    setRefundStep('RETENTION_OFFER');
  };

  const handleAcceptBonus = () => {
    // Logic to unlock bonus content would go here
    alert("Bonus 'Offline Activities Pack' has been emailed to you!");
    setRefundStep('IDLE'); // Close flow
  };

  const handleProceedRefund = () => {
    setRefundStep('PROCESSING');
    setTimeout(() => {
      setRefundStep('DONE');
    }, 2500);
  };

  return (
    <div className="bg-slate-50 min-h-full flex flex-col font-sans text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <LifeBuoy size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Support Center</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Automated Resolution Protocol</p>
          </div>
        </div>
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full p-6 grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COL: AI AGENT (Chat) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="relative">
                   <div className="w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-0 border border-white"></div>
                   <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                      <MessageSquare size={16} />
                   </div>
                </div>
                <div>
                   <div className="text-sm font-bold text-slate-900">Support Agent</div>
                   <div className="text-xs text-slate-500">Typical reply time: Instant</div>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}`}>
                     {msg.text}
                  </div>
               </div>
             ))}
             {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 flex gap-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                   </div>
                </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
             <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your issue..."
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button type="submit" disabled={!input.trim() || isTyping} className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50">
                   <Send size={20} />
                </button>
             </form>
          </div>
        </div>

        {/* RIGHT COL: SELF-SERVICE TOOLS */}
        <div className="lg:col-span-5 space-y-6">
           
           {/* 1. SELF-HEALING */}
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                 <Wrench size={20} className="text-slate-400" />
                 <h3 className="font-black text-slate-900 uppercase tracking-wide text-sm">Self-Repair Tools</h3>
              </div>
              
              <div className="space-y-3">
                 {[
                    { id: 'sync', label: 'Force Cloud Sync', icon: RefreshCw, desc: 'Fixes data mismatch issues.' },
                    { id: 'restore', label: 'Restore Purchases', icon: ShieldCheck, desc: 'Re-applies premium status.' },
                    { id: 'cache', label: 'Clear App Cache', icon: CheckCircle, desc: 'Resolves visual glitches.' }
                 ].map(tool => (
                    <div key={tool.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-100 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${toolsState[tool.id] === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-white text-slate-500 shadow-sm'}`}>
                             {toolsState[tool.id] === 'RUNNING' ? <Loader2 size={18} className="animate-spin text-indigo-600" /> : <tool.icon size={18} />}
                          </div>
                          <div>
                             <div className="text-sm font-bold text-slate-800">{tool.label}</div>
                             <div className="text-[10px] font-bold text-slate-400">{tool.desc}</div>
                          </div>
                       </div>
                       
                       {toolsState[tool.id] === 'SUCCESS' ? (
                          <div className="text-green-500 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                             Fixed <CheckCircle size={14} />
                          </div>
                       ) : (
                          <button 
                            onClick={() => runTool(tool.id)}
                            disabled={toolsState[tool.id] === 'RUNNING'}
                            className="bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                          >
                             Run
                          </button>
                       )}
                    </div>
                 ))}
              </div>
           </div>

           {/* 2. RESOLUTION CENTER (REFUNDS) */}
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
              {/* STATUS INDICATOR */}
              <div className="absolute top-0 right-0 p-4">
                 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${isRefundEligible ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {isRefundEligible ? <ShieldCheck size={12} /> : <Lock size={12} />}
                    {isRefundEligible ? 'Protection Active' : 'Warranty Expired'}
                 </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                 <AlertCircle size={20} className="text-slate-400" />
                 <h3 className="font-black text-slate-900 uppercase tracking-wide text-sm">Resolution Center</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-6 max-w-xs">
                 Issues with billing or satisfaction? Manage your purchase status here.
              </p>

              {isRefundEligible ? (
                 <button 
                    onClick={handleRefundRequest}
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition-colors flex items-center justify-center gap-2"
                 >
                    Request Refund / Cancellation
                 </button>
              ) : (
                 <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 text-sm font-bold cursor-not-allowed border border-slate-200">
                    Contact Support (Warranty Expired)
                 </button>
              )}
           </div>

        </div>
      </div>

      {/* --- REFUND RETENTION MODALS --- */}
      {refundStep !== 'IDLE' && (
         <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            
            {/* 1. REASON SELECTION */}
            {refundStep === 'REASON' && (
               <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scale-up">
                  <h3 className="text-lg font-black text-slate-900 mb-2">We're sorry to see you go.</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6">What is the main reason for the cancellation?</p>
                  
                  <div className="space-y-3">
                     {['Technical Issues / Bugs', 'Too Difficult for Child', 'Not Using It Enough', 'Other'].map(r => (
                        <button key={r} onClick={handleReasonSelect} className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-bold text-slate-700 text-sm flex justify-between group">
                           {r} <ChevronRight className="text-slate-300 group-hover:text-indigo-500" size={16} />
                        </button>
                     ))}
                  </div>
                  <button onClick={() => setRefundStep('IDLE')} className="mt-6 w-full text-center text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider">
                     Cancel Request
                  </button>
               </div>
            )}

            {/* 2. THE "SAVE" OFFER */}
            {refundStep === 'RETENTION_OFFER' && (
               <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-scale-up">
                  <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                     <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                           <Download size={32} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Wait! Don't leave empty-handed.</h3>
                        <p className="text-indigo-100 text-sm font-medium max-w-sm mx-auto">
                           We want {childName} to succeed, even if you leave.
                        </p>
                     </div>
                  </div>
                  
                  <div className="p-8">
                     <p className="text-slate-600 font-medium mb-6 text-center text-sm leading-relaxed">
                        As a thank you for trying TimeSplit, we'd like to gift you our 
                        <strong className="text-indigo-600"> Premium Offline Activity Pack ($29 Value)</strong> for free. 
                        Yours to keep forever, no strings attached.
                     </p>

                     <div className="flex flex-col gap-3">
                        <Button onClick={handleAcceptBonus} className="w-full h-14 bg-green-600 hover:bg-green-500 border-green-800 shadow-lg text-lg">
                           Keep Account & Get Free Gift
                        </Button>
                        <button 
                           onClick={handleProceedRefund}
                           className="w-full py-4 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                           No thanks, proceed to refund
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* 3. PROCESSING */}
            {refundStep === 'PROCESSING' && (
               <div className="bg-white w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl animate-scale-up">
                  <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto mb-6" />
                  <h3 className="text-lg font-black text-slate-900 mb-2">Processing Request...</h3>
                  <p className="text-slate-500 text-sm font-medium">Connecting to banking gateway secure line.</p>
               </div>
            )}

            {/* 4. SUCCESS / DONE */}
            {refundStep === 'DONE' && (
               <div className="bg-white w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl animate-scale-up">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                     <CheckCircle size={32} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">Refund Initiated</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                     Your refund has been processed. Please allow 5-10 business days for the funds to appear on your statement.
                  </p>
                  <Button onClick={onBack} className="w-full bg-slate-900 border-slate-950">
                     Close Application
                  </Button>
               </div>
            )}

         </div>
      )}

    </div>
  );
};