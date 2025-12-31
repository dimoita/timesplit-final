import React from 'react';
import { Button } from './ui/Button';

export const WhyChoose: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4 text-3d">
            Why It Works
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 font-bold max-w-2xl mx-auto">
            We don't just "teach math". We hacked the engagement loop.
          </p>
        </div>

        <div className="grid gap-12 lg:gap-10 md:grid-cols-3">
          
          {/* Pillar 1 */}
          <div className="bg-[#F8FAFC] border-[3px] border-slate-200 border-b-[8px] p-8 rounded-[2rem] relative hover:-translate-y-2 transition-transform duration-300 group">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 border-slate-100 group-hover:scale-110 transition-transform">🧠</div>
            </div>
            <div className="pt-10 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-3">The "Dopamine" Engine</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-bold">
                    Our <b>Smart-Repeat System™</b> identifies weak spots and turns them into "Boss Battles". Mastery without boredom.
                </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#FFFBF0] border-[3px] border-orange-200 border-b-[8px] p-8 rounded-[2rem] relative hover:-translate-y-2 transition-transform duration-300 group md:mt-8 lg:mt-0">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 border-orange-100 group-hover:scale-110 transition-transform">🎮</div>
            </div>
            <div className="pt-10 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-3">Gamified Mastery</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-bold">
                    Worksheets are boring. Saving the universe is epic. Kids earn gems and badges, making them <i>want</i> to play daily.
                </p>
            </div>
          </div>

           {/* Pillar 3 */}
           <div className="bg-[#F0FDF4] border-[3px] border-green-200 border-b-[8px] p-8 rounded-[2rem] relative hover:-translate-y-2 transition-transform duration-300 group md:mt-16 lg:mt-0">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 border-green-100 group-hover:scale-110 transition-transform">🕊️</div>
            </div>
            <div className="pt-10 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-3">Peace at Home</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-bold">
                    No more yelling. Just 15 minutes of independent play, and you get your evenings back.
                </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};