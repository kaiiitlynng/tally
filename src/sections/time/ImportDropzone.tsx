import { useState, type DragEvent } from 'react'
import { FieldMessage } from '../../components/Field'
import { Icon } from '../../components/Icon'

const EXCEL = /\.(xlsx|xls)$/i

/**
 * Excel drop zone (Figma 36:1990). This is a synthetic demo: a dropped .xlsx/.xls file, or clicking
 * the zone, loads the demo spreadsheet. Nothing is uploaded. Any other file type shows an error.
 */
export function ImportDropzone({ onFile, bare = false }: { onFile: () => void; /** No card chrome, shorter zone (Home). */ bare?: boolean }) {
  const [dragging, setDragging] = useState(false)
  const [rejected, setRejected] = useState('')

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && !EXCEL.test(file.name)) {
      setRejected(file.name)
      return
    }
    setRejected('')
    onFile()
  }

  return (
    <section aria-label="Import Excel" className={bare ? '' : 'min-h-80 rounded-lg border border-line bg-surface p-5 shadow-card'}>
      <button
        type="button"
        onClick={() => {
          setRejected('')
          onFile()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        aria-describedby={rejected ? 'import-error' : undefined}
        className={`group flex ${bare ? 'h-52' : 'h-68.75'} w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-[background-color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          rejected ? 'border-error-line bg-error-soft' : dragging ? 'border-brand bg-brand-50' : bare
              ? 'border-line-dashed bg-wash hover:border-brand-200 hover:bg-white' // Home: lighter fill inside the start card
              : 'border-line-dashed bg-dropzone hover:border-brand-200 hover:bg-white'
        }`}
      >
        {/* Tile hops up while hovering or dragging a file over the zone. */}
        <span
          className={`grid place-items-center transition-transform duration-300 ease-out-expo group-hover:-translate-y-1 motion-reduce:transition-none ${dragging ? '-translate-y-1.5 scale-110' : ''}`}
        >
          <Icon name="upload-large" size={24} />
        </span>
        <span className="pt-4 pb-1 text-lead font-semibold text-ink">Drop an Excel timesheet here</span>
        <span className="pb-4 text-small text-ink-muted">or select a file from your device · .xlsx, .xls</span>
        <span className="inline-flex h-9 items-center rounded-sm border border-line bg-white px-3.5 text-small font-semibold text-ink shadow-card transition-colors group-hover:border-brand-200 group-hover:text-brand">Select demo file</span>
      </button>
      {rejected && (
        <div className="flex justify-center pt-2.5">
          {/* Draft copy, pending approval: not in Figma or the code layer. */}
          <FieldMessage tone="error" id="import-error">
            “{rejected}” isn’t an Excel file. Drop a .xlsx or .xls timesheet, or select the demo file.
          </FieldMessage>
        </div>
      )}
    </section>
  )
}
