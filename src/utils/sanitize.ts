/**
 * Snippet / answer text cleanup and safe rendering.
 */

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
