import { useState, useEffect } from 'react'
import { get } from '../utils/net'

interface PathBrowserProps {
    initialPath?: string
    onSelect: (path: string) => void
    onClose: () => void
}

export const PathBrowser = ({ initialPath, onSelect, onClose }: PathBrowserProps) => {
    const [currentPath, setCurrentPath] = useState(initialPath || '')
    const [directories, setDirectories] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadDirectories(currentPath)
    }, [currentPath])

    const loadDirectories = async (path: string) => {
        setIsLoading(true)
        setError(null)
        try {
            let data: DirectoryInfo
            if (!path || path === '') {
                data = await get<DirectoryInfo>(`/libraries/paths`)
            } else {
                data = await get<DirectoryInfo>(`/libraries/paths`, { path: path })
            }
            setDirectories(data.directories)
        } catch (err) {
            console.error('Failed to load directories:', err)
            setError('Failed to load directories')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDirectoryClick = (dir: string) => {
        if (dir) {
            setCurrentPath(dir)
        }
    }

    const handleGoUp = () => {
        if (currentPath) {
            const parentPath = currentPath.split('/').slice(0, -1).join('/')
            setCurrentPath(parentPath)
        }
    }

    const handleSelectCurrent = () => {
        onSelect(currentPath || '/')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
                    <h3 className="text-lg font-semibold text-[var(--text)]">Browse Directories</h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)]"
                        aria-label="Close"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Current Path */}
                <div className="border-b border-[var(--border)] bg-[var(--bg-alt)] px-6 py-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--muted)]">Current Path:</span>
                        <code className="flex-1 rounded bg-[var(--overlay)] px-2 py-1 text-sm text-[var(--text)] font-mono">
                            {currentPath || '/'}
                        </code>
                        {currentPath && (
                            <button
                                onClick={handleGoUp}
                                className="rounded-lg px-3 py-1 text-sm text-[var(--primary)] hover:bg-[var(--primary)]/10"
                                title="Go up one level"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Directory List */}
                <div className="max-h-96 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="py-12 text-center text-sm text-[var(--muted)]">
                            Loading directories...
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center">
                            <p className="text-sm text-red-500">{error}</p>
                            <button
                                onClick={() => loadDirectories(currentPath)}
                                className="mt-2 text-sm text-[var(--primary)] hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    ) : directories.length === 0 ? (
                        <div className="py-12 text-center text-sm text-[var(--muted)]">
                            No directories found
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {directories && directories.map((dir, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDirectoryClick(dir)}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--overlay)]"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="flex-shrink-0 text-[var(--primary)]"
                                    >
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span className="flex-1 truncate text-sm text-[var(--text)]">{dir}</span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="flex-shrink-0 text-[var(--muted)]"
                                    >
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSelectCurrent}
                        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        Select "{currentPath || '/'}"
                    </button>
                </div>
            </div>
        </div>
    )
}
