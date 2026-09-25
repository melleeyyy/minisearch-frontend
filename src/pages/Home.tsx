import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import { getHealth, type Health } from "../services/api";
import { formatNumber } from "../utils/format";
import { ImageIcon, SearchIcon, SparkIcon, VideoIcon } from "../components/icons";

const TABS = [
  { to: "/search", label: "Web", icon: <SearchIcon size={17} /> },
  { to: "/images", label: "Images", icon: <ImageIcon size={17} /> },
  { to: "/videos", label: "Videos", icon: <VideoIcon size={17} /> },
  { to: "/answers", label: "Answers", icon: <SparkIcon size={17} /> },
];

export default function Home() {
  const [q, setQ] = useState("");
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    let alive = true;
    getHealth()
      .then((h) => alive && setHealth(h))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  function submit(query: string) {
    window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
  }

  return (
    <div className="home">
      <div className="home-logo">
        <Logo size="lg" />
      </div>

      <SearchBar value={q} onChange={setQ} onSubmit={submit} size="lg" autoFocus />

      <p className="home-stats">
        {health
          ? health.indexLoaded
            ? `${formatNumber(health.pages)} pages · ${formatNumber(
                health.images
              )} images · ${formatNumber(health.terms)} terms · BM25 ranking${
                health.cppAcceleration ? " · C++ accelerated" : ""
              }`
            : "Index is loading..."
          : ""}
      </p>

      <p className="home-tagline">
        A small, honest search engine — web results, images, videos and extractive
        answers over a focused crawl of selected sources.
      </p>

      <div className="home-tabs">
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} className="home-tab">
            {t.icon}
            {t.label}
          </Link>
        ))}
      </div>

      <p className="home-footer">
        MiniSearch — ആവശ്യത്തിനുള്ള ഒരു ചെറിയ search engine
      </p>
    </div>
  );
}
