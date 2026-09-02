import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building, MapPin, DollarSign, Calendar, ExternalLink, CheckCircle2, AlertTriangle, Clock, FileText, Bot } from 'lucide-react';
import clsx from 'clsx';

export default function ApplicationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="border-b border-white/10 bg-[#0B0B0B]">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Board
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Frontend Engineer</h1>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-sm font-medium">Applied</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-neutral-400 text-sm">
                <span className="flex items-center gap-1.5"><Building className="w-4 h-4"/> TechCorp</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> Remote</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> $120k - $140k</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Submitted 2 days ago</span>
              </div>
            </div>
            
            <button className="btn-primary flex items-center justify-center gap-2 px-6 py-2">
              <ExternalLink className="w-4 h-4" /> View Original Job
            </button>
          </div>

          <div className="flex items-center gap-6 border-b border-white/10 pt-4">
            {['Details', 'Timeline', 'Review'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={clsx(
                  "pb-4 text-sm font-medium transition-colors border-b-2",
                  activeTab === tab.toLowerCase() ? "border-yellow-400 text-yellow-400" : "border-transparent text-neutral-400 hover:text-neutral-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-yellow-400"/> Application Materials</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-neutral-900/50 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium text-sm">Resume Used</p>
                      <p className="text-xs text-neutral-400">primary-resume.pdf</p>
                    </div>
                    <button className="text-yellow-400 text-sm font-medium hover:underline">View</button>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-neutral-900/50 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium text-sm">Cover Letter</p>
                      <p className="text-xs text-yellow-400 flex items-center gap-1"><Bot className="w-3 h-3"/> AI Generated</p>
                    </div>
                    <button className="text-yellow-400 text-sm font-medium hover:underline">Read</button>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4">Application Q&A</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Q: How many years of React experience do you have?</p>
                    <p className="text-sm font-medium">4 years</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Q: Are you legally authorized to work in the US?</p>
                    <p className="text-sm font-medium">Yes</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Q: Will you now or in the future require sponsorship for employment visa status?</p>
                    <p className="text-sm font-medium">No</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4">Personal Info</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-neutral-500 mb-0.5">Full Name</p>
                    <p className="font-medium flex items-center gap-2">John Doe <CheckCircle2 className="w-3 h-3 text-green-400"/></p>
                  </div>
                  <div>
                    <p className="text-neutral-500 mb-0.5">Email</p>
                    <p className="font-medium flex items-center gap-2">john@example.com <CheckCircle2 className="w-3 h-3 text-green-400"/></p>
                  </div>
                  <div>
                    <p className="text-neutral-500 mb-0.5">Phone</p>
                    <p className="font-medium flex items-center gap-2">+1 234 567 8900 <CheckCircle2 className="w-3 h-3 text-green-400"/></p>
                  </div>
                  <div>
                    <p className="text-neutral-500 mb-0.5">LinkedIn</p>
                    <p className="font-medium text-blue-400 hover:underline cursor-pointer">linkedin.com/in/johndoe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="max-w-2xl mx-auto glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-8">Application Journey</h3>
            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#0B0B0B] bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute -left-[27px] md:static"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] glass p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-white text-sm">Submitted</div>
                    <time className="text-xs font-medium text-neutral-500">10:35 AM</time>
                  </div>
                  <div className="text-neutral-400 text-xs">Application successfully sent to TechCorp ATS.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#0B0B0B] bg-yellow-400 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute -left-[27px] md:static"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] glass p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-white text-sm">Application Prepared</div>
                    <time className="text-xs font-medium text-neutral-500">10:34 AM</time>
                  </div>
                  <div className="text-neutral-400 text-xs">AI drafted cover letter and answered 5 screening questions.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#0B0B0B] bg-yellow-400 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute -left-[27px] md:static"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] glass p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-white text-sm">Match Calculated</div>
                    <time className="text-xs font-medium text-neutral-500">10:33 AM</time>
                  </div>
                  <div className="text-neutral-400 text-xs">94% fit based on your primary resume and preferences.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#0B0B0B] bg-neutral-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute -left-[27px] md:static"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] glass p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-white text-sm">Job Discovered</div>
                    <time className="text-xs font-medium text-neutral-500">10:32 AM</time>
                  </div>
                  <div className="text-neutral-400 text-xs">Found via LinkedIn integration.</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="max-w-3xl mx-auto glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">Field-by-Field Review</h3>
            <div className="space-y-3">
              {[
                { label: 'First Name', value: 'John', status: 'ok' },
                { label: 'Last Name', value: 'Doe', status: 'ok' },
                { label: 'Email', value: 'john@example.com', status: 'ok' },
                { label: 'Resume', value: 'primary-resume.pdf', status: 'ok' },
                { label: 'Cover Letter', value: 'AI Generated', status: 'ai' },
                { label: 'Work Auth', value: 'Needs Review', status: 'warn' },
              ].map((field, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-neutral-900/40 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    {field.status === 'ok' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                    {field.status === 'ai' && <Bot className="w-5 h-5 text-yellow-400" />}
                    {field.status === 'warn' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                    <span className="font-medium text-neutral-300 w-32">{field.label}</span>
                  </div>
                  <span className={clsx(
                    "font-medium",
                    field.status === 'warn' ? "text-red-400" : field.status === 'ai' ? "text-yellow-400" : "text-white"
                  )}>{field.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <button className="btn-glass px-6 py-2">Edit Details</button>
              <button className="btn-primary px-6 py-2">Approve & Update</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

