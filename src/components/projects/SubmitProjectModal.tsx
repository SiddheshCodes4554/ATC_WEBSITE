import React, { useState } from 'react';
import { X, Send, Check, Sparkles, Rocket, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('Robotics & Hardware');
  const [description, setDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 80,
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
    });
    setTimeout(() => {
      setSubmitted(false);
      setProjectName('');
      setDescription('');
      setTeamMembers('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn select-none">
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

        {/* Header */}
        <div className="space-y-2 mb-6">
          <span className="px-3 py-1 bg-[#FFE600] text-[#121316] rounded-full text-xs font-mono font-black uppercase border-2 border-[#121316] shadow-pop-sm inline-flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5" />
            ATC LAB 5.0 INVENTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
            Submit Your Project 💡
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-700">
            Got an autonomous rover, novel AI model, or custom hardware board? Submit your build to get featured and unlock Lab 502 grant support.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-[#D4F8E8] border-3 border-[#121316] text-center space-y-3 animate-fadeIn">
            <div className="text-4xl animate-bounce">🎉</div>
            <h3 className="text-2xl font-black text-[#121316]">Submission Received!</h3>
            <p className="text-sm font-bold text-gray-700">
              The ATC tech leads will review your project and invite you to present at the next Friday Demo session in Lab 502!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-mono font-black text-[#121316] mb-1 uppercase">
                Project Name *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Autonomous Campus Delivery Drone"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-[#121316] mb-1 uppercase">
                Primary Domain *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              >
                <option>Robotics & Hardware</option>
                <option>AI & Computer Vision</option>
                <option>IoT & Embedded Systems</option>
                <option>Open Source Software</option>
                <option>Web3 & Decentralized Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-[#121316] mb-1 uppercase">
                Team Members & Roll Nos *
              </label>
              <input
                type="text"
                value={teamMembers}
                onChange={(e) => setTeamMembers(e.target.value)}
                placeholder="e.g. Aarav Sharma, Tanmay Roy (2nd Year CS)"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm text-sm font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-[#121316] mb-1 uppercase">
                Short Description & Tech Stack *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Explain what the invention does, sensors used, and current build status..."
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
                <span>Submit to Lab</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
