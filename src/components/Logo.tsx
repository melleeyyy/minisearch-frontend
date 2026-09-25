import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linked?: boolean;
}

export default function Logo({ size = "md", linked = false }: LogoProps) {
  const wordmark = (
    <span className={`logo logo-${size}`} aria-label="MiniSearch">
      <span className="logo-mini">Mini</span>
      <span className="logo-search">Search</span>
    </span>
  );
  if (linked) {
    return (
      <Link to="/" className="logo-link" aria-label="MiniSearch home">
        {wordmark}
      </Link>
    );
  }
  return wordmark;
}
