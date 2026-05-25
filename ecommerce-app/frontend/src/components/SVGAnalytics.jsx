import React from 'react';

const SVGAnalytics = ({ salesData = [], categoryData = [] }) => {
  
  // 1. Line Chart Calculations: Mapped onto a 500x200 SVG Viewbox
  const padding = 30;
  const chartWidth = 500 - padding * 2;
  const chartHeight = 200 - padding * 2;

  const maxAmount = salesData.length > 0 
    ? Math.max(...salesData.map((d) => d.amount), 1000) 
    : 10000;

  // Compute point coordinates
  const points = salesData.map((d, index) => {
    const x = padding + (index * (chartWidth / (salesData.length - 1 || 1)));
    const y = padding + chartHeight - (d.amount / maxAmount * chartHeight);
    return { x, y, label: d.date, amount: d.amount };
  });

  // Assemble path command: "M x y L x y..."
  const linePath = points.length > 0 
    ? points.map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') 
    : '';

  // Assemble closed area path command
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${200 - padding} L ${points[0].x} ${200 - padding} Z`
    : '';

  // 2. Bar Chart Calculations: Mapped onto a 500x150 SVG Viewbox
  const barPadding = 40;
  const barChartWidth = 500 - barPadding * 2;
  const barChartHeight = 150 - barPadding * 2;

  const maxCount = categoryData.length > 0
    ? Math.max(...categoryData.map((d) => d.value), 5)
    : 30;

  const barWidth = 35;
  const bars = categoryData.map((d, index) => {
    const space = barChartWidth / (categoryData.length || 1);
    const x = barPadding + (index * space) + (space / 2) - (barWidth / 2);
    const height = (d.value / maxCount) * barChartHeight;
    const y = barPadding + barChartHeight - height;
    return { x, y, height, label: d.name, count: d.value };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
      
      {/* A. Sales line chart */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col gap-0.5 text-left">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Revenue Growth</h4>
          <span className="text-[10px] text-slate-400">Daily billing logs of the last 7 days</span>
        </div>

        <div className="w-full bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-2 border border-slate-200/20 dark:border-slate-800/20">
          <svg viewBox="0 0 500 200" className="w-full overflow-visible">
            {/* Definitions */}
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Helper horizontal lines */}
            <line x1={padding} y1={padding} x2={500 - padding} y2={padding} className="stroke-slate-200 dark:stroke-slate-900" strokeDasharray="3 3" />
            <line x1={padding} y1={padding + chartHeight/2} x2={500 - padding} y2={padding + chartHeight/2} className="stroke-slate-200 dark:stroke-slate-900" strokeDasharray="3 3" />
            <line x1={padding} y1={200 - padding} x2={500 - padding} y2={200 - padding} className="stroke-slate-350 dark:stroke-slate-850" />

            {/* Render Area fill */}
            {areaPath && <path d={areaPath} fill="url(#areaGrad)" className="transition-all duration-500" />}

            {/* Render Glowing line */}
            {linePath && (
              <path 
                d={linePath} 
                fill="none" 
                stroke="url(#lineGrad)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                className="transition-all duration-500"
              />
            )}

            {/* Render Point circles and markers */}
            {points.map((p, idx) => (
              <g key={idx} className="group/pt cursor-pointer">
                {/* Visual Circle */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="5" 
                  className="fill-primary-500 stroke-white dark:stroke-slate-950 stroke-2 group-hover/pt:r-7 transition-all duration-200" 
                />
                {/* Value tooltip */}
                <text 
                  x={p.x} 
                  y={p.y - 12} 
                  textAnchor="middle" 
                  className="text-[9px] font-extrabold fill-slate-850 dark:fill-white font-sans opacity-0 group-hover/pt:opacity-100 transition-opacity bg-slate-900"
                >
                  ${p.amount}
                </text>
                {/* Date axis label */}
                <text 
                  x={p.x} 
                  y={200 - padding + 15} 
                  textAnchor="middle" 
                  className="text-[9px] font-bold fill-slate-400 font-sans"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* B. Category Breakdown bar chart */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col gap-0.5 text-left">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Inventory Distribution</h4>
          <span className="text-[10px] text-slate-400">Products catalogue quantities by category</span>
        </div>

        <div className="w-full bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-2 border border-slate-200/20 dark:border-slate-800/20">
          <svg viewBox="0 0 500 150" className="w-full overflow-visible">
            {/* Grid Line base */}
            <line x1={barPadding} y1={150 - barPadding} x2={500 - barPadding} y2={150 - barPadding} className="stroke-slate-350 dark:stroke-slate-850" />

            {/* Render Bars */}
            {bars.map((b, idx) => (
              <g key={idx} className="group/bar cursor-pointer">
                {/* Rounded Bar Pillar */}
                <rect
                  x={b.x}
                  y={b.y}
                  width={barWidth}
                  height={b.height}
                  rx="6"
                  className="fill-primary-500/80 hover:fill-primary-500 transition-all duration-300"
                />
                {/* Quantity value marker */}
                <text
                  x={b.x + barWidth / 2}
                  y={b.y - 8}
                  textAnchor="middle"
                  className="text-[9px] font-extrabold fill-slate-800 dark:fill-white font-sans opacity-0 group-hover/bar:opacity-100 transition-opacity"
                >
                  {b.count} items
                </text>
                {/* Category label */}
                <text
                  x={b.x + barWidth / 2}
                  y={150 - barPadding + 14}
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-slate-400 font-sans truncate max-w-[80px]"
                >
                  {b.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

    </div>
  );
};

export default SVGAnalytics;
