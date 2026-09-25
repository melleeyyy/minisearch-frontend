import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { ImageIcon, SearchIcon, SparkIcon, VideoIcon } from "../components/icons";

const TABS = [
  { to: "/search", label: "Web", icon: <SearchIcon size={17} /> },
  { to: "/images", label: "Images", icon: <ImageIcon size={17} /> },
  { to: "/videos", label: "Videos", icon: <VideoIcon size={17} /> },
  { to: "/answers", label: "Answers", icon: <SparkIcon size={17} /> },
];

export default function Home() {
  const [q, setQ] = useState("");
  const { canInstall, promptInstall } = useInstallPrompt();

  function submit(query: string) {
    window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
  }

  return (
    <div className="home">
      <div className="home-logo">
        <Logo size="lg" />
      </div>

      <SearchBar value={q} onChange={setQ} onSubmit={submit} size="lg" autoFocus />

      <div className="home-tabs">
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} className="home-tab">
            {t.icon}
            {t.label}
          </Link>
        ))}
      </div>

      {canInstall && (
        <button className="btn btn-ghost home-install" onClick={promptInstall}>
          Install app
        </button>
      )}

      <p className="home-footer">
        MiniSearch — ആവശ്യത്തിനുള്ള ഒരു ചെറിയ search engine
      </p>
    </div>
  );
}
