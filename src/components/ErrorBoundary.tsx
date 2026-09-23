import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    console.error('SectorSweeper caught unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('sector_sweeper_stats');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-mono">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-red-400 mb-2">Tactical Subsystem Exception</h1>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Sector Sweeper encountered a critical error during execution. Your mission state has been quarantined.
            </p>
            {this.state.error && (
              <div className="bg-slate-950 border border-slate-800 rounded p-3 mb-5 text-left text-[11px] text-red-300 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-900/40"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reinitialize Mission Subsystems</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
