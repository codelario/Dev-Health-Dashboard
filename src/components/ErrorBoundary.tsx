import { type ErrorInfo, type ReactNode } from "react";
import { Component } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  message?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log útil para observabilidad en producción.
    console.error("ErrorBoundary capturó un error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <h2 className="text-lg font-semibold text-rose-800">{this.props.title ?? "Se produjo un error"}</h2>
          <p className="mt-1 text-sm text-rose-700">
            {this.props.message ?? "La aplicación continúa operativa para evitar una caída completa."}
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}
