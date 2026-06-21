'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center py-20 px-4">
          <Card className="w-full max-w-md border-border/50 shadow-lg">
            <CardContent className="flex flex-col items-center gap-5 p-6 text-center">
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full',
                  'bg-emerald-100 text-emerald-700',
                  'dark:bg-emerald-900/40 dark:text-emerald-300'
                )}
              >
                <AlertTriangle className="h-7 w-7" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg font-semibold text-foreground">
                  Something went wrong
                </h2>
                <p className="text-sm text-muted-foreground">
                  An unexpected error occurred. Please try again.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="w-full rounded-md bg-muted p-3 text-left">
                  <p className="text-xs font-mono text-muted-foreground break-words">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <Button onClick={this.handleReset} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export type { ErrorBoundaryProps };