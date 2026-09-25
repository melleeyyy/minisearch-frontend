/**
 * Snippets from the API contain safe highlight markup (<b>...</b> only).
 * Belt-and-braces: strip any tag that is not <b> or </b> before rendering.
 */
export function safeSnippetHtml(html: string): string {
  return html.replace(/<(?!\/?b\b)[^>]*>/gi, "");
}
