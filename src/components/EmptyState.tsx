import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message?: string;
  children?: ReactNode;
}

export default function EmptyState({ title, message, children }: EmptyStateProps) {
  return (
    <div className="state">
      <span className="state-icon" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M20 20l-3.8-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <h3 className="state-title">{title}</h3>
      {message && <p className="state-text">{message}</p>}
      {children}
    </div>
  );
}
