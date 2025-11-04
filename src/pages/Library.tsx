import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { get } from '../utils/net'
import clsx from 'clsx'
import { Logo } from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import { SettingsMenu } from '../components/SettingsMenu'
import { LibrarySwitcher } from '../components/LibrarySwitcher'

interface Album {
    id: string
    title: string
    artist: string
    coverUrl?: string
    year?: number
    tracks?: number
}

export default function Library() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const [albums, setAlbums] = useState<Album[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentLibraryId, setCurrentLibraryId] = useState<string>('1')

    useEffect(() => {
        loadAlbums()
    }, [currentLibraryId])

    const loadAlbums = async () => {
        try {
            // TODO: Replace with actual API endpoint that uses currentLibraryId
            const data = await get<Album[]>(`/albums?libraryId=${currentLibraryId}`)
            setAlbums(data)
        } catch (err) {
            console.error('Failed to load albums:', err)
            // Mock data for now
            setAlbums([
                { id: '1', title: 'Abbey Road', artist: 'The Beatles', year: 1969, tracks: 17 },
                { id: '2', title: 'Dark Side of the Moon', artist: 'Pink Floyd', year: 1973, tracks: 10 },
                { id: '3', title: 'Thriller', artist: 'Michael Jackson', year: 1982, tracks: 9 },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleLibraryChange = (libraryId: string) => {
        setCurrentLibraryId(libraryId)
        setIsLoading(true)
    }

    const filteredAlbums = albums.filter(album =>
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r border-[var(--border)] bg-[var(--card)] p-6">
                <div className="mb-8">
                    <Logo className='text-3xl'/>
                </div>

                <nav className="space-y-2">
                    <a href="#" className="flex items-center gap-3 rounded-lg bg-[var(--primary)]/10 px-4 py-3 text-[var(--primary)] font-medium">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                        </svg>
                        {t('library.musicLibrary')}
                    </a>
                    <a href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                        {t('library.playlists')}
                    </a>
                    <a href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        {t('library.artists')}
                    </a>
                    <a href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M2 12h20"></path>
                        </svg>
                        {t('library.genres')}
                    </a>
                </nav>

                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                    {/* User Info */}
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] p-4">
                        <p className="text-xs text-[var(--muted)]">{t('library.currentUser')}</p>
                        <p className="mt-1 text-sm font-medium text-[var(--text)] truncate">{user?.nickname || user?.username}</p>
                        <p className="text-xs text-[var(--muted)] truncate">{user?.email}</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-bold text-[var(--text)]">{t('library.title')}</h2>
                            <LibrarySwitcher
                                currentLibraryId={currentLibraryId}
                                onLibraryChange={handleLibraryChange}
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <ThemeSwitcher />
                            <SettingsMenu />
                        </div>


                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('library.searchPlaceholder')}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-4 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                        />
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                </div>

                {/* Albums Grid */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="text-[var(--muted)]">{t('library.loading')}</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {filteredAlbums.map((album) => (
                            <div
                                key={album.id}
                                onClick={() => setSelectedAlbum(album)}
                                className={clsx(
                                    "group cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:scale-105 hover:shadow-xl",
                                    selectedAlbum?.id === album.id && "ring-2 ring-[var(--primary)]"
                                )}
                            >
                                {/* Album Cover */}
                                <div className="mb-4 aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
                                    {album.coverUrl ? (
                                        <img src={album.coverUrl} alt={album.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Album Info */}
                                <h3 className="mb-1 truncate text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)]">
                                    {album.title}
                                </h3>
                                <p className="truncate text-xs text-[var(--muted)]">{album.artist}</p>
                                {album.year && (
                                    <p className="mt-1 text-xs text-[var(--muted)]">{album.year}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredAlbums.length === 0 && (
                    <div className="flex h-64 flex-col items-center justify-center text-center">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-[var(--muted)]">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                        </svg>
                        <p className="text-lg text-[var(--muted)]">
                            {searchQuery ? t('library.noResults') : t('library.emptyLibrary')}
                        </p>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                            {searchQuery ? t('library.tryOtherSearch') : t('library.addMusic')}
                        </p>
                    </div>
                )}
            </main>

            {/* Now Playing Bar */}
            <div className="fixed bottom-0 left-64 right-0 border-t border-[var(--border)] bg-[var(--card)] px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]"></div>
                        <div>
                            <p className="text-sm font-medium text-[var(--text)]">-</p>
                            <p className="text-xs text-[var(--muted)]">-</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                                <line x1="5" y1="19" x2="5" y2="5"></line>
                            </svg>
                        </button>
                        <button className="rounded-full bg-[var(--primary)] p-3 text-white hover:opacity-90">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        </button>
                        <button className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                                <line x1="19" y1="5" x2="19" y2="19"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                        <div className="h-1 w-24 rounded-full bg-[var(--border)]">
                            <div className="h-full w-3/4 rounded-full bg-[var(--primary)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
