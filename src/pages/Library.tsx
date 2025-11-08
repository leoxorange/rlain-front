import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { get } from '../utils/net'
import clsx from 'clsx'
import { Logo } from '../components/Logo'
import { useApp } from '../context/AppContext'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import { SettingsMenu } from '../components/SettingsMenu'
import { LibrarySwitcher } from '../components/LibrarySwitcher'
import { AlbumModal } from '../components/AlbumModal'
import { NowPlayingBar } from '../components/NowPlayingBar'
import { FullscreenPlayer } from '../components/FullscreenPlayer'
import { artworkToDataUrl } from '../utils/kit'



export default function Library() {
    const { t } = useTranslation()

    const { libraries, currentLibraryId, setCurrentLibraryId, isFullscreenPlayerOpen, setIsFullscreenPlayerOpen } = useApp()
    const [albums, setAlbums] = useState<Album[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Auto-select first library on mount
    useEffect(() => {
        if (libraries.length > 0 && currentLibraryId === null) {
            setCurrentLibraryId(libraries[0].id)
        }
    }, [libraries, currentLibraryId, setCurrentLibraryId])

    useEffect(() => {
        if (currentLibraryId !== null) {
            loadAlbums()
        }
    }, [currentLibraryId])

    const loadAlbums = async () => {
        //no library select, no result returned.
        if (currentLibraryId === null) return;
        try {
            const data = await get<Album[]>(`/albums?library_id=${currentLibraryId}`)
            setAlbums(data)
        } catch (err) {
            console.error('Failed to load albums:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLibraryChange = (libraryId: string) => {
        setCurrentLibraryId(Number(libraryId))
        setIsLoading(true)
    }

    const filteredAlbums = albums.filter(album =>
        album.album_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.album_artist.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r border-[var(--border)] bg-[var(--card)] p-6">
                <div className="mb-8">
                    <Logo className='text-3xl' />
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
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8 pb-32">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-bold text-[var(--text)]">{t('library.title')}</h2>
                            <LibrarySwitcher
                                currentLibraryId={currentLibraryId !== null ? String(currentLibraryId) : undefined}
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
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
                        {filteredAlbums.map((album, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedAlbum(album)}
                                className={clsx(
                                    "group cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:scale-105 hover:shadow-xl",
                                    selectedAlbum?.album_name === album.album_name && "ring-2 ring-[var(--primary)]"
                                )}
                            >
                                {/* Album Cover */}
                                <div className="mb-4 aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
                                    {album.artwork ? (
                                        <img src={artworkToDataUrl(album.artwork)} alt={album.album_name} className="h-full w-full object-cover" />
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
                                    {album.album_name}
                                </h3>
                                <p className="truncate text-xs text-[var(--muted)]">{album.album_artist}</p>
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

            {/* Album Modal */}
            {selectedAlbum && (
                <AlbumModal
                    album={selectedAlbum}
                    onClose={() => setSelectedAlbum(null)}
                />
            )}

            {/* Now Playing Bar */}
            <NowPlayingBar />

            {/* Fullscreen Player */}
            <FullscreenPlayer
                isOpen={isFullscreenPlayerOpen}
                onClose={() => setIsFullscreenPlayerOpen(false)}
            />
        </div>
    )
}
