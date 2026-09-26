import { useState } from "react";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [q, setQ] = useState("");

  function submit(query: string) {
    window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
  }

  return (
    <div className="home">
      <div className="home-logo">
        <Logo size="lg" />
      </div>

      <SearchBar value={q} onChange={setQ} onSubmit={submit} size="lg" />
    </div>
  );
}
