"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (typeof console !== "undefined") {
      console.error("[BrainGym] component error:", error);
    }
    this.props.onError?.(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-lg font-bold">Something went wrong</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We hit an unexpected error. Try again — your progress is safe.
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
