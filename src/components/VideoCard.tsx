import { useState } from "react";
import type { VideoResultItem } from "../services/videoApi";
import { PlayIcon } from "./icons";

export default function VideoCard({ item }: { item: VideoResultItem }) {
  const [failed, setFailed] = useState(false);
  return (
    <article className="video-card">
      <a
        className="video-thumb-wrap"
        href={item.page || item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.poster && !failed ? (
          <img src={item.poster} alt="" loading="lazy" onError={() => setFailed(true)} />
        ) : (
          <div style={{ aspectRatio: "16 / 9", background: "var(--surface-2)" }} />
        )}
        <span className="video-play" aria-hidden="true">
          <span className="video-play-circle">
            <PlayIcon size={20} />
          </span>
        </span>
      </a>
      <div className="video-card-body">
        <a
          href={item.page || item.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="video-card-title">{item.title}</h3>
        </a>
        <p className="video-card-meta">
          Wikimedia Commons
          {item.mime ? ` · ${item.mime.replace("video/", "")}` : ""}
        </p>
      </div>
    </article>
  );
}
