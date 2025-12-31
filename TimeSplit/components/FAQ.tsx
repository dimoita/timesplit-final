import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, Mail, HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';

const FAQS = [
  {
    question: "My child hates math. Will they actually play this?",
    answer: "We don't sell 'math practice'. We sell a game where they upgrade characters and defeat villains. By the time they realize they are doing math, they've already solved 50 problems. The 'dopamine loop' is designed specifically for reluctant learners."
  },
  {
    question: "Do I need to sit with them?",
    answer: "No. In fact, we prefer you don't. The 'Smart Engine' adapts to their mistakes instantly. If they get stuck, the game lowers the difficulty and teaches the pattern. You can drink your coffee in peace."
  },
  {
    question: "Is this a subscription trap?",
    answer: "Absolutely not. One payment of $37. Lifetime access. All future updates included. No hidden monthly fees, ever."
  },
  {
    question: "Does it work for ADHD / Short Attention Spans?",
    answer: "Yes. Traditional worksheets fail because they are boring and slow. TimeSplit uses 'micro-sessions' (3-5 minutes) with high visual feedback. It's built to keep the neurodivergent brain engaged and rewarded constantly."
  },
  {
    question: "What if it doesn't work?",
    answer: "Then you don't pay. See our Ironclad Guarantee below."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-20 lg:py-24 border-t border-gray-100" id="faq">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider mb-4">
               <HelpCircle size={14} />
               <span>Doubts?</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4 text-3d">
            Questions Parents Ask
            </h2>
            <p className="text-gray-500 font-bold text-lg">
                We know you've tried other apps. Here is why this is different.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
            
            {/* FAQ LIST */}
            <div className="lg:col-span-7 space-y-4">
                {FAQS.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-[#4F46E5] bg-indigo-50/30 shadow-lg' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                    >
                    <button
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                        onClick={() => handleToggle(index)}
                    >
                        <span className={`font-black text-lg ${openIndex === index ? 'text-[#4F46E5]' : 'text-gray-700'}`}>
                            {faq.question}
                        </span>
                        {openIndex === index ? (
                            <ChevronUp className="w-5 h-5 text-[#4F46E5]" strokeWidth={3} />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" strokeWidth={3} />
                        )}
                    </button>
                    
                    <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="p-5 pt-0 text-gray-600 font-medium leading-relaxed border-t border-indigo-100/50 mt-2">
                            {faq.answer}
                        </div>
                    </div>
                    </div>
                ))}
            </div>

            {/* SIDEBAR: RISK REVERSAL CARD (No Human Chat) */}
            <div className="lg:col-span-5">
                <div className="bg-[#F0FDF4] border-[3px] border-green-200 rounded-[2rem] p-8 sticky top-24 relative overflow-hidden">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-300 rounded-full blur-[50px] opacity-20 pointer-events-none"></div>

                    <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 mb-6 rotate-3">
                        <ShieldCheck size={32} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">
                        The "Sleep Well" Guarantee
                    </h3>
                    
                    <p className="text-gray-600 font-bold mb-6 text-sm leading-relaxed">
                        We are parents too. We know the risk of buying "another app". <br/><br/>
                        So here is the deal: <strong>Try TimeSplit for 30 days.</strong> If your child doesn't ask to play it, or if you don't see results, email us.
                    </p>

                    <div className="bg-white/60 rounded-xl p-4 border border-green-200 mb-6">
                        <p className="text-green-800 text-xs font-black uppercase tracking-wide text-center">
                            100% Money Back • No Questions Asked
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-bold">
                        <Mail size={14} />
                        <span>support@timesplit.app</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};