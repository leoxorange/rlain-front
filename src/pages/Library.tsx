import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { NowPlayingBar } from '../components/NowPlayingBar'
import { FullscreenPlayer } from '../components/FullscreenPlayer'
import { Sidebar } from '../components/Sidebar'
import type { SidebarNavItem } from '../components/Sidebar'
import { AlbumViewPage } from '../components/AlbumViewPage'
import { PlaylistsPage } from '../components/PlaylistsPage'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import { SettingsMenu } from '../components/SettingsMenu'
import { LibrarySwitcher } from '../components/LibrarySwitcher'
import { LanguageSwitcher } from '../components/LanguageSwitcher'

type PageType = 'music-library' | 'playlists' | 'artists' | 'genres'

export default function Library() {
    const { t } = useTranslation()
    const { libraries, currentLibraryId, setCurrentLibraryId, isFullscreenPlayerOpen, setIsFullscreenPlayerOpen } = useApp()
    const [currentPage, setCurrentPage] = useState<PageType>('music-library')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    // Auto-select first library on mount
    useEffect(() => {
        if (libraries.length > 0 && currentLibraryId === null) {
            setCurrentLibraryId(libraries[0].id)
        }
    }, [libraries, currentLibraryId, setCurrentLibraryId])

    const handleLibraryChange = (libraryId: string) => {
        setCurrentLibraryId(Number(libraryId))
    }

    const handlePageChange = (pageId: string) => {
        setCurrentPage(pageId as PageType)
    }

    const sidebarNavItems: SidebarNavItem[] = [
        {
            id: 'music-library',
            label: t('library.musicLibrary'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
            ),
            onClick: () => handlePageChange('music-library'),
            isActive: currentPage === 'music-library'
        },
        {
            id: 'playlists',
            label: t('library.playlists'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
            ),
            onClick: () => handlePageChange('playlists'),
            isActive: currentPage === 'playlists'
        },
        {
            id: 'artists',
            label: t('library.artists'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
            ),
            onClick: () => handlePageChange('artists'),
            isActive: currentPage === 'artists'
        },
        {
            id: 'genres',
            label: t('library.genres'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20"></path>
                </svg>
            ),
            onClick: () => handlePageChange('genres'),
            isActive: currentPage === 'genres'
        }
    ]

    const renderPage = () => {
        switch (currentPage) {
            case 'music-library':
                return (
                    <AlbumViewPage
                        currentLibraryId={currentLibraryId}
                        onLibraryChange={handleLibraryChange}
                        searchQuery={searchQuery}
                    />
                )
            case 'playlists':
                return <PlaylistsPage />
            case 'artists':
                return (
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-lg text-[var(--muted)]">Artists page - Coming soon</p>
                    </div>
                )
            case 'genres':
                return (
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-lg text-[var(--muted)]">Genres page - Coming soon</p>
                    </div>
                )
            default:
                return null
        }
    }

    const getPageTitle = () => {
        switch (currentPage) {
            case 'music-library':
                return t('library.title')
            case 'playlists':
                return t('library.playlists')
            case 'artists':
                return t('library.artists')
            case 'genres':
                return t('library.genres')
            default:
                return t('library.title')
        }
    }

    const showLibrarySwitcher = currentPage === 'music-library'
    const showSearchBar = currentPage === 'music-library'

    return (
        <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
            {/* Sidebar */}
            <Sidebar
                navigationItems={sidebarNavItems}
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Toggle button when sidebar is collapsed - Transparent when collapsed */}
            {isSidebarCollapsed && (
                <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="fixed left-4 top-6 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text)] shadow-lg opacity-20 transition-all hover:opacity-100 hover:bg-[var(--overlay)] hover:scale-110"
                    aria-label="Open sidebar"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            )}

            {/* Main Content */}
            <main className={`p-8 pb-32 transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-64'}`}>
                {/* Global Header */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-bold text-[var(--text)]">{getPageTitle()}</h2>
                            {showLibrarySwitcher && (
                                <LibrarySwitcher
                                    currentLibraryId={currentLibraryId !== null ? String(currentLibraryId) : undefined}
                                    onLibraryChange={handleLibraryChange}
                                />
                            )}
                        </div>
                        <div className='flex items-center gap-2'>
                            <ThemeSwitcher />
                            <LanguageSwitcher />
                            <SettingsMenu />
                        </div>
                    </div>

                    {/* Search Bar - Only show for music-library page */}
                    {showSearchBar && (
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
                    )}
                </div>

                {/* Page Content */}
                {renderPage()}
            </main>

            {/* Now Playing Bar */}
            <NowPlayingBar isSidebarCollapsed={isSidebarCollapsed} />

            {/* Fullscreen Player */}
            <FullscreenPlayer
                isOpen={isFullscreenPlayerOpen}
                onClose={() => setIsFullscreenPlayerOpen(false)}
            />
        </div>
    )
}
