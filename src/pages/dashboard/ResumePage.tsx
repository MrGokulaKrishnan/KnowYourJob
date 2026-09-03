import React, { useEffect, useState } from 'react';
import { FileUp, FileText, Download, Trash2, Sparkles, Loader2, CheckCircle2, XCircle, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'uploading' | 'analysing'>('idle');

  const loadResumes = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await resumeService.getUserResumes(user.uid);
      // Sort: newest first (by uploadedAt if available)
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

    // Validate type
    const allowed = ['.pdf', '.docx', '.doc'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      showToast('Only PDF and DOCX files are supported.', 'error');
      return;
    }

    setUploadPhase('uploading');
    try {
      showToast('Uploading resume to secure storage…', 'info', 'Uploading');
      // Small delay so the "uploading" toast shows before the heavy AI call
      await new Promise(r => setTimeout(r, 300));
      setUploadPhase('analysing');
      showToast('Extracting text and running AI analysis…', 'info', 'Analysing with AI');

      const newResume = await resumeService.uploadResume(user.uid, file);
      setResumes(prev => [newResume, ...prev]);

      if (newResume.analysisStatus === 'analyzed') {
        showToast(
          `AI analysis complete! ATS Score: ${newResume.atsScore}%`,
          'success',
          'Resume Analysed ✨'
        );
      } else {
        showToast(
          'Resume uploaded. AI analysis failed — try Re-analyze from the resume card.',
          'warning',
          'Partial Upload'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('Resume upload failed. Please try again.', 'error');
    } finally {
      setUploadPhase('idle');
      e.target.value = '';
    }
  };

  const handleDelete = async (resume: ResumeMetadata) => {
    try {
      await resumeService.deleteResume(resume.id, resume.storagePath);
      setResumes(prev => prev.filter(r => r.id !== resume.id));
      showToast('Resume removed from storage and database.', 'info');
    } catch {
      showToast('Failed to delete resume.', 'error');
    }
  };

  const isUploading = uploadPhase !== 'idle';

  const statusBadge = (resume: ResumeMetadata) => {
    if (resume.analysisStatus === 'analyzed') {
      return (
        <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" /> Analysed
        </span>
      );
    }
    if (resume.analysisStatus === 'failed') {
      return (
        <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
          <XCircle className="w-3 h-3" /> Failed
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <Loader2 className="w-3 h-3 animate-spin" /> Pending
      </span>
    );
  };

  return (
    <DashboardLayout
      pageTitle="Resume & ATS Intelligence"
      pageSubtitle="Upload your resume — AI extracts text, scores ATS compatibility, and gives tailored suggestions."
    >
      <div className="flex flex-col gap-6">

        {/* Upload Box */}
        <div className="liquid-glass-elevated rounded-2xl p-8 border-dashed border-2 border-amber-500/30 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            {isUploading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <FileUp className="w-7 h-7" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Upload Your Resume</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Supports PDF, DOCX (Max 10MB). AI extracts skills and calculates ATS compatibility score.
            </p>
          </div>

          {/* Two-phase progress indicator */}
          {isUploading && (
            <div className="flex items-center gap-6 text-xs">
              <div className={`flex items-center gap-1.5 ${uploadPhase === 'uploading' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {uploadPhase === 'uploading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Uploading to Storage
              </div>
              <div className="w-8 h-px bg-white/10" />
              <div className={`flex items-center gap-1.5 ${uploadPhase === 'analysing' ? 'text-amber-400' : 'text-slate-500'}`}>
                {uploadPhase === 'analysing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                AI Analysis
              </div>
            </div>
          )}

          <label className={`cursor-pointer mt-1 ${isUploading ? 'pointer-events-none opacity-60' : ''}`}>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <div className="btn-yellow-gradient px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>
                {uploadPhase === 'uploading' ? 'Uploading…' :
                 uploadPhase === 'analysing' ? 'Analysing with AI…' :
                 'Select Resume File'}
              </span>
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
              No resumes uploaded yet. Upload one above to unlock AI analysis.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {resumes.map(res => (
                <div
                  key={res.id}
                  className="liquid-glass-interactive rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white truncate">{res.fileName}</span>
                        {res.isPrimary && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Primary
                          </span>
                        )}
                        {statusBadge(res)}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {(res.fileSize / 1024).toFixed(1)} KB
                        {res.atsScore ? ` · ATS Score: ${res.atsScore}%` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* ATS score badge */}
                    {res.atsScore && (
                      <div className="text-right mr-2">
                        <div className="text-[10px] text-slate-400">ATS</div>
                        <div className={`text-base font-bold font-mono ${
                          res.atsScore >= 80 ? 'text-emerald-400' :
                          res.atsScore >= 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {res.atsScore}%
                        </div>
                      </div>
                    )}

                    {/* View Analysis button */}
                    <button
                      onClick={() => navigate(`/dashboard/resume/analyze?id=${res.id}`)}
                      className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition flex items-center gap-1.5 text-xs font-semibold px-3.5 cursor-pointer"
                      title={res.analysisStatus === 'analyzed' ? 'View Full ATS Analysis' : 'Analyze with AI'}
                    >
                      <BarChart2 className="w-4 h-4" />
                      <span>{res.analysisStatus === 'analyzed' ? 'View Analysis' : 'Analyze with AI'}</span>
                    </button>

                    {/* Download */}
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

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(res)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
