import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Code, Globe, 
  FolderGit, FileEdit, Plus, Trash2, ChevronDown, ChevronUp 
} from 'lucide-react';

const ResumeForm = ({ formData, setFormData }) => {
  const [activeSection, setActiveSection] = useState('personal');

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  // Helper: Update root values or nested personalInfo
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  // Generic Array item updater
  const handleArrayItemChange = (section, index, field, value) => {
    setFormData((prev) => {
      const updatedList = [...prev[section]];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, [section]: updatedList };
    });
  };

  // Generic Array item adder
  const addArrayItem = (section, defaultObj) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], defaultObj]
    }));
  };

  // Generic Array item remover
  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
      
      {/* 1. PERSONAL INFO SECTION */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full flex items-center justify-between p-4 font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary-500" />
            <span>Personal Information</span>
          </div>
          {activeSection === 'personal' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {activeSection === 'personal' && (
          <div className="p-4 border-t border-slate-200/30 dark:border-slate-800/30 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/20 dark:bg-slate-950/10">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.personalInfo.name || ''}
                onChange={handlePersonalInfoChange}
                placeholder="Jane Doe"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.personalInfo.title || ''}
                onChange={handlePersonalInfoChange}
                placeholder="Senior Full Stack Engineer"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.personalInfo.email || ''}
                onChange={handlePersonalInfoChange}
                placeholder="jane.doe@gmail.com"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.personalInfo.phone || ''}
                onChange={handlePersonalInfoChange}
                placeholder="+1 (555) 019-2834"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Location (City, Country)</label>
              <input
                type="text"
                name="location"
                value={formData.personalInfo.location || ''}
                onChange={handlePersonalInfoChange}
                placeholder="San Francisco, CA"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Website URL</label>
              <input
                type="text"
                name="website"
                value={formData.personalInfo.website || ''}
                onChange={handlePersonalInfoChange}
                placeholder="https://janedoe.dev"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">GitHub Profile Name</label>
              <input
                type="text"
                name="github"
                value={formData.personalInfo.github || ''}
                onChange={handlePersonalInfoChange}
                placeholder="janedoe"
                className="glass-input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">LinkedIn Username</label>
              <input
                type="text"
                name="linkedin"
                value={formData.personalInfo.linkedin || ''}
                onChange={handlePersonalInfoChange}
                placeholder="jane-doe"
                className="glass-input"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Professional Summary</label>
              <textarea
                name="summary"
                rows="3"
                value={formData.personalInfo.summary || ''}
                onChange={handlePersonalInfoChange}
                placeholder="Write a compelling executive summary..."
                className="glass-input resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. EXPERIENCE SECTION */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-4 font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary-500" />
            <span>Work Experience</span>
            <span className="text-xs font-normal text-slate-400">({formData.experience.length})</span>
          </div>
          {activeSection === 'experience' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {activeSection === 'experience' && (
          <div className="p-4 border-t border-slate-200/30 dark:border-slate-800/30 bg-white/20 dark:bg-slate-950/10 space-y-4">
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/20 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeArrayItem('experience', idx)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg border border-red-200/30 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <h4 className="text-xs font-bold text-slate-500 uppercase">Position #{idx + 1}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleArrayItemChange('experience', idx, 'company', e.target.value)}
                      placeholder="Google Inc."
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Job Title</label>
                    <input
                      type="text"
                      value={exp.position || ''}
                      onChange={(e) => handleArrayItemChange('experience', idx, 'position', e.target.value)}
                      placeholder="Software Engineer"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Location</label>
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => handleArrayItemChange('experience', idx, 'location', e.target.value)}
                      placeholder="Mountain View, CA"
                      className="glass-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => handleArrayItemChange('experience', idx, 'startDate', e.target.value)}
                        placeholder="Oct 2021"
                        className="glass-input"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">End Date</label>
                      <input
                        type="text"
                        disabled={exp.current}
                        value={exp.current ? '' : (exp.endDate || '')}
                        onChange={(e) => handleArrayItemChange('experience', idx, 'endDate', e.target.value)}
                        placeholder="Present"
                        className="glass-input disabled:opacity-40"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id={`exp-current-${idx}`}
                      checked={exp.current || false}
                      onChange={(e) => handleArrayItemChange('experience', idx, 'current', e.target.checked)}
                      className="rounded border-slate-350 dark:border-slate-800 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor={`exp-current-${idx}`} className="text-xs text-slate-600 dark:text-slate-300 font-semibold select-none">
                      I currently work here
                    </label>
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Responsibilities / Achievements</label>
                    <textarea
                      rows="3"
                      value={exp.description || ''}
                      onChange={(e) => handleArrayItemChange('experience', idx, 'description', e.target.value)}
                      placeholder="• Designed microservices architecture&#10;• Increased performance by 30%..."
                      className="glass-input resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' })}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Experience Position
            </button>
          </div>
        )}
      </div>

      {/* 3. EDUCATION SECTION */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
        <button
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between p-4 font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary-500" />
            <span>Education</span>
            <span className="text-xs font-normal text-slate-400">({formData.education.length})</span>
          </div>
          {activeSection === 'education' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {activeSection === 'education' && (
          <div className="p-4 border-t border-slate-200/30 dark:border-slate-800/30 bg-white/20 dark:bg-slate-950/10 space-y-4">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/20 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeArrayItem('education', idx)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg border border-red-200/30 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <h4 className="text-xs font-bold text-slate-500 uppercase">Degree #{idx + 1}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">School / Institution</label>
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => handleArrayItemChange('education', idx, 'institution', e.target.value)}
                      placeholder="University of California, Berkeley"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Degree</label>
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => handleArrayItemChange('education', idx, 'degree', e.target.value)}
                      placeholder="Bachelor of Science"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Field of Study</label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy || ''}
                      onChange={(e) => handleArrayItemChange('education', idx, 'fieldOfStudy', e.target.value)}
                      placeholder="Computer Science"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Location</label>
                    <input
                      type="text"
                      value={edu.location || ''}
                      onChange={(e) => handleArrayItemChange('education', idx, 'location', e.target.value)}
                      placeholder="Berkeley, CA"
                      className="glass-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate || ''}
                        onChange={(e) => handleArrayItemChange('education', idx, 'startDate', e.target.value)}
                        placeholder="Sept 2017"
                        className="glass-input"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">End Date</label>
                      <input
                        type="text"
                        disabled={edu.current}
                        value={edu.current ? '' : (edu.endDate || '')}
                        onChange={(e) => handleArrayItemChange('education', idx, 'endDate', e.target.value)}
                        placeholder="June 2021"
                        className="glass-input disabled:opacity-40"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id={`edu-current-${idx}`}
                      checked={edu.current || false}
                      onChange={(e) => handleArrayItemChange('education', idx, 'current', e.target.checked)}
                      className="rounded border-slate-350 dark:border-slate-800 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor={`edu-current-${idx}`} className="text-xs text-slate-600 dark:text-slate-300 font-semibold select-none">
                      I currently study here
                    </label>
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Additional Details (GPA, Honors, etc.)</label>
                    <textarea
                      rows="2"
                      value={edu.description || ''}
                      onChange={(e) => handleArrayItemChange('education', idx, 'description', e.target.value)}
                      placeholder="GPA 3.9/4.0, graduated with High Honors..."
                      className="glass-input resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '', current: false, description: '' })}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Education Record
            </button>
          </div>
        )}
      </div>

      {/* 4. SKILLS & LANGUAGES */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
        <button
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-4 font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary-500" />
            <span>Skills & Languages</span>
            <span className="text-xs font-normal text-slate-400">({formData.skills.length + formData.languages.length})</span>
          </div>
          {activeSection === 'skills' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {activeSection === 'skills' && (
          <div className="p-4 border-t border-slate-200/30 dark:border-slate-800/30 bg-white/20 dark:bg-slate-950/10 space-y-5">
            {/* Skills Array */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Technical / Soft Skills</h4>
              <div className="space-y-2">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={skill.name || ''}
                      onChange={(e) => handleArrayItemChange('skills', idx, 'name', e.target.value)}
                      placeholder="JavaScript, Project Management..."
                      className="glass-input flex-1"
                    />
                    <input
                      type="text"
                      value={skill.level || ''}
                      onChange={(e) => handleArrayItemChange('skills', idx, 'level', e.target.value)}
                      placeholder="Expert, Advanced"
                      className="glass-input w-28 sm:w-36"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('skills', idx)}
                      className="p-2.5 rounded-xl border border-red-200/40 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem('skills', { name: '', level: '' })}
                className="flex items-center gap-1 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Skill
              </button>
            </div>

            {/* Languages Array */}
            <div className="space-y-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Languages</h4>
              <div className="space-y-2">
                {formData.languages.map((lang, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={lang.language || ''}
                      onChange={(e) => handleArrayItemChange('languages', idx, 'language', e.target.value)}
                      placeholder="English, Spanish"
                      className="glass-input flex-1"
                    />
                    <input
                      type="text"
                      value={lang.proficiency || ''}
                      onChange={(e) => handleArrayItemChange('languages', idx, 'proficiency', e.target.value)}
                      placeholder="Native, Fluent, Conversational"
                      className="glass-input w-28 sm:w-36"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('languages', idx)}
                      className="p-2.5 rounded-xl border border-red-200/40 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem('languages', { language: '', proficiency: '' })}
                className="flex items-center gap-1 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Language
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. PROJECTS SECTION */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
        <button
          onClick={() => toggleSection('projects')}
          className="w-full flex items-center justify-between p-4 font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FolderGit className="h-4 w-4 text-primary-500" />
            <span>Key Projects</span>
            <span className="text-xs font-normal text-slate-400">({formData.projects.length})</span>
          </div>
          {activeSection === 'projects' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {activeSection === 'projects' && (
          <div className="p-4 border-t border-slate-200/30 dark:border-slate-800/30 bg-white/20 dark:bg-slate-950/10 space-y-4">
            {formData.projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/20 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeArrayItem('projects', idx)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg border border-red-200/30 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <h4 className="text-xs font-bold text-slate-500 uppercase">Project #{idx + 1}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Project Name</label>
                    <input
                      type="text"
                      value={proj.name || ''}
                      onChange={(e) => handleArrayItemChange('projects', idx, 'name', e.target.value)}
                      placeholder="E-Commerce API Service"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Technologies Used</label>
                    <input
                      type="text"
                      value={proj.technologies || ''}
                      onChange={(e) => handleArrayItemChange('projects', idx, 'technologies', e.target.value)}
                      placeholder="React, Node.js, Redux, PostgreSQL"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">GitHub Link</label>
                    <input
                      type="text"
                      value={proj.githubLink || ''}
                      onChange={(e) => handleArrayItemChange('projects', idx, 'githubLink', e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Live Demo Link</label>
                    <input
                      type="text"
                      value={proj.liveLink || ''}
                      onChange={(e) => handleArrayItemChange('projects', idx, 'liveLink', e.target.value)}
                      placeholder="https://project.live"
                      className="glass-input"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Description</label>
                    <textarea
                      rows="2"
                      value={proj.description || ''}
                      onChange={(e) => handleArrayItemChange('projects', idx, 'description', e.target.value)}
                      placeholder="Briefly describe project contributions and engineering feats..."
                      className="glass-input resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('projects', { name: '', description: '', technologies: '', githubLink: '', liveLink: '' })}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Key Project
            </button>
          </div>
        )}
      </div>

      {/* 6. CUSTOM SECTIONS */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
        <button
          onClick={() => toggleSection('custom')}
          className="w-full flex items-center justify-between p-4 font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileEdit className="h-4 w-4 text-primary-500" />
            <span>Custom Sections</span>
            <span className="text-xs font-normal text-slate-400">({formData.customSections.length})</span>
          </div>
          {activeSection === 'custom' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {activeSection === 'custom' && (
          <div className="p-4 border-t border-slate-200/30 dark:border-slate-800/30 bg-white/20 dark:bg-slate-950/10 space-y-4">
            {formData.customSections.map((sec, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/20 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeArrayItem('customSections', idx)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg border border-red-200/30 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <h4 className="text-xs font-bold text-slate-500 uppercase">Custom Section #{idx + 1}</h4>
                
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Section Title</label>
                    <input
                      type="text"
                      value={sec.sectionTitle || ''}
                      onChange={(e) => handleArrayItemChange('customSections', idx, 'sectionTitle', e.target.value)}
                      placeholder="Certifications, Volunteering, Publications"
                      className="glass-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Content / Description</label>
                    <textarea
                      rows="3"
                      value={sec.content || ''}
                      onChange={(e) => handleArrayItemChange('customSections', idx, 'content', e.target.value)}
                      placeholder="Describe detail items in full text..."
                      className="glass-input resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('customSections', { sectionTitle: '', content: '' })}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Custom Section
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ResumeForm;
