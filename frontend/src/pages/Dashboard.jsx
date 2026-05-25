import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, Calendar, FileText, 
  Loader2, AlertCircle, Sparkles, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Fetch all user resumes
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/resumes');
      setResumes(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load resumes from server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Create new resume handler
  const handleCreateNew = async () => {
    try {
      setCreateLoading(true);
      const res = await axios.post('/api/resumes', {
        title: 'My Resume',
        templateId: 'modern',
        personalInfo: {
          name: user?.username || '',
          email: user?.email || '',
        }
      });
      // Redirect to the newly created editor
      navigate(`/editor/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to create a new resume. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete resume handler
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid triggering card click edit route
    if (!window.confirm('Are you sure you want to permanently delete this resume?')) {
      return;
    }

    try {
      await axios.delete(`/api/resumes/${id}`);
      // Refresh list
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete resume.');
    }
  };

  // Helper date formatter
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Background lights */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Profile/Header Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Your Workspace</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Welcome back, <span className="font-semibold text-primary-500">{user?.username}</span>. Build, customize, and maintain your professional portfolios.
            </p>
          </div>
          
          <button
            onClick={handleCreateNew}
            disabled={createLoading}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:bg-primary-500/50 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all duration-200 hover:-translate-y-0.5"
          >
            {createLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4.5 w-4.5" />
            )}
            <span>Create New Resume</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Fetching resumes...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Create New Card (Interactive card inside grid) */}
            <div
              onClick={handleCreateNew}
              className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 bg-white/40 dark:bg-slate-900/10 hover:bg-white dark:hover:bg-slate-900/30 cursor-pointer group transition-all duration-200 text-center min-h-[220px]"
            >
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/50 group-hover:scale-105 text-slate-400 group-hover:text-primary-500 transition-all duration-200 mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Create Blank Document</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">Start fresh with our gorgeous modern layout.</p>
            </div>

            {/* List existing Resumes */}
            {resumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => navigate(`/editor/${resume._id}`)}
                className="flex flex-col justify-between p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/20 hover:bg-white dark:hover:bg-slate-900/40 shadow-sm cursor-pointer group hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[220px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary-50 dark:bg-primary-950/40 text-primary-500 rounded-2xl">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {resume.templateId}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">
                    {resume.title}
                  </h3>
                  
                  {/* Stats / Dates */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Edited {formatDate(resume.updatedAt)}</span>
                  </div>
                </div>

                {/* Actions bottom strip */}
                <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-200/30 dark:border-slate-800/30">
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold group-hover:underline flex items-center gap-1">
                    <Edit className="h-3.5 w-3.5" /> Edit Resume
                  </span>
                  
                  <button
                    onClick={(e) => handleDelete(resume._id, e)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                    aria-label="Delete Resume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Empty state dashboard when no resumes */}
        {!loading && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/10 max-w-md mx-auto mt-6 space-y-4">
            <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-500 animate-bounce">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Workspace is Empty</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed">
                Create your first resume documents. You can toggle templates, add professional backgrounds, and print high-res PDFs.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;
