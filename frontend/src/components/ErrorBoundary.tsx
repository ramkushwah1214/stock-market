import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard render error:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Something went wrong</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          The dashboard hit a rendering error. You can safely reload this section.
        </p>
        <button
          onClick={() => this.setState({ hasError: false })}
          className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }
}
