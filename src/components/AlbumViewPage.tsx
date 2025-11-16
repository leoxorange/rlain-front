import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { get } from '../utils/net'
import clsx from 'clsx'
import { AlbumModal } from './AlbumModal'
import { artworkToDataUrl } from '../utils/kit'

export interface AlbumViewPageProps {
    currentLibraryId: number | null
    onLibraryChange: (libraryId: string) => void
    searchQuery: string
}

export function AlbumViewPage({ currentLibraryId, searchQuery }: AlbumViewPageProps) {
    const { t } = useTranslation()
    const [albums, setAlbums] = useState<Album[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

    useEffect(() => {
        if (currentLibraryId !== null) {
            loadAlbums()
        }
    }, [currentLibraryId])

    const loadAlbums = async () => {
        if (currentLibraryId === null) return
        setIsLoading(true)
        try {
            const data = await get<Album[]>(`/albums?library_id=${currentLibraryId}`)
            setAlbums(data)
        } catch (err) {
            console.error('Failed to load albums:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredAlbums = albums.filter(album =>
        album.album_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.album_artist.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <>
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
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                setClickPosition({
                                    x: rect.left + rect.width / 2,
                                    y: rect.top + rect.height / 2,
                                    width: rect.width,
                                    height: rect.height
                                })
                                setSelectedAlbum(album)
                            }}
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

            {/* Album Modal */}
            {selectedAlbum && clickPosition && (
                <AlbumModal
                    album={selectedAlbum}
                    onClose={() => setSelectedAlbum(null)}
                    originPosition={clickPosition}
                />
            )}
        </>
    )
}
