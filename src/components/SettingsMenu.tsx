import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Logo } from './Logo'
import { SettingsPanel } from './SettingsPanel'

export const SettingsMenu = () => {
    const { t } = useTranslation()
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleLogout = () => {
        logout()
        navigate('/')
        setIsOpen(false)
    }

    const handlePreferences = () => {
        setIsPanelOpen(true)
        setIsOpen(false)
    }

    const handlePersonalize = () => {
        // TODO: Navigate to personalization page or open personalization modal
        console.log('Open Personalize')
        setIsOpen(false)
    }

    return (
        <>
            <div className="relative">
                {/* Settings Button */}
                <button
                    ref={buttonRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className="btn-ring rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text)] hover:bg-[color-mix(in srgb,var(--card),var(--overlay) 40%)]"
                    aria-label={t('settings.title')}
                    title={t('settings.title')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m-5-7H1m6 0h6m6 0h6m-6 0h-6M7 7l-3 3m3-3l3 3m7-3l3 3m-3-3l-3 3"></path>
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div
                        ref={menuRef}
                        className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 overflow-hidden"
                        style={{
                            animation: 'fadeIn 150ms ease-out'
                        }}
                    >
                        {/* Header with Logo and Version */}
                        <div className="border-b border-[var(--border)] bg-[var(--bg-alt)] px-4 py-4">
                            <div className="mb-2">
                                <Logo />
                            </div>
                            <p className="text-xs text-[var(--muted)]">{t('library.currentUser')} {user?.nickname || user?.username}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <button
                                onClick={handlePreferences}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                                <span>{t('settings.preferences')}</span>
                            </button>

                            <button
                                onClick={handlePersonalize}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>{t('settings.personalize')}</span>
                            </button>

                            <div className="my-2 border-t border-[var(--border)]"></div>

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span>{t('settings.logout')}</span>
                            </button>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(-8px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>

            {/* Settings Panel */}
            <SettingsPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
        </>
    )
}
