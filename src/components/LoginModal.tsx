import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { post } from '../utils/net'
import { Logo } from './Logo'
import { useAuth } from '../context/AuthContext'
import type { AuthResponse } from '../utils/auth'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const { t } = useTranslation()
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!username || !password) {
            setError(t('auth.fillUsernamePassword'))
            return
        }

        setIsLoading(true)
        try {
            const authResponse = await post<AuthResponse>('/auth/login', {
                username,
                password
            })

            // Save auth data to localStorage and context
            login(authResponse)

            // Call success callback to navigate to library
            onSuccess()
        } catch (err: any) {
            setError(err.message || t('auth.loginError'))
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
                    aria-label="关闭"
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
                        {t('auth.loginTitle')}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="login-username" className="block text-sm font-medium text-[var(--text)]">
                            {t('auth.username')}
                        </label>
                        <input
                            id="login-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            placeholder={t('auth.enterUsername')}
                            disabled={isLoading}
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-[var(--text)]">
                            {t('auth.password')}
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            placeholder={t('auth.enterPassword')}
                            disabled={isLoading}
                            autoComplete="current-password"
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
                        {isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
                    </button>
                </form>
            </div>
        </div>
    )
}
