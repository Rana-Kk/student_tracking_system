import { useState } from 'react'
import type { User } from '../types'

interface Props {
  user: User
  onSave: (updated: User) => void
  onBack: () => void
}

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrator',
  teacher: 'Teacher',
  student: 'Student',
}

const AVATAR_COLORS = ['#1D4ED8', '#0891B2', '#7C3AED', '#059669', '#D97706', '#DC2626']

export default function ProfilePage({ user, onSave, onBack }: Props) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0])
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({})

  function validate() {
    const e: typeof errors = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (newPassword && !currentPassword) e.password = 'Enter your current password to change it'
    if (newPassword && newPassword !== confirmPassword) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave({ ...user, name: name.trim(), email: email.trim() })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        ← Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>My Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Manage your account details and password</p>
      </div>

      {saved && (
        <div className="mb-5 px-4 py-3 rounded-lg text-sm font-medium" style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0' }}>
          Profile saved successfully.
        </div>
      )}

      {/* Avatar */}
      <div className="rounded-xl p-6 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-4">Avatar</h2>
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: avatarColor }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{name || 'Your Name'}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{ROLE_LABEL[user.role]}</p>
            <div className="flex gap-2 mt-3">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setAvatarColor(c)}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  style={{
                    background: c,
                    border: avatarColor === c ? '2px solid var(--foreground)' : '2px solid transparent',
                    outline: avatarColor === c ? '2px solid white' : 'none',
                    outlineOffset: '-4px',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="rounded-xl p-6 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ border: `1px solid ${errors.name ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }}
              />
              {errors.name && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Role</label>
              <input
                value={ROLE_LABEL[user.role]}
                disabled
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ border: '1px solid var(--border)', background: 'var(--secondary)', color: 'var(--muted-foreground)', outline: 'none' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
              Email Address <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ border: `1px solid ${errors.email ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+60 12 345 6789"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio about yourself…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
              style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-1">Change Password</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Leave blank to keep your current password</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ border: `1px solid ${errors.password ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }}
            />
            {errors.password && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.password}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ border: `1px solid ${errors.confirm ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }}
              />
              {errors.confirm && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.confirm}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg text-sm"
          style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
