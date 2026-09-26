/**
 * Snippet / answer text cleanup and safe rendering.
 */

/** Named HTML entities that show up in feed text (Google News RSS etc.). */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘",
  ldquo: "“", rdquo: "”", middot: "·", copy: "©", reg: "®", trade: "™",
};

function decodeEntities(s: string): string {
  return s.replace(/&([a-zA-Z]+|#\d{1,5}|#x[0-9a-fA-F]{1,5});/g, (m, e: string) => {
    const named = NAMED_ENTITIES[e.toLowerCase()];
    if (named !== undefined) return named;
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X"
        ? parseInt(e.slice(2), 16)
        : parseInt(e.slice(1), 10);
      if (Number.isFinite(code) && code > 0 && code < 0x110000) {
        return String.fromCodePoint(code);
      }
    }
    return m;
  });
}

/**
 * News feeds sometimes carry raw HTML markup in summary text
 * (e.g. `<a href="...">headline</a>&nbsp; <font ...>Source</font>`).
 * Strip it down to clean plain text so nothing leaks into the UI.
 */
export function stripHtml(text: string): string {
  return decodeEntities(
    text
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      // A tag truncated by the feed (e.g. `<a href="https://…` with no `>`)
      .replace(/<[a-zA-Z/!][^>]*$/g, " ")
  )
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * Maintenance markers that leak into crawled Wikipedia text, e.g.
 * "[ edit ]", "[ citation needed ]", "[1]", "[a]", "[ note 3 ]",
 * "[ when? ]", "[ disputed – discuss ]".
 */
const WIKI_MARKER =
  /\s*\[\s*(?:edit|citation\s+needed|clarification\s+needed|better\s+source\s+needed|failed\s+verification|verify|disputed(?:\s*[–-]\s*discuss)?|update|when\?|who\?|by\s+whom\?|where\?|note\s+\d+|[a-z]|\d+(?:\s*[–-]\s*\d+)?)\s*\]/gi;

/**
 * Removes wiki maintenance markers and tidies spacing artifacts.
 * Meant for plain text (no HTML). For highlighted snippets use
 * cleanSnippetHtml, which keeps <b>...</b> markup intact.
 */
export function cleanSnippetText(text: string): string {
  return text
    .replace(WIKI_MARKER, "")
    .replace(/\b(km|cm|mm|nm|kg|sq)\s*2\b/gi, "$1\u00b2")
    .replace(/\. (\p{L}{2,}) \1(?=\s)/gu, ". $1")
    .replace(/(?:^|\s)…/g, " …")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([,.;:!?])/g, "$1")
    .trim();
}

/**
 * Snippets from the API contain safe highlight markup (<b>...</b> only).
 * Belt-and-braces: strip any tag that is not <b> or </b> before rendering.
 */
export function safeSnippetHtml(html: string): string {
  return html.replace(/<(?!\/?b\b)[^>]*>/gi, "");
}

/**
 * Clean + sanitize a highlighted snippet while preserving its <b> tags.
 * If the snippet contains a section-heading duplication (e.g.
 * "Tripura. Kerala [ edit ] Kerala topped…"), highlighting is dropped for
 * that snippet so the duplicate can be collapsed safely.
 */
export function cleanSnippetHtml(html: string): string {
  const plain = html.replace(/<[^>]*>/g, "");
  // Heading duplicates (e.g. "Tripura. Kerala [ edit ] Kerala topped…")
  // only become visible after markers are removed from the plain text.
  if (/\. (\p{L}{2,}) \1(?=\s)/u.test(plain.replace(WIKI_MARKER, ""))) {
    return safeSnippetHtml(cleanSnippetText(plain));
  }
  return safeSnippetHtml(cleanSnippetText(html));
}
