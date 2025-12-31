import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle } from 'lucide-react';
import { PrivacyPolicy } from './legal/PrivacyPolicy';
import { TermsOfService } from './legal/TermsOfService';

// Trust Pillar Icons (Custom SVGs for crisp look)
const TrustIcon1 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 lg:w-[44px] lg:h-[44px] mb-2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const TrustIcon2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 lg:w-[44px] lg:h-[44px] mb-2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z" strokeOpacity="0.5"></path>
  </svg>
);

const TrustIcon3 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9C27B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 lg:w-[44px] lg:h-[44px] mb-2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const TrustIcon4 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 lg:w-[44px] lg:h-[44px] mb-2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M7 14h10" />
    <path d="M7 18h6" />
  </svg>
);

// Payment Method Icons
const VisaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="h-8 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" style={{maxWidth: '52px'}}>
    <rect fill="#1434CB" width="48" height="32" rx="4"></rect>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">VISA</text>
  </svg>
);

const MasterCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="h-8 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" style={{maxWidth: '52px'}}>
    <rect fill="#222" width="48" height="32" rx="4"></rect>
    <circle cx="18" cy="16" r="7" fill="#EB001B"></circle>
    <circle cx="30" cy="16" r="7" fill="#F79E1B"></circle>
  </svg>
);

const PayPalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="h-8 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" style={{maxWidth: '52px'}}>
    <rect fill="#003087" width="48" height="32" rx="4"></rect>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif" fontStyle="italic">PayPal</text>
  </svg>
);

const ApplePayIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="h-8 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" style={{maxWidth: '52px'}}>
    <rect fill="#000000" width="48" height="32" rx="4"></rect>
    <path d="M19.3 14.5c.1 1.9 1.7 2.6 1.8 2.6-.1.6-.4 1.9-1.2 2.7-.6.7-1.3 1.3-2.3 1.3-1 0-1.6-.6-2.6-.6s-1.7.6-2.6.6c-1 0-1.8-.7-2.5-1.5C8 17.5 7.4 13.9 9.3 12c1-.9 2-.9 2.7-.9 1 0 1.6.6 2.5.6s1.5-.7 2.6-.7c.4 0 2 .2 2.8 1.4-.1.1-1.6.9-1.6 2.1zM14.6 10.9c.5-.6.8-1.4.7-2.2-.7 0-1.6.4-2.1 1-.4.5-.8 1.3-.7 2.1.8.1 1.6-.3 2.1-.9z" fill="white"></path>
    <text x="28" y="19" fill="white" fontSize="12" fontWeight="600" fontFamily="sans-serif">Pay</text>
  </svg>
);

const StripeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" className="h-8 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" style={{maxWidth: '52px'}}>
    <rect fill="#635BFF" width="48" height="32" rx="4"></rect>
    <path d="M22 13.5c0-.8.6-1.2 1.5-1.2.9 0 2 .3 2.9.8v-2.8c-1-.4-2-.6-2.9-.6-2.4 0-4 1.3-4 3.4 0 3.3 4.5 2.8 4.5 4.2 0 .5-.5.9-1.4.9-1.2 0-2.7-.5-3.9-1.2v2.9c1.1.5 2.2.8 3.9.8 2.5 0 4.2-1.2 4.2-3.4 0-3.5-4.8-2.9-4.8-4z" fill="white"></path>
  </svg>
);

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'none' | 'privacy' | 'terms'>('none');

  return (
    <footer className="w-full bg-white border-t border-gray-200 py-12 lg:py-16">
      
      {/* Legal Modals */}
      <PrivacyPolicy 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal('none')} 
      />
      <TermsOfService 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal('none')} 
      />

      <div className="max-w-7xl mx-auto px-4">
        
        {/* TRUST PILLARS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-b border-gray-100 pb-12">
            <div className="flex flex-col items-center text-center">
              <TrustIcon1 />
              <div>
                <h4 className="font-black text-gray-900 text-sm mb-1">Secure Checkout</h4>
                <p className="text-xs text-gray-500 font-medium">256-bit SSL Encrypted</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <TrustIcon2 />
              <div>
                <h4 className="font-black text-gray-900 text-sm mb-1">Data Privacy</h4>
                <p className="text-xs text-gray-500 font-medium">COPPA Compliant</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <TrustIcon3 />
              <div>
                <h4 className="font-black text-gray-900 text-sm mb-1">Lifetime Access</h4>
                <p className="text-xs text-gray-500 font-medium">No hidden monthly fees</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <TrustIcon4 />
              <div>
                <h4 className="font-black text-gray-900 text-sm mb-1">Results Guaranteed</h4>
                <p className="text-xs text-gray-500 font-medium">30-Day Money Back</p>
              </div>
            </div>
        </div>

        {/* CORPORATE SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* Brand */}
            <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-b from-[#4F46E5] to-[#312E81] rounded flex items-center justify-center">
                        <span className="text-white font-black text-xs italic">T</span>
                    </div>
                    <span className="font-black text-gray-800 tracking-tight text-lg">TIME<span className="text-indigo-600">SPLIT</span></span>
                </div>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium">
                    TimeSplit Education Inc. is a science-based educational platform designed to build automaticity in math facts through gamified repetition.
                </p>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap justify-center gap-2">
               <VisaIcon />
               <MasterCardIcon />
               <PayPalIcon />
               <ApplePayIcon />
               <StripeIcon />
            </div>
        </div>

        {/* LEGAL LINKS SECTION */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-400">
            <p>© 2024 TimeSplit Education Inc. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
                <button onClick={() => setActiveModal('privacy')} className="hover:text-indigo-600 transition-colors">Privacy Policy</button>
                <button onClick={() => setActiveModal('terms')} className="hover:text-indigo-600 transition-colors">Terms of Service</button>
                <button onClick={() => setActiveModal('privacy')} className="hover:text-indigo-600 transition-colors">COPPA Policy</button>
                <a href="mailto:support@timesplit.app" className="hover:text-indigo-600 transition-colors">Contact Support</a>
            </div>
        </div>

      </div>
    </footer>
  );
};