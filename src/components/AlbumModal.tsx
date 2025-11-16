import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { get, post, del } from '../utils/net'
import { formatTime } from '../utils/kit'
import { useApp } from '../context/AppContext'
import { useContextMenu } from '../context/ContextMenuContext'

interface AlbumModalProps {
    album: Album
    onClose: () => void
    originPosition: { x: number; y: number; width: number; height: number }
}

interface AlbumDetails {
    songs: Song[]
}

export const AlbumModal = ({ album, onClose, originPosition }: AlbumModalProps) => {
    const { t } = useTranslation()
    const { playAlbum, playSong, playSongNext, addSongToQueue, user } = useApp()
    const { showContextMenu } = useContextMenu()
    const [songs, setSongs] = useState<Song[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    useEffect(() => {
        loadAlbumSongs()
        loadPlaylists()
    }, [album])

    const loadPlaylists = async () => {
        if (!user?.user_id) return
        try {
            const data = await get<Playlist[]>(`/playlists/user/${user.user_id}`)
            setPlaylists(data)
        } catch (err) {
            console.error('Failed to load playlists:', err)
            setPlaylists([])
        }
    }

    const loadAlbumSongs = async () => {
        setIsLoading(true)
        try {
            // TODO: Replace with actual API endpoint
            const data = await get<AlbumDetails>(`/albums/${encodeURIComponent(album.album_name)}`)
            // Sort by track number
            const sortedSongs = data.songs.sort((a, b) => (a.track_number || 0) - (b.track_number || 0))
            setSongs(sortedSongs)
        } catch (err) {
            console.error('Failed to load album songs:', err)
            setSongs([])
        } finally {
            setIsLoading(false)
        }
    }

    const handlePlayAlbum = () => {
        if (songs.length > 0) {
            playAlbum(songs, album)
        }
    }

    const handlePlaySong = (song: Song) => {
        playSong(song, album)
    }

    const handleEditAlbum = () => {
        console.log('Editing album:', album.album_name)
        // TODO: Implement edit functionality
    }

    const handleDeleteAlbum = async () => {
        if (!window.confirm(t('library.confirmDeleteAlbum'))) return

        setIsDeleting(true)
        try {
            // TODO: Replace with actual API endpoint
            // await del(`/albums/${encodeURIComponent(album.album_name)}`)
            console.log('Deleted album:', album.album_name)
            onClose()
        } catch (err) {
            console.error('Failed to delete album:', err)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleAddToPlaylist = async (song: Song, playlistId: number) => {
        try {
            await post(`/playlists/${playlistId}/songs`, {
                song_id: song.id,
                position: 0 // Server can handle positioning
            })
            console.log('Added song to playlist:', song.title)
        } catch (err) {
            console.error('Failed to add song to playlist:', err)
        }
    }

    const handleDeleteSong = async (song: Song) => {
        if (!window.confirm(t('library.confirmDeleteAlbum'))) return
        try {
            await del(`/songs/${song.id}`)
            // Refresh the song list
            setSongs(songs.filter(s => s.id !== song.id))
            console.log('Deleted song:', song.title)
        } catch (err) {
            console.error('Failed to delete song:', err)
        }
    }

    const handleSongContextMenu = (song: Song, event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()

        // Build playlist submenu items
        const playlistSubmenu = playlists.length > 0
            ? playlists.map(playlist => ({
                id: `playlist-${playlist.id}`,
                label: playlist.name,
                onClick: () => handleAddToPlaylist(song, playlist.id)
            }))
            : [{
                id: 'no-playlists',
                label: t('contextMenu.noPlaylists'),
                disabled: true,
                onClick: () => { }
            }]

        showContextMenu([
            {
                id: 'play',
                label: t('contextMenu.play'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                ),
                onClick: () => handlePlaySong(song)
            },
            {
                id: 'playNext',
                label: t('contextMenu.playNext'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
                ),
                onClick: () => playSongNext(song)
            },
            {
                id: 'addToPlaylist',
                label: t('contextMenu.addToPlaylist'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                ),
                submenu: playlistSubmenu
            },
            {
                id: 'divider-1',
                label: '',
                divider: true,
                onClick: undefined
            },
            {
                id: 'info',
                label: t('contextMenu.showInfo'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                ),
                onClick: () => {
                    console.log('Show song info:', song)
                    // TODO: Implement info modal
                }
            },
            {
                id: 'delete',
                label: t('contextMenu.delete'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                ),
                danger: true,
                onClick: () => handleDeleteSong(song)
            }
        ], event)
    }

    const totalDuration = songs.reduce((sum, song) => sum + (song.duration || 0), 0)

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [onClose])

    // Calculate animation origin
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const translateX = originPosition.x - centerX
    const translateY = originPosition.y - centerY
    const scaleRatio = Math.min(originPosition.width / 800, originPosition.height / 600)

    return (
        <div
            className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="w-full max-w-3xl max-h-[90vh] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden flex flex-col"
                style={{
                    animation: 'modalZoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    transformOrigin: 'center center',
                    '--origin-x': `${translateX}px`,
                    '--origin-y': `${translateY}px`,
                    '--origin-scale': scaleRatio.toString()
                } as React.CSSProperties}
            >
                {/* Header */}
                <div className="flex items-start gap-6 p-6 border-b border-[var(--border)]">
                    {/* Album Artwork */}
                    <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
                        {album.artwork ? (
                            <img
                                src={`data:image/jpeg;base64,${btoa(
                                    album.artwork.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
                                )}`}
                                alt={album.album_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Album Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold text-[var(--text)] truncate">{album.album_name}</h2>
                        <p className="text-lg text-[var(--muted)] mt-1 truncate">{album.album_artist}</p>
                        {album.year && (
                            <p className="text-sm text-[var(--muted)] mt-2">{album.year}</p>
                        )}
                        <p className="text-sm text-[var(--muted)] mt-1">
                            {songs.length} {t('library.tracks')}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
                        aria-label={t('common.close')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Song List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-sm text-[var(--muted)]">{t('library.loading')}</div>
                        </div>
                    ) : songs.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-sm text-[var(--muted)]">{t('library.noSongsFound')}</div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {songs.map((song, index) => (
                                <div
                                    key={song.id}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[var(--overlay)] transition-colors group cursor-pointer"
                                    onContextMenu={(e) => handleSongContextMenu(song, e)}
                                >
                                    {/* Track Number */}
                                    <div className="w-8 text-center text-sm text-[var(--muted)] group-hover:text-[var(--text)]">
                                        {song.track_number || index + 1}
                                    </div>

                                    {/* Song Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--text)] truncate">{song.title}</p>
                                        {song.artist && (
                                            <p className="text-xs text-[var(--muted)] truncate">{song.artist}</p>
                                        )}
                                    </div>

                                    {/* Duration */}
                                    <div className="text-sm text-[var(--muted)] tabular-nums">
                                        {song.duration ? formatTime(song.duration) : '-'}
                                    </div>

                                    {/* Play Button (appears on hover) */}
                                    <button
                                        onClick={() => handlePlaySong(song)}
                                        className="opacity-0 group-hover:opacity-100 rounded-full p-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all"
                                        aria-label={t('library.playSong')}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--border)] bg-[var(--bg-alt)] px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Total Duration */}
                        <div className="text-sm text-[var(--muted)]">
                            {t('library.totalDuration')}: <span className="font-medium text-[var(--text)] tabular-nums">{formatTime(totalDuration)}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 justify-center">
                            <button
                                onClick={handleDeleteAlbum}
                                disabled={isDeleting}
                                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={t('library.deleteAlbum')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                            <button
                                onClick={handleEditAlbum}
                                className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
                                title={t('library.editAlbum')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button
                                onClick={handlePlayAlbum}
                                className="ml-2 flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                {t('library.playAlbum')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
