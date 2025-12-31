import React from 'react';
import { Star, MessageCircle, ThumbsUp, Share2, Bell, Smartphone, MoreHorizontal } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="w-full bg-[#F1F5F9] py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Rating */}
        <div className="flex flex-col items-center mb-16 text-center">
           <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
           </div>
           <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4 text-3d">
             Real Messages. Real Results.
           </h2>
           <p className="text-gray-500 font-bold uppercase tracking-wide text-sm">
             See what happens in the family group chat.
           </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* 1. iMessage Style (The Mom Friend) */}
          <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border-[8px] border-gray-900 relative mx-auto w-full max-w-[340px]">
             {/* Phone Notch/Header */}
             <div className="flex justify-between items-center mb-6 px-2 pt-2 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Sarah" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs font-bold text-gray-900">Sarah (Leo's Mom)</div>
                </div>
                <div className="text-[10px] text-gray-400 font-bold">Today 9:41 AM</div>
             </div>

             {/* Message Body */}
             <div className="space-y-4 mb-8 font-sans">
                
                {/* Sender Name */}
                <div className="flex flex-col items-start max-w-[90%]">
                   <div className="bg-[#E9E9EB] text-black p-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm">
                      Girl, seriously. Leo just did the 7 times table without stuttering once. 😭 I'm shook. That app actually works.
                   </div>
                </div>

                {/* Reply */}
                <div className="flex flex-col items-end ml-auto max-w-[90%]">
                   <div className="bg-[#34C759] text-white p-4 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-sm">
                      Omg really?? I thought he was struggling with the 7s? Sending the link to Mike rn!
                   </div>
                   <div className="text-[10px] text-gray-400 mr-2 mt-1">Read 9:43 AM</div>
                </div>
             </div>

             {/* Fake Input */}
             <div className="bg-gray-100 rounded-full h-10 w-full flex items-center px-4 text-gray-400 text-xs mb-2 justify-between">
                <span>iMessage</span>
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">↑</div>
             </div>
          </div>

          {/* 2. Facebook Comment Style (The Teacher Authority) */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 lg:mt-12 relative">
             <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-300">
                   {/* Using a specific unsplash ID that looks like a candid teacher/dad selfie */}
                   <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Mike T" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                   <div className="bg-[#F0F2F5] rounded-2xl px-4 py-3">
                      <p className="font-bold text-gray-900 text-sm">Mike Thompson</p>
                      <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">Teacher at Lincoln Elementary <span className="w-1 h-1 bg-gray-400 rounded-full"></span> 2h</p>
                      <p className="text-gray-800 text-sm mt-1 leading-relaxed">
                         As a teacher for 15 years, I've never seen anything fix the 'division gap' this fast. They stop guessing and start understanding inverse logic. Worth every penny of the $37.
                      </p>
                   </div>
                   <div className="flex gap-4 mt-1 ml-4 text-xs font-bold text-gray-500">
                      <span className="cursor-pointer hover:underline text-blue-600">Like</span>
                      <span className="cursor-pointer hover:underline">Reply</span>
                      <span>Share</span>
                   </div>
                </div>
             </div>
             {/* Fake Reactions */}
             <div className="absolute bottom-8 right-8 bg-white rounded-full px-1 py-0.5 shadow border border-gray-100 flex items-center gap-[-4px]">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white"><ThumbsUp size={8} fill="white"/></div>
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white ml-[-4px]">❤️</div>
                <span className="text-[10px] text-gray-500 ml-1">142</span>
             </div>
          </div>

          {/* 3. Bank Notification (The ROI Logic) */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-0 shadow-2xl border border-gray-200 overflow-hidden max-w-[320px] mx-auto lg:mx-0 lg:ml-auto transform rotate-2 hover:rotate-0 transition-transform duration-300">
             <div className="bg-gray-100/50 p-3 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-2">
                   <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">W</span>
                   </div>
                   <span className="text-xs font-bold text-gray-500 uppercase">WALLET • NOW</span>
                </div>
                <MoreHorizontal size={14} className="text-gray-400" />
             </div>
             <div className="p-5">
                <div className="flex items-start gap-3">
                   <div className="mt-1 bg-green-100 p-2 rounded-full">
                      <Bell size={18} className="text-green-600" />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Savings Alert</h4>
                      <p className="text-gray-600 text-sm leading-snug">
                         You saved <span className="text-green-600 font-black">$240.00</span> this month by cancelling "Math Tutor".
                      </p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};