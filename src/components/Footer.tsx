import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-200 mt-auto py-8">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-stone-400 text-xs mt-2">
          © {currentYear} The Mindful Log
        </p>
      </div>
    </footer>
  );
};
