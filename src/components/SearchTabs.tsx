import { NavLink } from "react-router-dom";

export type TabKey = "web" | "images" | "videos" | "answers";

interface SearchTabsProps {
  q?: string;
  active: TabKey;
}

const TABS: { key: TabKey; label: string; path: string }[] = [
  { key: "web", label: "Web", path: "/search" },
  { key: "images", label: "Images", path: "/images" },
  { key: "videos", label: "Videos", path: "/videos" },
  { key: "answers", label: "Answers", path: "/answers" },
];

export default function SearchTabs({ q, active }: SearchTabsProps) {
  const suffix = q ? `?q=${encodeURIComponent(q)}` : "";
  return (
    <nav className="tabs" aria-label="Search categories">
      {TABS.map((t) => (
        <NavLink
          key={t.key}
          to={`${t.path}${suffix}`}
          className={`tab${t.key === active ? " active" : ""}`}
        >
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
