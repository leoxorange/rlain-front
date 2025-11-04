import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { post } from '../utils/net'
import { Logo } from './Logo'
import { useAuth } from '../context/AuthContext'
import type { AuthResponse } from '../utils/auth'

interface CreateUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CreateRootUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
    const { t } = useTranslation()
    const { login } = useAuth()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!password) {
            setError(t('auth.fillPassword'))
            return
        }

        if (password !== confirmPassword) {
            setError(t('auth.passwordMismatch'))
            return
        }

        setIsLoading(true)
        try {
            const authResponse = await post<AuthResponse>('/auth/rootset', {
                password,
                email: 'test@test.com',
                nickname: 'test'
            })

            // Save auth data to localStorage and context
            login(authResponse)

            // Call success callback to navigate to library
            onSuccess()
        } catch (err: any) {
            console.log(err)
            setError(err.message || t('auth.registerError'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
            style={{ margin: 0 }}
        >
            <div className="modal-content relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl m-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)]"
                    aria-label={t('common.close')}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text)]"><Logo /></h2>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                        {t('auth.registerSubtitle')}
                    </p>

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-[var(--text)]">
                            {t('auth.username')}
                        </label>
                        <input
                            id="username"
                            type="text"
                            value='root'
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            disabled
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--text)]">
                            {t('auth.password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            placeholder={t('auth.enterPassword')}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text)]">
                            {t('auth.confirmPassword')}
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            placeholder={t('auth.reenterPassword')}
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-brand-grad px-4 py-3 font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t('auth.creating') : t('auth.registerButton')}
                    </button>
                </form>
            </div>
        </div>
    )
}
