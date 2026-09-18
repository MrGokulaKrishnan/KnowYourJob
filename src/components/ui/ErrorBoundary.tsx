import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col justify-center items-center px-6 text-center">
          <div className="max-w-md w-full liquid-glass-elevated p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              A client-side error occurred. We have isolated the issue so other tabs and sessions remain unaffected.
            </p>

            {this.state.error && (
              <div className="p-3 mb-6 bg-black/40 rounded-xl border border-white/5 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition"
              >
                <RefreshCcw size={14} /> Refresh Page
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition"
              >
                <Home size={14} /> Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
