import type { AnswerResponse } from "../services/answerApi";
import { SparkIcon } from "./icons";
import { cleanSnippetText } from "../utils/sanitize";

function fmtDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** V3.11 — extractive answer card: evidence count instead of a
 * fabricated confidence bar; entity-fact answers badged and dated. */
export default function AnswerCard({ data }: { data: AnswerResponse }) {
  const evidenceCount = data.evidenceCount ?? data.sources?.length ?? 0;
  return (
    <section className="answer-card" aria-label="Answer">
      <header className="answer-head">
        <SparkIcon size={16} />
        <span>Answer</span>
        {data.entityFact && <span className="answer-fact-badge">entity fact</span>}
      </header>

      {data.answer && (
        <p className="answer-text">{cleanSnippetText(data.answer)}</p>
      )}

      <div className="answer-evidence-line" aria-live="polite">
        {data.entityFact ? (
          <span>
            From the knowledge card — verified{" "}
            {data.sourceChecked ? fmtDate(data.sourceChecked) : "recently"}
          </span>
        ) : evidenceCount > 0 ? (
          <span>
            Based on evidence from {evidenceCount} independent{" "}
            {evidenceCount === 1 ? "domain" : "domains"}
          </span>
        ) : null}
      </div>

      {data.sourceUrl && (
        <p className="answer-source">
          From{" "}
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.sourceTitle || data.sourceUrl}
          </a>
        </p>
      )}

      {data.conflicting && (
        <div className="answer-conflict" role="alert">
          ⚠ Sources disagree: {data.conflictDetail || "conflicting evidence found"}.{" "}
          Read the citations below before trusting any single number.
        </div>
      )}

      {data.evidence && data.evidence.length > 0 && (
        <div className="answer-evidence-table" aria-label="Evidence">
          {data.evidence.map((e) => (
            <div className="evidence-row" key={e.url}>
              <span className="evidence-domain">{e.domain}</span>
              <span className="evidence-date">
                {e.date ? `crawled ${fmtDate(e.date)}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {data.citations && data.citations.length > 0 && (
        <div className="citations">
          {data.citations.map((c) => (
            <div className="citation" key={c.url}>
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                <p className="citation-domain">{c.domain}</p>
                <p className="citation-title">{c.title}</p>
              </a>
              {c.snippet && <p className="citation-snippet">{cleanSnippetText(c.snippet)}</p>}
              {c.checked && (
                <p className="citation-checked">checked {fmtDate(c.checked)}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="answer-disclaimer">
        {data.entityFact
          ? "Sourced from Wikidata/Wikipedia knowledge cards with last-checked dates. Verify important facts via the citations."
          : "Extracted word-for-word from indexed pages — no AI generation. Verify important facts using the citations."}
      </p>
    </section>
  );
}
