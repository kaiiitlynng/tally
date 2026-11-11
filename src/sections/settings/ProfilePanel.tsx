import { useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { TextInput } from '../../components/Field'
import { money } from '../../data/store'

const ROW = 'flex min-h-14 items-center gap-4 border-b border-line-row py-3 last:border-b-0'
const TERM = 'w-40 shrink-0 text-small text-ink-muted'
const PEN =
  'grid size-8 shrink-0 place-items-center rounded-sm text-ink-muted transition-colors hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-accent'

type Editable = 'photo' | 'name' | 'email'

/**
 * Settings → Profile for both roles (owner request 2026-11-10): each editable setting (photo, name, email) has its
 * own pen button that opens it in place with "Save" / "Cancel". Role, access and rate are read-only. The name is
 * how you're shown (sidebar, greeting); records keep your original name. The photo stays in this browser session.
 */
export function ProfilePanel() {
  const { store, update, me, role, toast } = useDemo()
  const member = store.team.find((m) => m.name === me.name)
  const [editing, setEditing] = useState<Editable | null>(null)
  const [draft, setDraft] = useState('')
  const [tried, setTried] = useState(false)

  const open = (field: Editable) => {
    setEditing(field)
    setTried(false)
    setDraft(field === 'name' ? me.displayName : field === 'email' ? (member?.email ?? '') : '')
  }
  const error =
    editing === 'name' && !draft.trim()
      ? 'Please enter your name.'
      : editing === 'email' && !/^\S+@\S+\.\S+$/.test(draft.trim())
        ? 'Please enter a valid email address.'
        : undefined

  function save() {
    setTried(true)
    if (error) return
    update((s) => {
      if (editing === 'name') s.profiles[me.name] = { ...s.profiles[me.name], name: draft.trim() }
      if (editing === 'email') {
        const m = s.team.find((x) => x.name === me.name)
        if (m) m.email = draft.trim()
      }
    })
    toast('Profile saved')
    setEditing(null)
  }

  function setAvatar(avatar: string | undefined) {
    update((s) => {
      s.profiles[me.name] = { ...s.profiles[me.name], avatar }
    })
    toast(avatar ? 'Photo updated' : 'Photo removed')
    setEditing(null)
  }
  function onPhoto(file?: File) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(String(reader.result))
    reader.readAsDataURL(file)
  }

  const pen = (field: Editable, label: string) =>
    editing !== field && (
      <button type="button" aria-label={`Edit ${label}`} onClick={() => open(field)} className={PEN}>
        <Icon tint name="edit" size={16} />
      </button>
    )
  const actions = (
    <div className="flex gap-2 pt-2">
      <DarkButton onClick={save} className="h-9 text-small">
        Save
      </DarkButton>
      <OutlineButton onClick={() => setEditing(null)} className="h-9 text-small">
        Cancel
      </OutlineButton>
    </div>
  )

  const textRow = (field: 'name' | 'email', label: string, value: string, type = 'text') => (
    <div className={ROW}>
      <span className={TERM}>{label}</span>
      {editing === field ? (
        <div className="min-w-0 flex-1">
          <TextInput
            id={`profile-${field}`}
            type={type}
            autoFocus
            aria-label={label}
            value={draft}
            aria-invalid={tried && !!error}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') setEditing(null)
            }}
          />
          {tried && error && <p className="pt-1 text-caption text-error-ink">{error}</p>}
          {actions}
        </div>
      ) : (
        <span className="min-w-0 flex-1 truncate text-small font-semibold text-ink">{value}</span>
      )}
      {pen(field, label.toLowerCase())}
    </div>
  )

  return (
    <div className="mt-5.5 max-w-140">
      <div className={ROW}>
        <span className={TERM}>Photo</span>
        <div className="flex flex-1 items-center gap-3">
          {me.avatar ? (
            <img src={me.avatar} alt="Your profile photo" className="size-12 rounded-full object-cover" />
          ) : (
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-avatar text-body font-semibold text-avatar-ink">
              {me.initials}
            </span>
          )}
          {editing === 'photo' && (
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex h-9 cursor-pointer items-center rounded-sm border border-line bg-surface px-3 text-small font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-hover has-focus-visible:outline-2 has-focus-visible:outline-accent">
                {me.avatar ? 'Change photo' : 'Upload photo'}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => onPhoto(e.target.files?.[0])} />
              </label>
              {me.avatar && (
                <OutlineButton onClick={() => setAvatar(undefined)} className="h-9 text-small">
                  Remove
                </OutlineButton>
              )}
              <OutlineButton onClick={() => setEditing(null)} className="h-9 text-small">
                Cancel
              </OutlineButton>
            </div>
          )}
        </div>
        {pen('photo', 'photo')}
      </div>
      {textRow('name', 'Name', me.displayName)}
      {textRow('email', 'Email', member?.email ?? '—', 'email')}
      {[
        ['Role', role === 'partner' ? 'Partner' : 'Employee'],
        ['Access', role === 'partner' ? 'All projects' : 'Assigned projects only'],
        ['Standard rate', `${money(store.rates[me.name] ?? 0)} / hour${role === 'employee' ? ' · set by your partner' : ''}`],
      ].map(([term, value]) => (
        <div key={term} className={ROW}>
          <span className={TERM}>{term}</span>
          <span className="text-small font-semibold text-ink">{value}</span>
        </div>
      ))}
    </div>
  )
}
