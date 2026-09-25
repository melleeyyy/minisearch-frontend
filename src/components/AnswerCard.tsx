import type { AnswerResponse } from "../services/answerApi";
import { SparkIcon } from "./icons";
import { cleanSnippetText } from "../utils/sanitize";

export default function AnswerCard({ data }: { data: AnswerResponse }) {
  const confidence = data.confidence ?? 0;
  return (
    <section className="answer-card" aria-label="Answer">
      <header className="answer-head">
        <SparkIcon size={16} />
        <span>Answer</span>
      </header>

      {data.answer && (
        <p className="answer-text">{cleanSnippetText(data.answer)}</p>
      )}

      <div className="answer-confidence">
        <div
          className="confidence-bar"
          role="progressbar"
          aria-valuenow={Math.round(confidence * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Confidence"
        >
          <div
            className="confidence-fill"
            style={{ width: `${Math.round(confidence * 100)}%` }}
          />
        </div>
        <span className="confidence-label">
          {Math.round(confidence * 100)}% confidence
        </span>
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

      {data.citations && data.citations.length > 0 && (
        <div className="citations">
          {data.citations.map((c) => (
            <div className="citation" key={c.url}>
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                <p className="citation-domain">{c.domain}</p>
                <p className="citation-title">{c.title}</p>
              </a>
              {c.snippet && <p className="citation-snippet">{cleanSnippetText(c.snippet)}</p>}
            </div>
          ))}
        </div>
      )}

      <p className="answer-disclaimer">
        Extracted word-for-word from indexed pages — no AI generation. Verify
        important facts using the citations.
      </p>
    </section>
  );
}
