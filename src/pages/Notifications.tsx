import { useEffect, useState } from "react";
import TopNavigation from "../components/TopNavigation";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import SourceCard from "../components/SourceCard";
import {
  getHealth,
  getSources,
  type Health,
  type SourcesResponse,
} from "../services/api";
import { formatNumber } from "../utils/format";

export default function Notifications() {
  const [health, setHealth] = useState<Health | null>(null);
  const [sources, setSources] = useState<SourcesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setError(null);
    Promise.all([getHealth(), getSources()])
      .then(([h, s]) => {
        if (!alive) return;
        setHealth(h);
        setSources(s);
      })
      .catch(() => alive && setError("Could not load engine status."))
      .finally(() => undefined);
    return () => {
      alive = false;
    };
  }, [nonce]);

  return (
    <div>
      <TopNavigation />
      <div className="container">
        <h1 className="page-title">Notifications</h1>
        <p className="page-subtitle">
          Live engine status — what MiniSearch has indexed right now.
        </p>

        {error && (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        )}
        {!error && !health && <Loading label="Loading engine status..." />}

        {!error && health && (
          <div className="card">
            <h2>Engine</h2>
            <div className="card-row">
              <span className="k">Status</span>
              <span>
                <span className="badge badge-blue">{health.ok ? "healthy" : "degraded"}</span>
              </span>
            </div>
            <div className="card-row">
              <span className="k">Index</span>
              <span>
                <span className="badge">{health.indexLoaded ? "loaded" : "empty"}</span>
              </span>
            </div>
            <div className="card-row">
              <span className="k">Pages</span>
              <span>{formatNumber(health.pages)}</span>
            </div>
            <div className="card-row">
              <span className="k">Images</span>
              <span>{formatNumber(health.images)}</span>
            </div>
            <div className="card-row">
              <span className="k">Terms</span>
              <span>{formatNumber(health.terms)}</span>
            </div>
            <div className="card-row">
              <span className="k">Link edges</span>
              <span>{formatNumber(health.linkEdges)}</span>
            </div>
            <div className="card-row">
              <span className="k">Scoring engine</span>
              <span>
                <span className="badge">
                  {health.cppAcceleration ? "C++ accelerated" : "pure Python"}
                </span>
              </span>
            </div>
          </div>
        )}

        {!error && sources && (
          <div className="card">
            <h2>Indexed sources ({sources.total})</h2>
            {sources.sources.map((s) => (
              <SourceCard key={s.domain} source={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
