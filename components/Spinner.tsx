
import React from 'react';

const Spinner: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
