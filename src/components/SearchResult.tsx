import type { SearchResultItem } from "../services/searchApi";
import { timeAgo } from "../utils/format";
import { safeSnippetHtml } from "../utils/sanitize";

export default function SearchResult({ item }: { item: SearchResultItem }) {
  return (
    <article className="result">
      <div className="result-meta-line">
        <span className="domain-tag" title={item.domain}>
          {item.domain}
        </span>
        <span className="result-url">{item.displayUrl}</span>
      </div>
      <h3 className="result-title">
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </h3>
      <p
        className="result-snippet"
        dangerouslySetInnerHTML={{ __html: safeSnippetHtml(item.snippet) }}
      />
      <div className="result-foot">
        {item.language && <span>{item.language}</span>}
        {item.crawledAt && <span>indexed {timeAgo(item.crawledAt)}</span>}
      </div>
    </article>
  );
}
