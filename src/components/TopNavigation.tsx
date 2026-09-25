import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const LINKS = [
  { to: "/search", label: "Search" },
  { to: "/answers", label: "Answers" },
  { to: "/notifications", label: "Notifications" },
  { to: "/activity", label: "Activity" },
];

export default function TopNavigation() {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <Logo size="sm" linked />
        <nav className="top-nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
