import React from 'react';
import { Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

const steps = [
  { id: 'Processing', label: 'Processing', icon: Package },
  { id: 'Shipped', label: 'Shipped', icon: Truck },
  { id: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
];

const OrderTracker = ({ status }) => {
  const getStepIndex = (currentStatus) => {
    if (currentStatus === 'Cancelled') return -1;
    if (currentStatus === 'Processing') return 0;
    if (currentStatus === 'Shipped') return 1;
    return 2; // Delivered
  };

  const activeIndex = getStepIndex(status);

  if (status === 'Cancelled') {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-2xl flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400 font-semibold select-none">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>This order has been cancelled and cannot be tracked further.</span>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      
      {/* Tracker Diagram bar wrapper */}
      <div className="relative flex justify-between items-center max-w-lg mx-auto select-none">
        
        {/* Connecting Progress Line behind icons */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded z-0" />
        <div 
          className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-primary-600 to-indigo-500 -translate-y-1/2 rounded z-0 transition-all duration-500" 
          style={{ width: `${activeIndex === 0 ? '0%' : activeIndex === 1 ? '50%' : '100%'}` }}
        />

        {/* Steps mapping */}
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              {/* Step Icon Capsule */}
              <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-primary-600 border-primary-600 text-white scale-110 shadow-lg shadow-primary-500/25 ring-4 ring-primary-500/20'
                  : isCompleted
                    ? 'bg-gradient-to-tr from-primary-600 to-indigo-500 border-transparent text-white'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
              }`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Step Label */}
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isCurrent 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : isCompleted 
                    ? 'text-slate-800 dark:text-slate-200' 
                    : 'text-slate-400 dark:text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}

      </div>

    </div>
  );
};

export default OrderTracker;
