import type { ResearchItem } from "../services/knowledgeApi";
import { cleanSnippetText } from "../utils/sanitize";

const SOURCE_LABEL: Record<string, string> = {
  arxiv: "arXiv",
  pubmed: "PubMed",
  crossref: "Crossref",
  openalex: "OpenAlex",
};

/** V3.8 — one academic paper row from the merged research search. */
export default function ResearchCard({ item }: { item: ResearchItem }) {
  const authors = item.authors.slice(0, 3).join(", ");
  return (
    <article className="research-card">
      <div className="research-meta">
        <span className="research-source">
          {SOURCE_LABEL[item.source] ?? item.source}
        </span>
        {item.year ? <span className="research-year">{item.year}</span> : null}
        {item.cited_by > 0 && (
          <span className="research-cites">
            {item.cited_by.toLocaleString("en-IN")} citations
          </span>
        )}
      </div>
      <h3 className="research-title">
        <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
      </h3>
      {authors && <p className="research-authors">{authors}</p>}
      {item.venue && <p className="research-venue">{item.venue}</p>}
      {item.abstract && (
        <p className="research-abstract">{cleanSnippetText(item.abstract)}</p>
      )}
      {item.doi && (
        <a className="research-doi" href={`https://doi.org/${item.doi}`}
           target="_blank" rel="noreferrer">doi:{item.doi}</a>
      )}
    </article>
  );
}
