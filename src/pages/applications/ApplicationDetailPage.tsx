import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building, MapPin, DollarSign, Calendar, ExternalLink, CheckCircle2, AlertTriangle, Clock, FileText, Bot } from 'lucide-react';
import clsx from 'clsx';

export default function ApplicationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Ambient background glow orbs matching Homepage */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-1/3 right-[-10%] w-96 h-96 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-10 left-[-10%] w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="border-b border-white/10 bg-[#000000]/60 backdrop-blur-2xl relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-amber-300 transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight text-white">Frontend Engineer</h1>
                <span className="glossy-badge-blue px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Applied</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-neutral-400 text-sm">
                <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-amber-400"/> TechCorp</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-neutral-400"/> Remote</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-amber-300"/> $120k - $140k</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-neutral-400"/> Submitted 2 days ago</span>
              </div>
            </div>
            
            <button className="btn-yellow-gradient flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-black font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              <ExternalLink className="w-4 h-4 text-black" /> View Original Job
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {['Details', 'Timeline', 'Review'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={clsx(
                  "px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer",
                  activeTab === tab.toLowerCase() 
                    ? "liquid-glass-interactive text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                    : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="liquid-glass p-6 rounded-3xl border border-white/10 shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-amber-400"/> Application Materials
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-semibold text-sm text-white">Resume Used</p>
                      <p className="text-xs text-neutral-400">primary-resume.pdf</p>
                    </div>
                    <button className="text-amber-400 text-sm font-semibold hover:underline">View</button>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-semibold text-sm text-white">Cover Letter</p>
                      <p className="text-xs text-amber-300 flex items-center gap-1 font-medium"><Bot className="w-3.5 h-3.5"/> AI Generated</p>
                    </div>
                    <button className="text-amber-400 text-sm font-semibold hover:underline">Read</button>
                  </div>
                </div>
              </div>

              <div className="liquid-glass p-6 rounded-3xl border border-white/10 shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-white">Application Q&A</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Q: How many years of React experience do you have?</p>
                    <p className="text-sm font-semibold text-white">4 years</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Q: Are you legally authorized to work in the US?</p>
                    <p className="text-sm font-semibold text-white">Yes</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Q: Will you now or in the future require sponsorship for employment visa status?</p>
                    <p className="text-sm font-semibold text-white">No</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="liquid-glass p-6 rounded-3xl border border-white/10 shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-white">Personal Info</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-neutral-500 text-xs mb-0.5 font-medium">Full Name</p>
                    <p className="font-semibold text-white flex items-center gap-2">John Doe <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/></p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs mb-0.5 font-medium">Email</p>
                    <p className="font-semibold text-white flex items-center gap-2">john@example.com <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/></p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs mb-0.5 font-medium">Phone</p>
                    <p className="font-semibold text-white flex items-center gap-2">+1 234 567 8900 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/></p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs mb-0.5 font-medium">LinkedIn</p>
                    <p className="font-medium text-amber-400 hover:underline cursor-pointer">linkedin.com/in/johndoe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="max-w-2xl mx-auto liquid-glass-elevated p-8 rounded-3xl border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold mb-8 text-white">Application Journey</h3>
            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#000000] bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute -left-[27px] md:static"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] liquid-glass p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-white text-sm">Submitted</div>
                    <time className="text-xs font-mono text-neutral-400">10:35 AM</time>
                  </div>
                  <div className="text-neutral-400 text-xs">Application successfully sent to TechCorp ATS.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#000000] bg-amber-400 text-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute -left-[27px] md:static"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] liquid-glass p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-white text-sm">Application Prepared</div>
                    <time className="text-xs font-mono text-neutral-400">10:34 AM</time>
                  </div>
                  <div className="text-neutral-400 text-xs">AI drafted cover letter and answered 5 screening questions.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#000000] bg-amber-400 text-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute -left-[27px] md:static"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] liquid-glass p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-white text-sm">Match Calculated</div>
                    <time className="text-xs font-mono text-neutral-400">10:33 AM</time>
                  </div>
                  <div className="text-neutral-400 text-xs">94% fit based on your primary resume and preferences.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#000000] bg-neutral-700 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute -left-[27px] md:static"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] liquid-glass p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-white text-sm">Job Discovered</div>
                    <time className="text-xs font-mono text-neutral-400">10:32 AM</time>
                  </div>
                  <div className="text-neutral-400 text-xs">Found via LinkedIn integration.</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="max-w-3xl mx-auto liquid-glass-elevated p-8 rounded-3xl border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-white">Field-by-Field Review</h3>
            <div className="space-y-3">
              {[
                { label: 'First Name', value: 'John', status: 'ok' },
                { label: 'Last Name', value: 'Doe', status: 'ok' },
                { label: 'Email', value: 'john@example.com', status: 'ok' },
                { label: 'Resume', value: 'primary-resume.pdf', status: 'ok' },
                { label: 'Cover Letter', value: 'AI Generated', status: 'ai' },
                { label: 'Work Auth', value: 'Needs Review', status: 'warn' },
              ].map((field, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    {field.status === 'ok' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {field.status === 'ai' && <Bot className="w-5 h-5 text-amber-400" />}
                    {field.status === 'warn' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
                    <span className="font-medium text-neutral-300 w-32 text-sm">{field.label}</span>
                  </div>
                  <span className={clsx(
                    "font-semibold text-sm",
                    field.status === 'warn' ? "text-rose-400" : field.status === 'ai' ? "text-amber-300" : "text-white"
                  )}>{field.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <button className="btn-glass px-6 py-2.5 rounded-xl text-sm font-semibold">Edit Details</button>
              <button className="btn-yellow-gradient px-6 py-2.5 rounded-xl text-black font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.35)]">Approve & Update</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

