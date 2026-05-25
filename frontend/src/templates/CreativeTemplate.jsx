import React from 'react';

const CreativeTemplate = ({ data }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [], languages = [], customSections = [] } = data;

  return (
    <div className="bg-white shadow-lg max-w-[800px] min-h-[1050px] mx-auto overflow-hidden border border-slate-100 flex flex-col md:flex-row print:border-none print:shadow-none print:min-h-0">
      
      {/* Left Sidebar (Colored Column) */}
      <div className="w-full md:w-[280px] bg-slate-900 text-slate-100 p-8 flex flex-col justify-between print:w-[260px] print:bg-slate-900 print:text-white">
        <div>
          {/* Header Branding */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-white leading-tight">{personalInfo.name || 'Your Name'}</h1>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-1.5">{personalInfo.title || 'Professional Title'}</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1">Contact</h2>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {personalInfo.email && (
                <li className="break-all">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Email</span>
                  {personalInfo.email}
                </li>
              )}
              {personalInfo.phone && (
                <li>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Phone</span>
                  {personalInfo.phone}
                </li>
              )}
              {personalInfo.location && (
                <li>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Location</span>
                  {personalInfo.location}
                </li>
              )}
              {personalInfo.website && (
                <li className="break-all">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Web</span>
                  <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">{personalInfo.website}</a>
                </li>
              )}
              {personalInfo.github && (
                <li>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">GitHub</span>
                  {personalInfo.github}
                </li>
              )}
              {personalInfo.linkedin && (
                <li>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">LinkedIn</span>
                  {personalInfo.linkedin}
                </li>
              )}
            </ul>
          </div>

          {/* Key Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span 
                    key={skill._id || idx} 
                    className="inline-block text-[10px] bg-slate-800 text-slate-100 border border-slate-700 px-2 py-0.5 rounded font-medium"
                  >
                    {skill.name} {skill.level ? `(${skill.level})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1 mb-2.5">Languages</h2>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {languages.map((lang, idx) => (
                  <li key={lang._id || idx} className="flex justify-between">
                    <span>{lang.language}</span>
                    <span className="text-emerald-400 text-[10px] font-semibold uppercase">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Footer brand */}
        <div className="text-[10px] text-slate-500 mt-8 pt-4 border-t border-slate-800">
          Generated via Resume Builder
        </div>
      </div>

      {/* Right Column (Content Details) */}
      <div className="flex-1 p-8 md:p-12 text-slate-700">
        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="mb-6 print-page-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">About Me</h2>
            <p className="text-xs leading-relaxed text-slate-600">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-8 print-page-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b-2 border-slate-100 pb-1 mb-4">Experience</h2>
            <div className="space-y-5">
              {experience.map((exp, idx) => (
                <div key={exp._id || idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>{exp.company}</span>
                    <span className="font-normal text-slate-400 text-[11px]">{exp.location}</span>
                  </div>
                  {exp.description && (
                    <p className="text-xs leading-relaxed text-slate-500 whitespace-pre-line mt-1.5">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8 print-page-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b-2 border-slate-100 pb-1 mb-4">Education</h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={edu._id || idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>{edu.institution}</span>
                    <span className="font-normal text-slate-400 text-[11px]">{edu.location}</span>
                  </div>
                  {edu.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Projects */}
        {projects.length > 0 && (
          <div className="mb-8 print-page-break">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b-2 border-slate-100 pb-1 mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={proj._id || idx} className="border border-slate-100 p-3 rounded-lg bg-slate-50 hover:bg-slate-100/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-xs">{proj.name}</h3>
                    {proj.technologies && (
                      <p className="text-[9px] uppercase tracking-wider text-emerald-600 font-semibold">{proj.technologies}</p>
                    )}
                    {proj.description && (
                      <p className="text-[11px] leading-relaxed text-slate-500 mt-1">{proj.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 text-[10px] text-emerald-600 mt-2 font-medium">
                    {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>}
                    {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" className="hover:underline">Demo</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections.length > 0 && (
          <div className="space-y-4 print-page-break">
            {customSections.map((sec, idx) => (
              <div key={sec._id || idx}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 border-b-2 border-slate-100 pb-1 mb-2">
                  {sec.sectionTitle}
                </h2>
                <p className="text-xs leading-relaxed text-slate-500 whitespace-pre-line">{sec.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CreativeTemplate;
