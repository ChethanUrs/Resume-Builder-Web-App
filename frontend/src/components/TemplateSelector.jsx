import React from 'react';
import { Check, Columns, Feather, Layout, Award } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Sleek dark-indigo headers with a balanced timeline layout. Excellent for software engineers and office professionals.',
    icon: Layout,
    recommended: true,
  },
  {
    id: 'minimal',
    name: 'Elegant Minimal',
    description: 'Refined typography, centered layouts, and generous white space. Ideal for writers, designers, and executives.',
    icon: Feather,
    recommended: false,
  },
  {
    id: 'creative',
    name: 'Creative Sidebar',
    description: 'Bold colored sidebar column paired with a detailed timeline right side. Fits creators, marketers, and developers.',
    icon: Columns,
    recommended: false,
  },
  {
    id: 'professional',
    name: 'Classic Executive',
    description: 'Centered standard Serif layout representing standard corporate structures. Perfect for lawyers, managers, and finance experts.',
    icon: Award,
    recommended: false,
  },
];

const TemplateSelector = ({ activeTemplate, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Select Template Design</h3>
        <p className="text-xs text-slate-500">Pick a design framework. Swapping templates updates the preview instantly without data loss.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          const isActive = activeTemplate === tpl.id;

          return (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                isActive
                  ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-950/20 ring-1 ring-primary-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-900/30'
              }`}
            >
              <div>
                {/* Active check indicator or Recommended tag */}
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-xl ${
                    isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-750 transition-colors'
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  {isActive ? (
                    <span className="p-1 bg-primary-600 rounded-full text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  ) : tpl.recommended ? (
                    <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Recommended
                    </span>
                  ) : null}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tpl.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{tpl.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] text-primary-600 dark:text-primary-400 font-semibold group-hover:underline">
                {isActive ? 'Currently Active' : 'Use Template'} &rarr;
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
