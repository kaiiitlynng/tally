/** On/off switch (Figma 36:7949 on, 36:7959 off). */
export function Switch({ checked, onChange, labelledBy, disabled = false, describedBy }: { checked: boolean; onChange: (v: boolean) => void; labelledBy: string; disabled?: boolean; describedBy?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex h-6 w-10.5 shrink-0 items-center rounded-pill p-0.75 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed ${
        checked ? 'bg-switch-on' : 'bg-switch-off'
      }`}
    >
      <span className={`size-4.5 rounded-full bg-white shadow-segment transition-transform duration-300 ease-out-expo motion-reduce:transition-none ${checked ? 'translate-x-4.5' : ''}`} />
    </button>
  )
}
