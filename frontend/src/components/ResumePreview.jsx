import React, { useRef, useEffect, useState } from 'react';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';

const templatesMap = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  professional: ProfessionalTemplate,
};

const ResumePreview = ({ data }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const templateId = data.templateId || 'modern';
  const ActiveTemplate = templatesMap[templateId] || ModernTemplate;

  // Auto scale handler to fit preview in split screen
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const targetWidth = 800; // Matches standard template width
        if (containerWidth < targetWidth) {
          setScale(containerWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };

    // Initial scale check
    handleResize();

    // Attach resize observer for smooth scaling
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [data.templateId]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden flex justify-center items-start bg-slate-100 dark:bg-slate-900/60 p-4 rounded-3xl min-h-[500px] border border-slate-200/50 dark:border-slate-800/50 print:bg-white print:p-0 print:border-none print:rounded-none"
    >
      {/* Wrapper to handle scaling */}
      <div 
        className="resume-preview-container origin-top transition-transform duration-200 print:scale-100 print:transform-none"
        style={{
          transform: `scale(${scale})`,
          width: '800px',
          marginBottom: `calc((800px * ${scale}) - 800px)` // Offset bottom gap created by scale scaling
        }}
      >
        <div id="resume-print-area">
          <ActiveTemplate data={data} />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
