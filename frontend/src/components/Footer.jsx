import React from 'react';
import { FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 py-8 no-print transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand details */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-600 rounded-lg text-white">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 font-display">
            Elevate<span className="text-primary-500">CV</span>
          </span>
        </div>

        {/* Copy note */}
        <div className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-right">
          &copy; {new Date().getFullYear()} ElevateCV. All rights reserved. Crafted for professionals.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
