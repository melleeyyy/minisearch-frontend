import { useState } from "react";
import type { ImageResultItem } from "../services/imageApi";

export default function ImageCard({ item }: { item: ImageResultItem }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="image-card" style={{ margin: 0 }}>
      {failed ? (
        <a
          className="image-card-thumb"
          href={item.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.alt || item.title}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-faint)",
            fontSize: "12px",
          }}
        >
          image unavailable
        </a>
      ) : (
        <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
          <img
            className="image-card-thumb"
            src={item.imageUrl}
            alt={item.alt || item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
          />
        </a>
      )}
      <figcaption className="image-card-body">
        <a
          href={item.sourcePageUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={item.alt || item.title}
        >
          <p className="image-card-title">{item.title || item.alt || "Image"}</p>
        </a>
        <p className="image-card-meta">
          {item.domain}
          {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
        </p>
      </figcaption>
    </figure>
  );
}
