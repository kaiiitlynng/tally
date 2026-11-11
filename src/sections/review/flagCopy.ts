import { type Entry, type Flag, type Store } from '../../data/store'

/** Which existing ReviewPanel handler an action calls. */
export type FlagAction = 'accept' | 'dismiss' | 'keep' | 'edit' | 'ask'

export interface FlagCopy {
  /** Plain yes/no question shown as the panel headline. */
  question: string
  /** One short plain-language sentence explaining why Tally is asking. */
  explanation: string
  /** Before → after rows (or plain fact rows when `after` is absent). Never repeats a number from the question. */
  rows: { label: string; before: string; after?: string }[]
  primary: { label: string; action: FlagAction }
  secondary: { label: string; action: FlagAction }
  more: { label: string; action: FlagAction }[]
}

/** Hours without a trailing ".0": 2, 9.3, 20. */
export const hoursText = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 })
/** Dollars without cents when whole: $12,400, $1,240.50. */
const dollars = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })
/** "Fri, May 16" */
export const dayText = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
const shortDay = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

/** Total hours a person logged on one date, across all projects. */
const dayTotal = (s: Store, person: string, date: string) => s.entries.filter((e) => e.employee === person && e.date === date).reduce((n, e) => n + e.hours, 0)

/** The person's largest daily total on any other day (undefined when there is no other day). */
function longestOtherDay(s: Store, entry: Entry) {
  const days = new Set(s.entries.filter((e) => e.employee === entry.employee && e.date !== entry.date).map((e) => e.date))
  const totals = [...days].map((d) => dayTotal(s, entry.employee, d))
  return totals.length ? Math.max(...totals) : undefined
}

/**
 * Turns a flag into review-panel copy (owner request 2026-11-10: plain questions, no jargon). Everything is
 * derived from the flag and its entry, so it works for the seeded flags, derived daily-hours flags and the
 * warnings employees confirm before submitting.
 */
export function flagCopy(s: Store, flag: Flag, entry: Entry): FlagCopy {
  const first = entry.employee.split(' ')[0]
  const ask = { label: `Ask ${first}`, action: 'ask' as const }
  const editHours = { label: 'Edit hours myself', action: 'edit' as const }
  const hours = hoursText(entry.hours)
  const what = entry.description.toLowerCase()

  // A concrete hours change Tally proposes (e.g. a likely typo: 20 → 2).
  if (flag.change?.field === 'Hours') {
    const from = Number(flag.change.from)
    const to = Number(flag.change.to)
    const other = longestOtherDay(s, entry)
    return {
      question: `Did ${first} mean ${hoursText(to)} hours, not ${hoursText(from)}?`,
      explanation:
        other !== undefined
          ? `${first}'s longest other day was ${hoursText(other)} hours, so ${hoursText(from)} hours of ${what} looks like a typo.`
          : `${hoursText(from)} hours of ${what} in one day looks like a typo.`,
      rows: [
        { label: 'Hours', before: hoursText(from), after: hoursText(to) },
        { label: 'Client billed', before: dollars(from * entry.rate), after: dollars(to * entry.rate) },
      ],
      primary: { label: `Change to ${hoursText(to)} hours`, action: 'accept' },
      secondary: { label: `${hoursText(from)} is correct`, action: 'dismiss' },
      more: [editHours, ask],
    }
  }

  // Derived daily-hours flag: the person's day is over the firm's limit.
  if (flag.kind === 'daily') {
    const total = dayTotal(s, entry.employee, entry.date)
    return {
      question: `Was ${hoursText(total)} hours on ${shortDay(entry.date)} correct?`,
      explanation: `That's more than your firm's ${s.threshold}-hour daily limit, counting all of ${first}'s projects that day.`,
      // The day's total is already in the question and the limit in the explanation, so no number rows.
      rows: [],
      primary: { label: `Yes, keep ${hoursText(total)} hours`, action: 'keep' },
      secondary: { label: 'Change the hours', action: 'edit' },
      more: [ask],
    }
  }

  // Description too short for the client to understand the work.
  if (flag.type === 'Vague description' || flag.type === 'More detail helpful') {
    return {
      question: 'Does this entry need more detail?',
      explanation: `“${entry.description}” doesn't say what the work was, and clients expect enough detail to understand each charge.`,
      rows: [],
      primary: { label: `Ask ${first} for detail`, action: 'ask' },
      secondary: { label: 'It’s detailed enough', action: 'dismiss' },
      more: [{ label: 'Mark as fixed', action: 'accept' }],
    }
  }

  // Warnings the employee saw and confirmed before submitting (useCommitEntry).
  const questions: Record<string, string> = {
    'Long entry': `Was ${hours} hours on ${shortDay(entry.date)} correct?`,
    'Higher than usual': `Was ${hours} hours on ${shortDay(entry.date)} correct?`,
    'Daily total': `Was ${hoursText(dayTotal(s, entry.employee, entry.date))} hours on ${shortDay(entry.date)} correct?`,
    'Possible duplicate': 'Is this entry a duplicate?',
    'Work date': `Is ${shortDay(entry.date)} the right work date?`,
    'Submitted period': `Should ${first}'s change after submitting stand?`,
  }
  const aboutHours = ['Long entry', 'Higher than usual', 'Daily total'].includes(flag.type)
  return {
    question: questions[flag.type] ?? `Is ${first}'s entry correct?`,
    explanation: `${first} saw this warning and confirmed the entry: “${flag.title}”`,
    rows: [],
    primary: { label: aboutHours ? `Yes, keep ${flag.type === 'Daily total' ? hoursText(dayTotal(s, entry.employee, entry.date)) : hours} hours` : 'Yes, keep it', action: 'accept' },
    secondary: { label: 'Edit hours myself', action: 'edit' },
    more: [ask, { label: 'Ignore this', action: 'dismiss' }],
  }
}
