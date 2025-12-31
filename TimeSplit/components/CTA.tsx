import React from 'react';
import { Button } from './ui/Button';

interface CTAProps {
  onStartQuiz: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onStartQuiz }) => {
  return (
    <section className="w-full bg-[#4CAF50] py-20 relative overflow-hidden">
       {/* Background Patterns */}
       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <h3 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight text-3d">
          Give Your Child the Gift of <br/>Multiplication Confidence
        </h3>
        <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto font-bold">
           For less than the cost of a single tutoring session, you can fix the "math struggle" forever.
        </p>
        <div>
          <Button variant="secondary" className="text-[#4CAF50] font-black text-xl px-12 py-6 h-auto w-[90%] max-w-xs mx-auto md:w-auto md:max-w-none hover:bg-white hover:text-[#388E3C] border-b-[6px] border-black/20" onClick={onStartQuiz}>
            Get Lifetime Access for $37
          </Button>
          <div className="mt-6 flex items-center justify-center gap-2 text-green-100 font-bold text-sm uppercase tracking-wide opacity-80">
             <span>🛡️ 30-day "Results or Refund" Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};