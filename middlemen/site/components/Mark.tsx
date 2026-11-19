import { WORDMARK } from "./wordmarkPath";

/** The Between: two pillars (the two sides of a deal) and the point (Middlemen). */
export function Mark({ className, title = "Middlemen" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label={title}>
      <rect className="mk-l" x="20" y="22" width="16" height="76" fill="currentColor" />
      <rect className="mk-r" x="84" y="22" width="16" height="76" fill="currentColor" />
      <circle className="mk-d" cx="60" cy="60" r="10" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={`0 ${-WORDMARK.h} ${WORDMARK.w} ${WORDMARK.h}`} role="img" aria-label="Middlemen">
      <path d={WORDMARK.d} fill="currentColor" />
    </svg>
  );
}
