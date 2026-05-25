import React from 'react';

const MinimalTemplate = ({ data }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [], languages = [], customSections = [] } = data;

  return (
    <div className="p-10 md:p-14 bg-white text-slate-700 font-sans shadow-lg max-w-[800px] min-h-[1050px] mx-auto border border-slate-100 print:border-none print:shadow-none print:p-0">
      {/* Title & Contact Block */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-wide text-slate-900 uppercase">{personalInfo.name || 'Your Name'}</h1>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">{personalInfo.title || 'Professional Title'}</p>
        
        {/* Contact Links */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-4 text-[11px] text-slate-500 max-w-xl mx-auto border-t border-slate-100 pt-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• &nbsp; {personalInfo.phone}</span>}
          {personalInfo.location && <span>• &nbsp; {personalInfo.location}</span>}
          {personalInfo.website && (
            <span>
              • &nbsp; <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline text-slate-700">{personalInfo.website}</a>
            </span>
          )}
          {personalInfo.github && <span>• &nbsp; github.com/{personalInfo.github}</span>}
          {personalInfo.linkedin && <span>• &nbsp; linkedin.com/in/{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-8 print-page-break">
          <p className="text-xs leading-relaxed text-slate-600 text-center italic max-w-2xl mx-auto">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mb-8 print-page-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-4">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="text-xs font-medium text-slate-400">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </div>
                <div className="md:col-span-3 space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                  <div className="text-xs text-slate-600 font-semibold">
                    {exp.company} {exp.location ? `, ${exp.location}` : ''}
                  </div>
                  {exp.description && (
                    <p className="text-xs leading-relaxed text-slate-500 whitespace-pre-line mt-1.5">{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8 print-page-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-4">Education</h2>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={edu._id || idx} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="text-xs font-medium text-slate-400">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                </div>
                <div className="md:col-span-3 space-y-0.5">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </h3>
                  <div className="text-xs text-slate-600 font-semibold">
                    {edu.institution} {edu.location ? `, ${edu.location}` : ''}
                  </div>
                  {edu.description && (
                    <p className="text-xs leading-relaxed text-slate-500 mt-1">{edu.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Skills */}
        <div className="md:col-span-1 print-page-break">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-x-2 gap-y-1.5">
            {skills.map((skill, idx) => (
              <span key={skill._id || idx} className="text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {skill.name}
              </span>
            ))}
          </div>

          {languages.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-3">Languages</h2>
              <ul className="space-y-1 text-xs">
                {languages.map((lang, idx) => (
                  <li key={lang._id || idx} className="flex justify-between">
                    <span className="font-semibold text-slate-800">{lang.language}</span>
                    <span className="text-slate-400">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div className="md:col-span-2 print-page-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-3">Projects</h2>
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={proj._id || idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{proj.name}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">{proj.technologies}</span>
                  </div>
                  {proj.description && (
                    <p className="text-xs leading-relaxed text-slate-500">{proj.description}</p>
                  )}
                  <div className="flex gap-2 text-[10px] text-slate-500">
                    {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>}
                    {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" className="hover:underline">Live</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Sections */}
      {customSections.length > 0 && (
        <div className="mt-8 space-y-4 print-page-break">
          {customSections.map((sec, idx) => (
            <div key={sec._id || idx}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1.5 mb-2">
                {sec.sectionTitle}
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
