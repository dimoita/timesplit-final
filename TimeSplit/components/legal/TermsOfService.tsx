
import React, { useEffect } from 'react';
import { X, FileText, AlertTriangle, CreditCard, Scale } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfService: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl h-[85vh] rounded-2xl shadow-2xl relative flex flex-col overflow-hidden animate-pop-in border border-gray-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                 <FileText size={20} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">Terms of Service</h2>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Last Updated: October 24, 2024</p>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
           >
              <X size={24} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 text-sm leading-relaxed text-slate-600 space-y-8 font-medium">
           
           <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold mb-6">
              By creating an account or purchasing access to TimeSplit ("Service"), you agree to be bound by these Terms. If you do not agree, please do not use the Service.
           </div>

           <section>
              <h3 className="text-slate-900 font-black text-lg mb-3 flex items-center gap-2">
                 <Scale size={18} className="text-slate-400" /> 1. License Grant
              </h3>
              <p>
                TimeSplit Education Inc. grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the Application strictly for your personal, non-commercial use on devices owned or controlled by you.
              </p>
           </section>

           <section>
              <h3 className="text-slate-900 font-black text-lg mb-3 flex items-center gap-2">
                 <CreditCard size={18} className="text-slate-400" /> 2. Payments & Refunds
              </h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                 <li><strong>Payment Processing:</strong> All financial transactions are processed securely via <strong>Hotmart</strong>. We do not store your financial details.</li>
                 <li><strong>30-Day Money-Back Guarantee:</strong> We offer a 30-day satisfaction guarantee. If you are not satisfied with the product, you may request a full refund within 30 days of the purchase date via the Hotmart platform or by contacting our support.</li>
                 <li><strong>One-Time Payment:</strong> The "Lifetime Access" fee is a one-time charge. There are no recurring monthly subscription fees for the core product.</li>
              </ul>
           </section>

           <section className="bg-amber-50 p-5 rounded-xl border border-amber-100">
              <h3 className="text-amber-900 font-black text-lg mb-2 flex items-center gap-2">
                 <AlertTriangle size={18} /> 3. Parental Responsibility
              </h3>
              <p className="text-amber-800 mb-2">
                This Service is intended for use by children but <strong>must be purchased and managed by an adult</strong> (parent or legal guardian).
              </p>
              <p className="text-amber-800">
                You are responsible for maintaining the confidentiality of your account login information and for all activities that occur under your account.
              </p>
           </section>

           <section>
              <h3 className="text-slate-900 font-black text-lg mb-3">4. "Lifetime Access" Definition</h3>
              <p>
                "Lifetime Access" refers to the lifetime of the TimeSplit product availability, not the lifetime of the user. We guarantee access to the Service for as long as the product is commercially available and supported.
              </p>
              <p className="mt-2 text-xs text-slate-400 italic">
                In the unlikely event that we discontinue the Service, we will provide at least 90 days' notice to all active users.
              </p>
           </section>

           <section>
              <h3 className="text-slate-900 font-black text-lg mb-3">5. Disclaimer of Educational Results</h3>
              <p>
                TimeSplit is an educational tool designed to assist in learning mathematics. While our methods are based on cognitive science, we do not guarantee specific academic results, grades, or proficiency levels, as these depend on the individual student's effort and usage consistency.
              </p>
           </section>

           <section>
              <h3 className="text-slate-900 font-black text-lg mb-3">6. Governing Law</h3>
              <p>
                These Terms shall be governed by and defined following the laws of the United States. TimeSplit Education Inc. and yourself irrevocably consent that the courts of the United States shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
              </p>
           </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
           >
              I Agree & Accept
           </button>
        </div>

      </div>
    </div>
  );
};
