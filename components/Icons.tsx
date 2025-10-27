
import React from 'react';

export const HandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 18h-2.5a4.5 4.5 0 0 1-4.5-4.5V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v0" />
    <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
    <path d="M10 10.5a1.5 1.5 0 0 1 3 0v1.5" />
    <path d="M7 10.5a1.5 1.5 0 0 1 3 0v1.5" />
    <path d="M6 13.5a1.5 1.5 0 0 1 3 0v6a1.5 1.5 0 0 1-3 0v-6Z" />
    <path d="M6 3v10.5a6 6 0 0 1-6 6" />
  </svg>
);

export const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

export const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2z"></path><path d="M22 2L20 7"></path><path d="M2 22L4 17"></path></svg>
);

export const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5v.5a4.5 4.5 0 0 0-4.5 4.5v0a4.5 4.5 0 0 0 4.5 4.5v.5a4.5 4.5 0 1 0 9 0v-.5a4.5 4.5 0 0 0 4.5-4.5v0a4.5 4.5 0 0 0-4.5-4.5v-.5A4.5 4.5 0 0 0 12 2z"></path><path d="M3 12h1.5"></path><path d="M19.5 12H21"></path><path d="M12 3V1.5"></path><path d="M12 22.5V21"></path><path d="M9 7.5a2.5 2.5 0 0 1 5 0"></path><path d="M9 16.5a2.5 2.5 0 0 0 5 0"></path><circle cx="12" cy="12" r="2.5"></circle></svg>
);

export const RabbitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 16a3 3 0 0 1-3-3 3 3 0 0 1 3-3"></path><path d="M18 12h.01"></path><path d="M18 21h-8a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4h8"></path><path d="M18 9V7a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v2"></path><path d="M14 9V7a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v2"></path><path d="M6 17v-1a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"></path></svg>
);
