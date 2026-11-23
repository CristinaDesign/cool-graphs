import './ActionBar.css'

export interface ActionBarProps {
  /** Accessible name for the group, for example "Next question". Screen readers read it when focus enters the bar. */
  label: string
  /** One primary Button first, then optional related controls such as a Switch or a secondary Button. */
  children: React.ReactNode
}

/** A bar fixed to the bottom of the screen that keeps the main action in reach, so nobody has to scroll to find it.
 *  Put exactly one primary Button in it, plus at most one or two related controls (a Switch, a secondary Button).
 *  It sticks while the page is longer than the screen, and respects the safe area on phones. */
export function ActionBar({ label, children }: ActionBarProps) {
  return <div className="cg-action-bar" role="group" aria-label={label}>{children}</div>
}
