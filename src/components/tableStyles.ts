/**
 * One look for every data table in the app (owner request 2026-11-10): light header band, sentence-case
 * semibold labels, 56px rows with hairline dividers, 16px side padding, row hover. Wrap with TABLE_WRAP (add
 * shadow-card for tables that sit directly on the page). The client invoice document keeps its own style.
 */
export const TABLE_WRAP = 'overflow-hidden rounded-lg border border-line bg-surface'
export const TABLE = 'w-full table-fixed border-collapse'
export const TH = 'h-10 bg-table-head pr-4 text-left align-middle text-caption font-semibold text-ink-th'
export const TD = 'h-14 border-t border-line-row py-2.5 pr-4 align-middle text-small text-ink'
export const ROW = 'transition-colors duration-150 hover:bg-hover'
/** First cell of a row (header or body): left padding. */
export const FIRST = 'pl-4'
