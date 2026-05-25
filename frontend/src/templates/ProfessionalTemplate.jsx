import React from 'react';

const ProfessionalTemplate = ({ data }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [], languages = [], customSections = [] } = data;

  return (
    <div className="p-10 md:p-12 bg-white text-slate-900 font-serif shadow-lg max-w-[800px] min-h-[1050px] mx-auto border border-slate-100 print:border-none print:shadow-none print:p-0">
      {/* Centered Executive Header */}
      <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-normal uppercase">{personalInfo.name || 'Your Name'}</h1>
        <p className="text-sm font-semibold text-slate-600 tracking-wider uppercase mt-1">{personalInfo.title || 'Professional Title'}</p>
        
        {/* Contact Links */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-600 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| &nbsp; {personalInfo.phone}</span>}
          {personalInfo.location && <span>| &nbsp; {personalInfo.location}</span>}
          {personalInfo.website && (
            <span>
              | &nbsp; <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline">{personalInfo.website}</a>
            </span>
          )}
          {personalInfo.github && <span>| &nbsp; github.com/{personalInfo.github}</span>}
          {personalInfo.linkedin && <span>| &nbsp; linkedin.com/in/{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6 font-sans print-page-break">
          <p className="text-xs leading-relaxed text-slate-700 text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6 print-page-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-3 font-sans">Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx} className="space-y-1">
                <div className="flex justify-between items-baseline font-sans">
                  <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                  <span className="text-xs text-slate-600 font-semibold">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 font-semibold font-sans italic">
                  <span>{exp.company}</span>
                  <span className="font-normal text-slate-500">{exp.location}</span>
                </div>
                {exp.description && (
                  <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6 print-page-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-3 font-sans">Education</h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={edu._id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-sans">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </h3>
                  <span className="text-xs text-slate-600 font-semibold">
                    {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 font-semibold font-sans italic">
                  <span>{edu.institution}</span>
                  <span className="text-slate-500">{edu.location}</span>
                </div>
                {edu.description && (
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6 print-page-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-2 font-sans">Technical Skills</h2>
          <p className="text-xs leading-relaxed text-slate-800">
            {skills.map((skill, idx) => (
              <span key={skill._id || idx}>
                <span className="font-bold">{skill.name}</span>
                {skill.level ? ` (${skill.level})` : ''}
                {idx < skills.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6 print-page-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-3 font-sans">Selected Projects</h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx} className="space-y-1">
                <div className="flex justify-between items-baseline font-sans">
                  <h3 className="font-bold text-slate-900 text-xs">{proj.name}</h3>
                  <span className="text-[10px] text-slate-500 font-semibold">{proj.technologies}</span>
                </div>
                {proj.description && (
                  <p className="text-xs leading-relaxed text-slate-700">{proj.description}</p>
                )}
                <div className="flex gap-2 text-[10px] text-slate-600 font-sans">
                  {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>}
                  {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" className="hover:underline">Live Link</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-6 print-page-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-2 font-sans">Languages</h2>
          <p className="text-xs text-slate-800">
            {languages.map((lang, idx) => (
              <span key={lang._id || idx}>
                <span className="font-bold">{lang.language}</span> ({lang.proficiency})
                {idx < languages.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Custom Sections */}
      {customSections.length > 0 && (
        <div className="space-y-4 print-page-break">
          {customSections.map((sec, idx) => (
            <div key={sec._id || idx}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-2 font-sans">
                {sec.sectionTitle}
              </h2>
              <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
