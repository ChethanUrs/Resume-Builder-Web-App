import React from 'react';

const ModernTemplate = ({ data }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [], languages = [], customSections = [] } = data;

  return (
    <div className="p-8 md:p-12 bg-white text-slate-800 font-sans shadow-lg max-w-[800px] min-h-[1050px] mx-auto border border-slate-100 print:border-none print:shadow-none print:p-0">
      {/* Header Block */}
      <div className="border-b-4 border-indigo-600 pb-6 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{personalInfo.name || 'Your Name'}</h1>
        <p className="text-lg font-medium text-indigo-600 mt-1">{personalInfo.title || 'Professional Title'}</p>
        
        {/* Contact Strip */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-xs text-slate-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-700">Email:</span> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-700">Phone:</span> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-700">Location:</span> {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-700">Web:</span> 
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{personalInfo.website}</a>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-700">GitHub:</span> {personalInfo.github}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-700">LinkedIn:</span> {personalInfo.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6 print-page-break">
          <h2 className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-slate-700">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mb-6 print-page-break">
          <h2 className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-3 border-b border-slate-200 pb-1">Work Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-sm">{exp.position || 'Position Title'}</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{exp.company || 'Company Name'}</span>
                  <span className="font-normal text-slate-500">{exp.location}</span>
                </div>
                {exp.description && (
                  <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6 print-page-break">
          <h2 className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-3 border-b border-slate-200 pb-1">Education</h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={edu._id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {edu.degree || 'Degree'} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-semibold">{edu.institution || 'School Name'}</span>
                  <span className="text-slate-500">{edu.location}</span>
                </div>
                {edu.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid for Skills, Projects & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Skills & Languages */}
        <div className="space-y-6">
          {skills.length > 0 && (
            <div className="print-page-break">
              <h2 className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-3 border-b border-slate-200 pb-1">Key Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span 
                    key={skill._id || idx} 
                    className="inline-block text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded font-medium border border-indigo-100"
                  >
                    {skill.name} {skill.level ? `(${skill.level})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="print-page-break">
              <h2 className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-3 border-b border-slate-200 pb-1">Languages</h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {languages.map((lang, idx) => (
                  <div key={lang._id || idx} className="flex justify-between pr-4">
                    <span className="font-semibold text-slate-800">{lang.language}</span>
                    <span className="text-slate-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Projects */}
        {projects.length > 0 && (
          <div className="print-page-break">
            <h2 className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-3 border-b border-slate-200 pb-1">Key Projects</h2>
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={proj._id || idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-sm">{proj.name || 'Project Name'}</h3>
                  </div>
                  {proj.technologies && (
                    <p className="text-[10px] uppercase tracking-wider text-indigo-600 font-semibold">{proj.technologies}</p>
                  )}
                  {proj.description && (
                    <p className="text-xs leading-relaxed text-slate-600">{proj.description}</p>
                  )}
                  <div className="flex gap-2 text-[10px] text-indigo-600">
                    {proj.githubLink && (
                      <a href={proj.githubLink} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                    )}
                    {proj.liveLink && (
                      <a href={proj.liveLink} target="_blank" rel="noreferrer" className="hover:underline">Live Demo</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Sections */}
      {customSections.length > 0 && (
        <div className="mt-6 space-y-4 print-page-break">
          {customSections.map((sec, idx) => (
            <div key={sec._id || idx}>
              <h2 className="text-sm font-bold tracking-wider uppercase text-indigo-600 mb-3 border-b border-slate-200 pb-1">
                {sec.sectionTitle || 'Custom Section'}
              </h2>
              <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
