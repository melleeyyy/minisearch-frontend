import { useState } from "react";
import type { EntityCard, MonthlyNormal } from "../services/knowledgeApi";
import { cleanSnippetText } from "../utils/sanitize";
import MapBlock from "./MapBlock";

/* ---------- fact key labels + formatting ---------- */

const FACT_LABELS: Record<string, string> = {
  capital: "Capital",
  country: "Country",
  population: "Population",
  area: "Area (km²)",
  coordinates: "Coordinates",
  official_language: "Official language",
  inception: "Founded",
  elevation: "Elevation (m)",
  located_in_admin_unit: "Located in",
  part_of: "Part of",
  head_of_government: "Head of government",
  head_of_state: "Head of state",
  official_website: "Website",
  date_of_birth: "Born",
  date_of_death: "Died",
  place_of_birth: "Birthplace",
  place_of_death: "Died at",
  occupation: "Occupation",
  spouse: "Spouse",
  children: "Children",
  educated_at: "Educated at",
  country_of_citizenship: "Citizenship",
  founded_by: "Founded by",
  chief_executive_officer: "CEO",
  headquarters_location: "Headquarters",
};

const FACT_ORDER = [
  "capital", "country", "population", "area", "official_language",
  "inception", "date_of_birth", "date_of_death", "occupation",
  "chief_executive_officer", "founded_by", "headquarters_location",
  "located_in_admin_unit", "elevation", "coordinates", "official_website",
];

function factValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return v.toLocaleString("en-IN");
  if (typeof v === "object") {
    const c = v as { lat?: number; lon?: number };
    if (typeof c.lat === "number" && typeof c.lon === "number")
      return `${c.lat.toFixed(2)}°, ${c.lon.toFixed(2)}°`;
    return "";
  }
  return String(v);
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ---------- weather strip ---------- */

function WeatherStrip({ monthly }: { monthly: MonthlyNormal[] }) {
  if (!monthly.length) return null;
  const tmax = monthly.map((m) => m.tmax ?? 0);
  const tmin = monthly.map((m) => m.tmin ?? 0);
  const hi = Math.max(...tmax, ...tmin);
  const lo = Math.min(...tmax, ...tmin, 0);
  const span = Math.max(1, hi - lo);
  return (
    <div className="weather" aria-label="Monthly weather averages">
      <div className="weather-title">Weather averages</div>
      <div className="weather-months">
        {monthly.map((m) => (
          <div key={m.month} className="weather-month" title={`${m.month}: ${m.tmax ?? "–"}° / ${m.tmin ?? "–"}°, ${m.prcp ?? 0} mm rain`}>
            <div
              className="weather-bar"
              style={{
                top: `${Math.round(((hi - (m.tmax ?? 0)) / span) * 100)}%`,
                height: `${Math.max(6, Math.round((((m.tmax ?? 0) - (m.tmin ?? 0)) / span) * 100))}%`,
              }}
            />
            <span className="weather-label">{m.month[0]}</span>
          </div>
        ))}
      </div>
      <div className="weather-note">
        Monthly averages — {lo.toFixed(0)}° to {hi.toFixed(0)}° C
      </div>
    </div>
  );
}

/* ---------- get-there block ---------- */

const HOME_KEY = "ms_home_coords";

function readHome(): { lat: number; lon: number; name: string } | null {
  try {
    const raw = localStorage.getItem(HOME_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p?.lat === "number" && typeof p?.lon === "number") return p;
  } catch { /* ignore */ }
  return null;
}

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const d = (deg: number) => (deg * Math.PI) / 180;
  const dLat = d(b[0] - a[0]);
  const dLon = d(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(d(a[0])) * Math.cos(d(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function GetThere({ lat, lon }: { lat: number; lon: number }) {
  const [home, setHome] = useState(readHome());
  const [input, setInput] = useState("");
  const dist = home ? haversine([home.lat, home.lon], [lat, lon]) : null;
  const flightH = dist !== null ? dist / 800 + 0.6 : null;
  const route = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${home ? `${home.lat},${home.lon};` : ""}${lat},${lon}`;

  return (
    <div className="get-there">
      <div className="get-there-title">Get there</div>
      {dist !== null ? (
        <p className="get-there-line">
          ≈ {Math.round(dist).toLocaleString("en-IN")} km from {home?.name} ·
          ~{flightH ? flightH.toFixed(1) : "–"} h by air
        </p>
      ) : (
        <p className="get-there-line get-there-hint">
          Set your home location for distance:
        </p>
      )}
      <div className="get-there-row">
        {!home && (
          <form
            className="get-there-form"
            onSubmit={(e) => {
              e.preventDefault();
              // Free, keyless geocoding (Open-Meteo geocoding API)
              const q = input.trim();
              if (!q) return;
              fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`)
                .then((r) => r.json())
                .then((d) => {
                  const g = d?.results?.[0];
                  if (g) {
                    const h = { lat: g.latitude, lon: g.longitude, name: g.name };
                    localStorage.setItem(HOME_KEY, JSON.stringify(h));
                    setHome(h);
                  }
                })
                .catch(() => { /* ignore */ });
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your city"
              aria-label="Home city for distance"
            />
            <button type="submit">Set</button>
          </form>
        )}
        <a href={route} target="_blank" rel="noreferrer">Directions (OSM) ↗</a>
      </div>
    </div>
  );
}

/* ---------- the card ---------- */

interface EntityCardViewProps {
  data: EntityCard;
}

export default function EntityCardView({ data }: EntityCardViewProps) {
  const [expanded, setExpanded] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const place = data.place;
  const facts = Object.entries(data.facts)
    .filter(([k, v]) => FACT_LABELS[k] && factValue(v))
    .sort((a, b) => {
      const ia = FACT_ORDER.indexOf(a[0]);
      const ib = FACT_ORDER.indexOf(b[0]);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    })
    .slice(0, 8);

  const gallery = data.images.slice(0, 5);
  const overview = cleanSnippetText(data.overview ?? "");

  return (
    <section className="entity-card" aria-label="Knowledge card">
      <header className="entity-head">
        {place?.flagUrl && (
          <img className="entity-flag" src={place.flagUrl} alt="" width={34} height={24} />
        )}
        <div className="entity-titles">
          <h2 className="entity-title">{data.title}</h2>
          <p className="entity-subtitle">{data.subtitle}</p>
        </div>
        <button
          type="button"
          className="entity-share"
          onClick={() => {
            const url = window.location.href;
            if (navigator.share) navigator.share({ title: data.title, url }).catch(() => {});
            else if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
          }}
        >
          Share
        </button>
      </header>

      {gallery.length > 0 && (
        <div className="entity-gallery" role="list" aria-label="Images">
          {gallery.map((im) => (
            <a key={im.page_url} className="entity-gallery-item" role="listitem"
               href={im.page_url} target="_blank" rel="noreferrer"
               title={`${im.title} — ${im.artist} (${im.license})`}>
              <img src={im.thumb_url || im.image_url} alt={im.title} loading="lazy" />
            </a>
          ))}
        </div>
      )}

      {facts.length > 0 && (
        <dl className="entity-facts">
          {facts.map(([k, v]) => (
            <div key={k} className="entity-fact">
              <dt>{FACT_LABELS[k]}</dt>
              <dd>{factValue(v)}</dd>
            </div>
          ))}
        </dl>
      )}

      {overview && (
        <div className="entity-overview">
          <p className={`entity-overview-text${expanded ? "" : " clamped"}`}>
            {overview}
          </p>
          <div className="entity-overview-actions">
            <button type="button" className="entity-more"
                    onClick={() => setExpanded((e) => !e)}>
              {expanded ? "Show less" : "Show more"}
            </button>
            {data.url && (
              <a href={data.url} target="_blank" rel="noreferrer">Wikipedia ↗</a>
            )}
          </div>
        </div>
      )}

      {place && typeof place.lat === "number" && typeof place.lon === "number" && (
        <MapBlock lat={place.lat} lon={place.lon} label={data.title}
                  expanded={mapOpen} onToggle={() => setMapOpen((o) => !o)} />
      )}

      {place?.weather?.monthly?.length ? (
        <WeatherStrip monthly={place.weather.monthly} />
      ) : null}

      {place && typeof place.lat === "number" && typeof place.lon === "number" && (
        <GetThere lat={place.lat} lon={place.lon} />
      )}

      {data.related.length > 0 && (
        <div className="entity-related">
          {data.related.slice(0, 6).map((r) => (
            <span key={r.qid} className="entity-chip"
                  title={r.qid}>{r.label}</span>
          ))}
        </div>
      )}

      <footer className="entity-sources">
        {data.sources.map((s) => (
          <a key={s.name + s.url} href={s.url || "#"} target="_blank"
             rel="noreferrer" className="entity-source">
            {s.name}
            {s.checked ? ` · checked ${fmtDate(s.checked)}` : ""}
          </a>
        ))}
      </footer>
    </section>
  );
}
