import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Star, Eye, BarChart, Download, Trash2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function ResumePage() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploading(true);
      setTimeout(() => setUploading(false), 2000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6 md:p-12 relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Ambient Glow Orbs matching Homepage */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-48 w-96 h-96 bg-amber-600/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-10 -left-48 w-96 h-96 bg-yellow-500/10 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient-gold">My Resumes</h1>
          <button {...getRootProps()} className="btn-yellow-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload New
            <input {...getInputProps()} />
          </button>
        </div>

        {uploading && (
          <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-yellow-400 font-medium">Processing your resume...</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div className="glass p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors border border-yellow-400/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold">Primary Resume</h3>
                  <span className="badge-demo bg-yellow-400/20 text-yellow-400 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> PRIMARY
                  </span>
                </div>
                <p className="text-neutral-400 mb-2">Generative AI Developer</p>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span>Updated: Today</span>
                  <span>â€¢</span>
                  <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4" /> ATS Score: 91</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-glass px-4 py-2 flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4" /> View
              </button>
              <button onClick={() => navigate('/resume/analyze')} className="btn-glass px-4 py-2 flex items-center gap-2 text-sm border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10">
                <BarChart className="w-4 h-4" /> Analyze
              </button>
              <button className="btn-glass p-2 text-neutral-400 hover:text-white">
                <Download className="w-4 h-4" />
              </button>
              <button className="btn-glass p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 border-transparent">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div {...getRootProps()} className={clsx(
          "glass p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center",
          isDragActive ? "border-yellow-400 bg-yellow-400/5" : "border-neutral-700 hover:border-yellow-400/50 hover:bg-white/5"
        )}>
          <input {...getInputProps()} />
          <Upload className={clsx("w-12 h-12 mx-auto mb-4 transition-colors", isDragActive ? "text-yellow-400" : "text-neutral-500")} />
          <p className="text-lg font-medium mb-1">Drop a new resume here</p>
          <p className="text-neutral-500 text-sm mb-4">PDF or DOCX, max 10MB</p>
          <span className="btn-glass inline-block px-4 py-2 rounded-full text-sm">Browse Files</span>
        </div>

      </div>
    </div>
  );
}

