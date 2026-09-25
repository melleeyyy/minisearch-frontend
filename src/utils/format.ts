/** Formatting helpers. */

export function formatNumber(n: number | undefined | null): string {
  if (n === undefined || n === null || Number.isNaN(n)) return "0";
  return n.toLocaleString("en-IN");
}

/** Accepts an ISO string or an epoch (s/ms) value. */
function toDate(v: string | number | null | undefined): Date | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") {
    return new Date(v < 1e12 ? v * 1000 : v);
  }
  const asNum = Number(v);
  if (!Number.isNaN(asNum) && v.trim() !== "") {
    return new Date(asNum < 1e12 ? asNum * 1000 : asNum);
  }
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function timeAgo(v: string | number | null | undefined): string {
  const d = toDate(v);
  if (!d) return "";
  const secs = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export function formatMs(v: number | undefined): string {
  if (v === undefined || v === null) return "—";
  return `${Math.round(v)} ms`;
}

export function formatPercent(v: number | undefined): string {
  if (v === undefined || v === null) return "—";
  return `${Math.round(v * 100)}%`;
}
