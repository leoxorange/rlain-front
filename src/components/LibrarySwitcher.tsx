import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'

interface LibrarySwitcherProps {
    currentLibraryId?: string
    onLibraryChange: (libraryId: string) => void
}

export const LibrarySwitcher = ({ currentLibraryId, onLibraryChange }: LibrarySwitcherProps) => {
    const { t } = useTranslation()
    const { libraries, isLoadingLibraries } = useApp()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

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

    const handleLibrarySelect = (libraryId: number) => {
        onLibraryChange(String(libraryId))
        setIsOpen(false)
    }

    const currentLibrary = libraries.find(lib => String(lib.id) === currentLibraryId)

    return (
        <div className="relative">
            {/* Library Switcher Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="btn-ring flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[color-mix(in srgb,var(--card),var(--overlay) 40%)]"
                aria-label={t('library.switchLibrary')}
                title={t('library.switchLibrary')}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="hidden sm:inline">{currentLibrary?.name || t('library.selectLibrary')}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 overflow-hidden"
                    style={{
                        animation: 'fadeIn 150ms ease-out'
                    }}
                >
                    {/* Header */}
                    <div className="border-b border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3">
                        <h3 className="text-sm font-semibold text-[var(--text)]">{t('library.yourLibraries')}</h3>
                    </div>

                    {/* Library List */}
                    <div className="max-h-80 overflow-y-auto py-2">
                        {isLoadingLibraries ? (
                            <div className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                                {t('library.loading')}
                            </div>
                        ) : libraries.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                                {t('library.noLibraries')}
                            </div>
                        ) : (
                            libraries.map((library) => (
                                <button
                                    key={library.id}
                                    onClick={() => handleLibrarySelect(library.id)}
                                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                                        String(library.id) === currentLibraryId
                                            ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                            : 'text-[var(--text)] hover:bg-[var(--overlay)]'
                                    }`}
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mt-0.5 flex-shrink-0"
                                    >
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium truncate">{library.name}</p>
                                            {String(library.id) === currentLibraryId && (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-[var(--muted)] truncate font-mono">
                                            {String(library.path)}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer - Add New Library */}
                    <div className="border-t border-[var(--border)] p-2">
                        <button
                            onClick={() => {
                                console.log('Create new library')
                                setIsOpen(false)
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            <span>{t('library.createNew')}</span>
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
    )
}
