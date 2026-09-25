interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state" role="alert">
      <span className="state-icon" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 7.5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="16.6" r="1.1" fill="currentColor" />
        </svg>
      </span>
      <h3 className="state-title">{title}</h3>
      <p className="state-text">
        {message ??
          "Could not reach the MiniSearch API. The service may be waking up — please try again."}
      </p>
      {onRetry && (
        <button className="btn state-action" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
