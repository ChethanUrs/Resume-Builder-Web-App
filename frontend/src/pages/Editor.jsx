import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Download, Layout, Sparkles, 
  Loader2, AlertCircle, CheckCircle, RefreshCw 
} from 'lucide-react';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const saveTimer = useRef(null);

  // States
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [showTemplates, setShowTemplates] = useState(false);

  // Fetch resume data on mount
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/resumes/${id}`);
        setFormData(res.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Resume not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  // Save changes handler to backend
  const saveResumeData = useCallback(async (dataToSave) => {
    setSaveStatus('saving');
    try {
      await axios.put(`/api/resumes/${id}`, dataToSave);
      setSaveStatus('saved');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  }, [id]);

  // Debounced Autosave Hook (2000ms delay)
  useEffect(() => {
    // Prevent autosaving on initial fetch load
    if (loading || !formData) return;

    // Clear previous save timer
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    setSaveStatus('saving');

    // Set new debounce timer
    saveTimer.current = setTimeout(() => {
      saveResumeData({
        title: formData.title,
        templateId: formData.templateId,
        personalInfo: formData.personalInfo,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
        projects: formData.projects,
        languages: formData.languages,
        customSections: formData.customSections
      });
    }, 2000);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [formData, loading, saveResumeData]);

  // Title change handler
  const handleTitleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      title: e.target.value
    }));
  };

  // Template select handler
  const handleTemplateSelect = (templateId) => {
    setFormData((prev) => ({
      ...prev,
      templateId
    }));
  };

  // Print PDF exporter
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Loading workspace tools...</span>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto animate-pulse" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Workspace Error</h2>
        <p className="text-xs text-slate-400 leading-relaxed">{error || 'Could not launch resume editor.'}</p>
        <Link
          to="/dashboard"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col justify-between">
      
      {/* Editor Control Header */}
      <div className="w-full glass border-b border-slate-200/50 dark:border-slate-800/50 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 no-print sticky top-16 z-30 transition-colors duration-300">
        
        {/* Left Side: Back & Title input */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-800 focus:border-primary-500 focus:outline-none font-bold text-base px-1 py-0.5 text-slate-800 dark:text-white max-w-[200px] sm:max-w-[280px] transition-colors"
              title="Click to rename document"
            />
            
            {/* AutoSave Badge */}
            <div className="flex items-center gap-1">
              {saveStatus === 'saved' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/20 dark:border-emerald-900/30 px-2 py-0.5 rounded-md">
                  <CheckCircle className="h-3 w-3 stroke-[2.5]" />
                  <span className="hidden sm:inline">Saved to cloud</span>
                </span>
              )}
              {saveStatus === 'saving' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/20 dark:border-amber-900/30 px-2 py-0.5 rounded-md animate-pulse">
                  <RefreshCw className="h-3 w-3 animate-spin stroke-[2.5]" />
                  <span>Saving...</span>
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200/20 dark:border-red-900/30 px-2 py-0.5 rounded-md">
                  <AlertCircle className="h-3 w-3 stroke-[2.5]" />
                  <span>Autosave failed</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Options and Export */}
        <div className="flex items-center gap-2">
          {/* Template Select Dropdown Trigger */}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
              showTemplates 
                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/20' 
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Layout className="h-4 w-4" />
            <span>Templates</span>
          </button>

          {/* Export PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 border border-transparent text-white text-xs font-bold shadow-lg shadow-primary-500/10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full transition-all duration-300">
        
        {/* Left Side Column: Accordion forms editor (hidden when printing) */}
        <div className="col-span-12 lg:col-span-5 space-y-4 no-print">
          <div className="flex flex-col gap-1.5 pb-2">
            <h2 className="text-lg font-extrabold tracking-tight font-display">Resume Contents</h2>
            <p className="text-xs text-slate-400 leading-normal">
              Enter your professional background. Changes automatically validate and sync to cloud.
            </p>
          </div>
          
          <ResumeForm formData={formData} setFormData={setFormData} />
        </div>

        {/* Right Side Column: Scale dynamic preview canvas */}
        <div className="col-span-12 lg:col-span-7 space-y-4 print:col-span-12 print:p-0">
          <div className="flex flex-col gap-1.5 pb-2 no-print">
            <h2 className="text-lg font-extrabold tracking-tight font-display flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary-500" /> Real-time Render
            </h2>
            <p className="text-xs text-slate-400 leading-normal">
              Direct high-fidelity preview layout. Scaled fit automatically.
            </p>
          </div>
          
          <ResumePreview data={formData} />
        </div>

      </div>

      {/* Pop-up design templates panel (Dropdown overlay modal) */}
      {showTemplates && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowTemplates(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-bold text-xs"
            >
              Close [X]
            </button>

            <div className="pb-4">
              <TemplateSelector activeTemplate={formData.templateId} onSelect={handleTemplateSelect} />
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
              <button
                onClick={() => setShowTemplates(false)}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs"
              >
                Apply Selection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Editor;
