/** On/off switch (Figma 36:7949 on, 36:7959 off). */
export function Switch({ checked, onChange, labelledBy }: { checked: boolean; onChange: (v: boolean) => void; labelledBy: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={`flex h-6 w-10.5 shrink-0 items-center rounded-14 p-0.75 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark ${
        checked ? 'bg-switch-on' : 'bg-switch-off'
      }`}
    >
      <span className={`size-4.5 rounded-full bg-white transition-transform motion-reduce:transition-none ${checked ? 'translate-x-4.5' : ''}`} />
    </button>
  )
}
