
import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, EyeOff, Database, Globe } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
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
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 shadow-sm border border-green-200">
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">Privacy Policy</h2>
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
           
           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900 text-xs font-bold mb-6">
              This Privacy Policy explains how TimeSplit Education Inc. ("we", "us") collects, uses, and discloses information about you. By using our Service, you consent to the data practices described in this policy.
           </div>

           <section>
              <h3 className="text-slate-900 font-black text-lg mb-3 flex items-center gap-2">
                  <EyeOff size={18} className="text-slate-400"/> 1. Children's Privacy (COPPA Compliance)
              </h3>
              <p className="mb-2">
                TimeSplit is committed to protecting the privacy of children. Although our Service is designed for children, the account creation and purchase process <strong>must be performed by a parent or legal guardian</strong>.
              </p>
              <p>
                We do not knowingly collect Personally Identifiable Information (PII) from children under the age of 13. The "Child Profiles" created within the app use nicknames and avatars only. If you believe we have inadvertently collected PII from a child, please contact us immediately for deletion.
              </p>
           </section>

           <section>
              <h3 className="text-slate-900 font-black text-lg mb-3 flex items-center gap-2">
                  <Database size={18} className="text-slate-400"/> 2. Information We Collect
              </h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500">
                 <li><strong>Parent/Guardian Data:</strong> Email address (for account authentication and receipt delivery).</li>
                 <li><strong>Usage Data (Telemetry):</strong> Game progress, levels completed, virtual currency balance, and application error logs. This data is linked to the Parent Account ID.</li>
                 <li><strong>Transaction Data:</strong> Payment confirmation status provided by Hotmart. <strong>We do not store credit card numbers</strong> or financial details on our servers.</li>
              </ul>
           </section>

           <section className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <h3 className="text-indigo-900 font-black text-lg mb-2 flex items-center gap-2">
                 <Lock size={18} /> 3. Data Security & Third Parties
              </h3>
              <p className="text-indigo-800 mb-4">
                We implement industry-standard encryption (SSL) to protect your data during transmission and storage. We use trusted third-party service providers:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold text-indigo-700">
                  <div className="bg-white/50 p-2 rounded border border-indigo-200">
                      <span className="block text-indigo-900">Supabase</span> Database & Auth Provider
                  </div>
                  <div className="bg-white/50 p-2 rounded border border-indigo-200">
                      <span className="block text-indigo-900">Hotmart</span> Payment Processing
                  </div>
              </div>
              <p className="text-indigo-800 mt-4 text-xs">
                  <strong>Zero-Ad Policy:</strong> We do not sell your data to advertisers, nor do we display third-party advertisements within the app.
              </p>
           </section>

           <section>
              <h3 className="text-slate-900 font-black text-lg mb-3 flex items-center gap-2">
                  <Globe size={18} className="text-slate-400"/> 4. Your Rights (GDPR/LGPD)
              </h3>
              <p className="mb-2">
                Regardless of your location, we extend the following rights to all users:
              </p>
              <ul className="list-disc pl-5 space-y-1 marker:text-slate-400">
                 <li><strong>Right to Access:</strong> You may request a copy of the data we hold about you.</li>
                 <li><strong>Right to Deletion ("Right to be Forgotten"):</strong> You may delete your account and all associated data directly via the "Guardian Interface" in the app, or by contacting support.</li>
                 <li><strong>Right to Correction:</strong> You may update your email address or profile settings at any time.</li>
              </ul>
           </section>

           <section>
              <h3 className="text-slate-900 font-black text-lg mb-3">5. Contact Us</h3>
              <p>
                If you have questions about this Privacy Policy, please contact our Data Protection Officer at:
                <br/>
                <a href="mailto:support@timesplit.app" className="text-indigo-600 font-bold hover:underline mt-1 inline-block">support@timesplit.app</a>
              </p>
           </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
           >
              I Understand
           </button>
        </div>

      </div>
    </div>
  );
};
