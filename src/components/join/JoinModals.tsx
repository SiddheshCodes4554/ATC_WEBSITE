import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JoinModalsProps {
  activeModal: 'partner' | 'community' | null;
  onClose: () => void;
}

export const JoinModals: React.FC<JoinModalsProps> = ({ activeModal, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [extraField, setExtraField] = useState('');
  const [message, setMessage] = useState('');

  if (!activeModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 90,
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
    });

    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setExtraField('');
      setMessage('');
      onClose();
    }, 2800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#FAF7F0] rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 paper-pattern my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-[#121316] hover:bg-[#FF6B6B] hover:text-white transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <span className="px-3 py-1 bg-[#121316] text-[#FFE600] rounded-full text-xs font-mono font-black uppercase inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            PARTNERSHIP & SPEAKER INQUIRY
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
            Let’s Build Something Together 🤝
          </h2>

          <p className="text-xs sm:text-sm font-bold text-gray-700">
            Looking to sponsor a prize pool, host an industry tech talk, or collaborate on student hackathons? Reach out!
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-[#D4F8E8] border-3 border-[#121316] text-center space-y-3 animate-fadeIn">
            <div className="text-4xl animate-bounce">🎉</div>
            <h3 className="text-2xl font-black text-[#121316]">Inquiry Sent!</h3>
            <p className="text-sm font-bold text-gray-700">
              Thank you for reaching out to ATC NIAT Pune. Our outreach leads will review your inquiry shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-black text-[#121316] mb-1 uppercase">
                Your Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Yeswin Sri Datta"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-[#121316] mb-1 uppercase">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@company.com"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-[#121316] mb-1 uppercase">
                Company / Organization Name *
              </label>
              <input
                type="text"
                value={extraField}
                onChange={(e) => setExtraField(e.target.value)}
                placeholder="e.g. Google Cloud, GitHub, ACM"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-[#121316] mb-1 uppercase">
                Collaboration Proposal Details *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Describe the event, sponsorship tier, or partnership concept..."
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-white text-[#121316] border-2 border-[#121316] font-mono text-xs font-bold shadow-pop-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] border-2 border-[#121316] font-mono text-xs font-black shadow-pop hover:shadow-pop-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Submit Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
