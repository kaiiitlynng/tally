import { useState, type DragEvent } from 'react'
import { Icon } from '../../components/Icon'

/**
 * Excel drop zone (Figma 36:1990). This is a synthetic demo: any dropped file, or clicking
 * the zone, loads the demo spreadsheet. Nothing is uploaded.
 */
export function ImportDropzone({ onFile }: { onFile: () => void }) {
  const [dragging, setDragging] = useState(false)

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    onFile()
  }

  return (
    <section aria-label="Import Excel" className="min-h-80 rounded-16 border border-line bg-surface p-5.25">
      <button
        type="button"
        onClick={onFile}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex h-68.75 w-full flex-col items-center justify-center rounded-16 border border-dashed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark ${
          dragging ? 'border-ink-field bg-white' : 'border-line-dashed bg-dropzone hover:bg-white'
        }`}
      >
        <span className="grid size-13 place-items-center rounded-15 bg-dropzone-tile">
          <Icon name="upload-large" size={24} />
        </span>
        <span className="pt-3.25 pb-1 text-14 text-ink">Drop an Excel timesheet here</span>
        <span className="pb-3.25 text-9 text-ink-muted">or select a file from your device · .xlsx, .xls</span>
        <span className="rounded-14 border border-line bg-white px-2.75 py-1.75 text-8 text-ink">Select demo file</span>
      </button>
    </section>
  )
}
