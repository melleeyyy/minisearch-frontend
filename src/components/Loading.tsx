interface LoadingProps {
  label?: string;
}

export default function Loading({ label = "Searching..." }: LoadingProps) {
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state-text">{label}</p>
    </div>
  );
}
