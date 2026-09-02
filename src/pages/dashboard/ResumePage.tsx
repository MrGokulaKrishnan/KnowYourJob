import React, { useEffect, useState } from 'react';
import { FileUp, FileText, Download, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { resumeService } from '../../services/firebase/resumeService';
import { ResumeMetadata } from '../../types/notification';

export const ResumePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const loadResumes = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await resumeService.getUserResumes(user.uid);
      setResumes(data);
    } catch (err) {
      console.warn('Error fetching resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate size (under 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be under 10MB.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const newResume = await resumeService.uploadResume(user.uid, file);
      setResumes((prev) => [newResume, ...prev]);
      showToast(`Successfully uploaded and analyzed ${file.name}!`, 'success', 'Resume Uploaded');
    } catch (err) {
      showToast('Resume upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (resume: ResumeMetadata) => {
    try {
      await resumeService.deleteResume(resume.id, resume.storagePath);
      setResumes((prev) => prev.filter((r) => r.id !== resume.id));
      showToast('Resume removed from storage and database.', 'info');
    } catch {
      showToast('Failed to delete resume.', 'error');
    }
  };

  return (
    <DashboardLayout
      pageTitle="Resume & ATS Intelligence"
      pageSubtitle="Securely backed by Firebase Storage with strict user directory isolation."
    >
      <div className="flex flex-col gap-6">
        {/* Upload Box */}
        <div className="liquid-glass-elevated rounded-2xl p-8 border-dashed border-2 border-amber-500/30 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FileUp className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Upload Your Resume</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Supports PDF, DOCX (Max 10MB). Our AI engine extracts technical competencies and calculates ATS compatibility.
            </p>
          </div>

          <label className="cursor-pointer mt-2">
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <div className="btn-yellow-gradient px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isUploading ? 'Uploading to Storage...' : 'Select Resume File'}</span>
            </div>
          </label>
        </div>

        {/* Resumes List */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Stored Resumes ({resumes.length})
          </h3>

          {isLoading ? (
            <LoadingSpinner label="Fetching resume documents..." />
          ) : resumes.length === 0 ? (
            <div className="liquid-glass rounded-2xl p-8 text-center text-xs text-slate-400">
              No resumes uploaded yet. Upload one above to unlock autonomous applications.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {resumes.map((res) => (
                <div
                  key={res.id}
                  className="liquid-glass-interactive rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{res.fileName}</span>
                        {res.isPrimary && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {(res.fileSize / 1024).toFixed(1)} KB • Status: {res.analysisStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {res.atsScore && (
                      <div className="text-right">
                        <div className="text-xs text-slate-400">ATS Score</div>
                        <div className="text-base font-bold text-amber-400 font-mono">
                          {res.atsScore}%
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {res.downloadUrl && (
                        <a
                          href={res.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(res)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
