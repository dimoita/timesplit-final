
import React, { useState } from 'react';
import { ArrowLeft, Printer, Lock, FileText, Scroll, Image as ImageIcon, Grid, Award, GraduationCap, Share2, Check, Download, ShoppingBag, Copy, QrCode } from 'lucide-react';
import { Button } from './ui/Button';

interface PrintableHQProps {
  childName?: string;
  childAvatar?: string;
  villain?: string;
  unlockedLevel: number;
  onBack: () => void;
  hasOfflineKit?: boolean;
  onUnlock?: () => void;
}

type DocType = 'CONTRACT' | 'POSTER' | 'CARDS' | 'CERTIFICATE' | 'CHEATSHEET';

export const PrintableHQ: React.FC<PrintableHQProps> = ({ 
  childName = "Future Genius", 
  childAvatar = "🚀", 
  villain = "👾",
  unlockedLevel, 
  onBack,
  hasOfflineKit = false,
  onUnlock
}) => {
  const [activeTab, setActiveTab] = useState<DocType>('CONTRACT');
  const [showCopied, setShowCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
      // US Culture: Focus on effort/confidence ("MathConfidence") rather than just "Genius"
      const shareText = `So proud of ${childName} for mastering the 15-Minute Protocol! Hard work pays off. #MathConfidence 🚀`;
      const url = window.location.href;
      
      if (navigator.share) {
          try {
              await navigator.share({
                  title: `${childName}'s Math Milestone`,
                  text: shareText,
                  url: url
              });
          } catch (err) {
              // Ignore abort errors
          }
      } else {
          navigator.clipboard.writeText(`${shareText} ${url}`);
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 2000);
      }
  };

  const isCertUnlocked = unlockedLevel >= 10;

  // --- DOCUMENT TEMPLATES (Rendered for Print) ---
  
  const ContractTemplate = () => (
    <div className="w-full h-full p-8 border-[10px] border-double border-gray-800 flex flex-col items-center text-center font-serif text-black bg-white">
        <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center text-5xl mb-6">
            🛡️
        </div>
        <h1 className="text-5xl font-black uppercase tracking-widest mb-4">Official Oath</h1>
        <div className="w-full h-1 bg-black mb-1"></div>
        <div className="w-full h-0.5 bg-black mb-12"></div>

        <p className="text-2xl leading-relaxed max-w-2xl mb-12">
            I, <span className="font-handwriting text-4xl border-b-2 border-black px-4">{childName}</span>, <br/>
            also known as the <strong>{childAvatar} Guardian</strong>, <br/><br/>
            Do hereby solemnly promise to protect the universe from the Math Villains by training for <strong>15 minutes every day</strong>.
        </p>

        <p className="text-2xl leading-relaxed max-w-2xl mb-16">
            I will not give up when it gets hard.<br/>
            I will use my brain power to grow stronger.<br/>
            I will master the numbers.
        </p>

        <div className="flex justify-between w-full max-w-3xl mt-auto mb-12">
            <div className="flex flex-col items-center gap-2">
                <div className="w-64 h-0.5 bg-black"></div>
                <span className="text-sm font-bold uppercase tracking-widest">Hero's Signature</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-64 h-0.5 bg-black"></div>
                <span className="text-sm font-bold uppercase tracking-widest">Commander's Witness</span>
            </div>
        </div>

        <div className="text-xs font-mono uppercase tracking-widest opacity-50">
            Authorized by TimeSplit HQ • Top Secret Clearance
        </div>
    </div>
  );

  const PosterTemplate = () => (
    <div className="w-full h-full p-4 border-[20px] border-black bg-white flex flex-col items-center text-center text-black">
        <h1 className="text-[120px] leading-none font-black uppercase tracking-tighter mb-4 mt-8" style={{fontFamily: 'Impact, sans-serif'}}>WANTED</h1>
        <div className="text-2xl font-bold uppercase tracking-widest mb-8">For Crimes Against Logic</div>
        
        <div className="w-full max-w-md aspect-square border-4 border-black mb-8 flex items-center justify-center bg-gray-100 relative overflow-hidden">
            <div className="text-[200px]">{villain}</div>
            <div className="absolute bottom-4 bg-black text-white px-4 py-1 font-black text-xl uppercase -rotate-2">The Number Cruncher</div>
        </div>

        <div className="text-4xl font-bold mb-4">REWARD</div>
        <div className="text-8xl font-black text-black mb-8 flex items-center gap-4">
            <span>5,000</span> <span className="text-4xl">SPLITZ</span>
        </div>

        <p className="text-xl font-bold max-w-lg border-t-4 border-b-4 border-black py-4">
            If seen, do not panic. Use the <br/>"Tri-Link Technique" to defeat immediately.
        </p>
    </div>
  );

  const FlashcardsTemplate = () => (
    <div className="w-full h-full bg-white text-black p-8">
        <div className="text-center mb-8 border-b-2 border-dashed border-gray-300 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-widest">Tactical Battle Cards</h2>
            <p className="text-sm text-gray-500">Cut along dotted lines • Fold in half</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            {[
                {q: "7 x 8", a: "56"}, {q: "6 x 7", a: "42"},
                {q: "8 x 9", a: "72"}, {q: "4 x 8", a: "32"},
                {q: "56 ÷ 7", a: "8"}, {q: "42 ÷ 6", a: "7"},
            ].map((card, i) => (
                <div key={i} className="border-2 border-dashed border-gray-400 p-4 h-48 flex">
                    <div className="flex-1 border-r border-gray-200 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-gray-400 uppercase mb-2">Front</span>
                        <span className="text-4xl font-black">{card.q}</span>
                        <div className="mt-4 text-2xl">{villain}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                        <span className="text-xs font-bold text-gray-400 uppercase mb-2">Back</span>
                        <span className="text-4xl font-black text-green-600">{card.a}</span>
                        <div className="mt-4 text-2xl">{childAvatar}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const CertificateTemplate = () => (
    <div className="w-full h-full p-12 border-[20px] border-[#daa520] bg-white text-black flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 border-4 border-black m-4"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Award size={400} />
        </div>

        <div className="relative z-10 mt-12 flex-1 flex flex-col items-center">
            <h1 className="text-6xl font-black uppercase tracking-widest text-[#daa520] mb-4 text-shadow-sm">Certificate of Mastery</h1>
            <p className="text-xl italic font-serif text-gray-600 mb-12">This certifies that</p>
            
            <div className="text-7xl font-black font-handwriting mb-8 text-black border-b-4 border-black inline-block px-12 pb-2">
                {childName}
            </div>

            <p className="text-2xl font-serif text-gray-800 max-w-3xl mx-auto leading-relaxed mb-16">
                Has successfully completed the <strong>TimeSplit Protocol</strong> and demonstrated elite proficiency in Multiplication and Division facts.
            </p>

            <div className="flex justify-between w-full max-w-4xl mx-auto items-end mt-auto">
                <div className="text-center">
                    <div className="w-64 h-0.5 bg-black mb-2"></div>
                    <p className="text-sm font-bold uppercase tracking-widest">Date</p>
                </div>
                
                <div className="w-32 h-32 rounded-full border-4 border-[#daa520] flex items-center justify-center text-[#daa520]">
                    <div className="w-24 h-24 rounded-full border-2 border-[#daa520] flex items-center justify-center">
                        <Award size={48} />
                    </div>
                </div>

                <div className="text-center">
                    <div className="font-handwriting text-2xl mb-1">Sensei AI</div>
                    <div className="w-64 h-0.5 bg-black mb-2"></div>
                    <p className="text-sm font-bold uppercase tracking-widest">Head Instructor</p>
                </div>
            </div>
            
            {/* Viral QR Code for "Fridge Traffic" */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-50">
                <div className="text-right">
                    <div className="text-[10px] font-black uppercase">Parents: Scan to Unlock</div>
                    <div className="text-[8px] font-bold">Curriculum for your child</div>
                </div>
                <div className="bg-black text-white p-1">
                    <QrCode size={40} />
                </div>
            </div>
        </div>
    </div>
  );

  const CheatSheetTemplate = () => (
    <div className="w-full h-full p-8 bg-white text-black flex flex-col font-sans">
        <div className="border-b-4 border-indigo-600 pb-4 mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter text-indigo-900">Parent's Cheat Sheet</h1>
                <p className="text-lg font-bold text-gray-500">Secret Weapons for Homework Hour</p>
            </div>
            <div className="text-right">
                <div className="font-black text-2xl text-gray-300">CONFIDENTIAL</div>
            </div>
        </div>

        <div className="space-y-8">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 relative">
                <div className="absolute -top-4 left-6 bg-white px-2 font-black text-xl text-indigo-600 uppercase">#1 The Magic 9s</div>
                <p className="mb-4 font-bold text-gray-600">The sum of the digits for any multiple of 9 (up to 90) always equals 9.</p>
                <div className="flex justify-around items-center text-center">
                    <div>
                        <div className="text-3xl font-black">9 × 4 = <span className="text-indigo-600">36</span></div>
                        <div className="text-sm font-bold text-gray-400 mt-1">3 + 6 = 9</div>
                    </div>
                    <div className="text-4xl text-gray-300">→</div>
                    <div>
                        <div className="text-3xl font-black">9 × 8 = <span className="text-indigo-600">72</span></div>
                        <div className="text-sm font-bold text-gray-400 mt-1">7 + 2 = 9</div>
                    </div>
                </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 relative">
                <div className="absolute -top-4 left-6 bg-white px-2 font-black text-xl text-indigo-600 uppercase">#2 The Double-Double (x4)</div>
                <p className="mb-4 font-bold text-gray-600">If they know how to double, they know their 4s. Just double the number, then double the result.</p>
                <div className="flex items-center justify-center gap-4">
                    <div className="text-4xl font-black">6</div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Double It</span>
                        <span className="text-2xl text-gray-300">→</span>
                    </div>
                    <div className="text-4xl font-black">12</div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Double It</span>
                        <span className="text-2xl text-gray-300">→</span>
                    </div>
                    <div className="text-5xl font-black text-indigo-600">24</div>
                </div>
                <p className="text-center mt-2 font-bold text-sm text-gray-400">(So 6 × 4 = 24)</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 relative">
                <div className="absolute -top-4 left-6 bg-white px-2 font-black text-xl text-indigo-600 uppercase">#3 The Zero Hero (x10)</div>
                <p className="mb-4 font-bold text-gray-600">Don't calculate. Just attach a zero.</p>
                <div className="text-center">
                    <span className="text-5xl font-black">7</span>
                    <span className="text-3xl font-bold text-gray-400 mx-4">+</span>
                    <span className="text-5xl font-black text-indigo-600 border-2 border-indigo-600 rounded-lg px-2">0</span>
                    <span className="text-3xl font-bold text-gray-400 mx-4">=</span>
                    <span className="text-5xl font-black">7<span className="text-indigo-600">0</span></span>
                </div>
            </div>
        </div>

        <div className="mt-auto pt-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
            Provided by TimeSplit • For Parents Only
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-nunito flex flex-col">
      {/* --- PRINTABLE CONTENT (HIDDEN ON SCREEN) --- */}
      <div className="hidden print:block print:w-screen print:h-screen print:absolute print:top-0 print:left-0 print:bg-white print:z-[9999]">
         {activeTab === 'CONTRACT' && <ContractTemplate />}
         {activeTab === 'POSTER' && <PosterTemplate />}
         {activeTab === 'CARDS' && <FlashcardsTemplate />}
         {activeTab === 'CERTIFICATE' && <CertificateTemplate />}
         {activeTab === 'CHEATSHEET' && <CheatSheetTemplate />}
      </div>

      {/* --- SCREEN UI --- */}
      <div className="print:hidden flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-20">
             <div className="flex items-center gap-4">
                <button onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <ArrowLeft size={20} className="text-slate-400" />
                </button>
                <div>
                    <h1 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                        <FileText className="text-teal-400" size={24} /> 
                        <span className="text-white">Secret Files</span>
                    </h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Secret // Authorized Only</p>
                </div>
             </div>
             <div className="bg-teal-900/30 border border-teal-500/30 px-3 py-1 rounded text-teal-400 text-xs font-mono font-bold">
                 SECURE CONNECTION
             </div>
          </header>

          <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Sidebar Navigation */}
              <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                  {[
                      { id: 'CONTRACT', label: "Guardian Oath", icon: Scroll, locked: false }, // Free sample
                      { id: 'POSTER', label: "Wanted Poster", icon: ImageIcon, locked: !hasOfflineKit },
                      { id: 'CARDS', label: "Battle Cards", icon: Grid, locked: !hasOfflineKit },
                      { id: 'CHEATSHEET', label: "Parent's Guide", icon: GraduationCap, locked: !hasOfflineKit },
                      { id: 'CERTIFICATE', label: "Mastery Diploma", icon: Award, locked: !isCertUnlocked || !hasOfflineKit }
                  ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => !item.locked && setActiveTab(item.id as DocType)}
                        disabled={item.locked && !hasOfflineKit} 
                        className={`
                            flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left relative group
                            ${activeTab === item.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                            ${item.locked && !hasOfflineKit ? 'opacity-70 cursor-not-allowed hover:bg-transparent' : ''}
                        `}
                      >
                          <item.icon size={20} />
                          <div className="flex-1">
                              <div className="text-sm font-bold leading-none mb-1">{item.label}</div>
                              {item.locked && !hasOfflineKit && <div className="text-[10px] uppercase font-black tracking-wider text-yellow-500 flex items-center gap-1"><Lock size={8}/> Kit Required</div>}
                              {item.locked && hasOfflineKit && <div className="text-[10px] uppercase font-black tracking-wider text-red-400 flex items-center gap-1"><Lock size={8}/> Lvl 10 Req</div>}
                          </div>
                          {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white absolute right-3 animate-pulse"></div>}
                      </button>
                  ))}
              </aside>

              {/* Preview Area */}
              <div className="flex-1 bg-slate-950 relative flex flex-col items-center justify-center p-8 overflow-y-auto">
                  
                  {/* Digital Twin Preview (Scaled Down) */}
                  <div className="relative shadow-2xl shadow-black border-8 border-slate-800 rounded-sm bg-white overflow-hidden max-w-full max-h-[60vh] aspect-[1/1.414] origin-center transform transition-transform duration-500 hover:scale-[1.02]">
                      <div className="w-[210mm] h-[297mm] origin-top-left transform scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.7]">
                          {activeTab === 'CONTRACT' && <ContractTemplate />}
                          {activeTab === 'POSTER' && <PosterTemplate />}
                          {activeTab === 'CARDS' && <FlashcardsTemplate />}
                          {activeTab === 'CERTIFICATE' && <CertificateTemplate />}
                          {activeTab === 'CHEATSHEET' && <CheatSheetTemplate />}
                      </div>
                      
                      {/* Overlay Glare */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                      
                      {/* LOCK OVERLAY */}
                      {!hasOfflineKit && activeTab !== 'CONTRACT' && (
                          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 z-50">
                              <div className="bg-yellow-500 text-black p-4 rounded-full mb-4 shadow-lg animate-bounce">
                                  <Lock size={32} />
                              </div>
                              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Restricted File</h3>
                              <p className="text-slate-300 font-bold mb-6 max-w-xs">
                                  This document is part of the "Offline Emergency Kit".
                              </p>
                              {onUnlock && (
                                  <Button onClick={onUnlock} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider px-8 py-4 h-auto shadow-xl animate-pulse">
                                      Unlock Kit - $14
                                  </Button>
                              )}
                          </div>
                      )}
                  </div>

                  {/* Action Bar - Culturally Updated */}
                  <div className="mt-8 flex flex-col items-center gap-4">
                      <p className="text-slate-400 text-sm font-bold max-w-md text-center">
                          {activeTab === 'CONTRACT' && "Sign this with your child to build commitment."}
                          {activeTab === 'POSTER' && "Hang this on the fridge to keep the mission alive."}
                          {activeTab === 'CARDS' && "Print and cut for offline training in the car."}
                          {activeTab === 'CERTIFICATE' && "The ultimate reward for completing the protocol."}
                          {activeTab === 'CHEATSHEET' && "The secret 'Parents Only' guide to instant math tricks."}
                      </p>
                      
                      <div className="flex gap-4">
                          <Button 
                            onClick={handlePrint} 
                            disabled={!hasOfflineKit && activeTab !== 'CONTRACT'}
                            className={`w-48 h-14 text-lg border-teal-700 shadow-teal-500/20 ${(!hasOfflineKit && activeTab !== 'CONTRACT') ? 'bg-slate-700 text-slate-500 border-slate-800 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-400 animate-pulse'}`}
                          >
                              <Printer className="mr-2" /> Print for Fridge
                          </Button>
                          {activeTab === 'CERTIFICATE' && (
                              <Button onClick={handleShare} className="w-48 h-14 text-lg bg-blue-600 hover:bg-blue-500 border-blue-800 shadow-blue-500/30">
                                  {showCopied ? <><Check className="mr-2" /> COPIED</> : <><Share2 className="mr-2" /> Share Family Update</>}
                              </Button>
                          )}
                      </div>
                  </div>

              </div>

          </main>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        .font-handwriting { font-family: 'Permanent Marker', cursive; }
      `}</style>
    </div>
  );
};
