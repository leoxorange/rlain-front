import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { get, post, put, del } from '../utils/net'
import { formatTime, artworkToDataUrl } from '../utils/kit'
import clsx from 'clsx'
import { useApp } from '../context/AppContext'
import { useContextMenu } from '../context/ContextMenuContext'

export const PlaylistsPage = () => {
    
    const { t } = useTranslation()
    const { user } = useApp()
    const { showContextMenu } = useContextMenu()
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
    const [playlistSongs, setPlaylistSongs] = useState<PlaylistSong[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingSongs, setIsLoadingSongs] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [editName, setEditName] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editIsPublic, setEditIsPublic] = useState(false)

    useEffect(() => {
        loadPlaylists()
    }, [])

    useEffect(() => {
        if (selectedPlaylist) {
            loadPlaylistSongs(selectedPlaylist.id)
        }
    }, [selectedPlaylist])

    const loadPlaylists = async () => {
        setIsLoading(true)
        try {
            const data = await get<Playlist[]>('/playlists/user/' + user?.user_id )
            setPlaylists(data)
            if (data.length > 0 && !selectedPlaylist) {
                setSelectedPlaylist(data[0])
            }
        } catch (err) {
            console.error('Failed to load playlists:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const loadPlaylistSongs = async (playlistId: number) => {
        setIsLoadingSongs(true)
        try {
            const data = await get<PlaylistSong[]>(`/playlists/${playlistId}/songs`)
            setPlaylistSongs(data)
        } catch (err) {
            console.error('Failed to load playlist songs:', err)
        } finally {
            setIsLoadingSongs(false)
        }
    }

    const handleCreatePlaylist = async () => {
        try {
            const newPlaylist = await post<Playlist>('/playlists', {
                name: editName || 'New Playlist',
                user_id: user?.user_id,
                description: editDescription,
                is_public: editIsPublic
            })
            setPlaylists([...playlists, newPlaylist])
            setSelectedPlaylist(newPlaylist)
            setIsCreating(false)
            setEditName('')
            setEditDescription('')
            setEditIsPublic(false)
        } catch (err) {
            console.error('Failed to create playlist:', err)
        }
    }

    const handleUpdatePlaylist = async () => {
        if (!selectedPlaylist) return
        try {
            const updated = await put<Playlist>(`/playlists/${selectedPlaylist.id}`, {
                name: editName,
                description: editDescription,
                is_public: editIsPublic
            })
            setPlaylists(playlists.map(p => p.id === updated.id ? updated : p))
            setSelectedPlaylist(updated)
            setIsEditing(false)
        } catch (err) {
            console.error('Failed to update playlist:', err)
        }
    }

    const handleDeletePlaylist = async () => {
        if (!selectedPlaylist) return
        if (!confirm(t('playlists.confirmDelete', { name: selectedPlaylist.name }))) return

        try {
            await del(`/playlists/${selectedPlaylist.id}`)
            const newPlaylists = playlists.filter(p => p.id !== selectedPlaylist.id)
            setPlaylists(newPlaylists)
            setSelectedPlaylist(newPlaylists.length > 0 ? newPlaylists[0] : null)
        } catch (err) {
            console.error('Failed to delete playlist:', err)
        }
    }

    const handleRemoveSong = async (playlistSongId: number) => {
        if (!selectedPlaylist) return
        try {
            await del(`/playlists/${selectedPlaylist.id}/songs/${playlistSongId}`)
            setPlaylistSongs(playlistSongs.filter(ps => ps.id !== playlistSongId))
            // Reload playlist to update song count
            const updated = await get<Playlist>(`/playlists/${selectedPlaylist.id}`)
            setSelectedPlaylist(updated)
            setPlaylists(playlists.map(p => p.id === updated.id ? updated : p))
        } catch (err) {
            console.error('Failed to remove song:', err)
        }
    }

    const startEdit = () => {
        if (!selectedPlaylist) return
        setEditName(selectedPlaylist.name)
        setEditDescription(selectedPlaylist.description || '')
        setEditIsPublic(selectedPlaylist.is_public)
        setIsEditing(true)
    }

    const startCreate = () => {
        setEditName('')
        setEditDescription('')
        setEditIsPublic(false)
        setIsCreating(true)
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setIsCreating(false)
        setEditName('')
        setEditDescription('')
        setEditIsPublic(false)
    }

    const handlePlaylistContextMenu = (playlist: Playlist, event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()

        showContextMenu([
            {
                id: 'play',
                label: t('contextMenu.play'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                ),
                onClick: () => {
                    console.log('Play playlist:', playlist.name)
                }
            },
            {
                id: 'divider-1',
                label: '',
                divider: true
            },
            {
                id: 'edit',
                label: t('contextMenu.edit'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                ),
                onClick: () => {
                    setSelectedPlaylist(playlist)
                    startEdit()
                }
            },
            {
                id: 'share',
                label: t('contextMenu.share'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                ),
                onClick: () => {
                    console.log('Share playlist:', playlist.name)
                }
            },
            {
                id: 'divider-2',
                label: '',
                divider: true
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
                onClick: async () => {
                    setSelectedPlaylist(playlist)
                    await handleDeletePlaylist()
                }
            }
        ], event)
    }

    const handleSongContextMenu = (playlistSong: PlaylistSong, event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()

        const song = playlistSong.song
        if (!song) return

        showContextMenu([
            {
                id: 'play',
                label: t('contextMenu.play'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                ),
                onClick: () => {
                    console.log('Play song:', song.title)
                }
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
                onClick: () => {
                    console.log('Play next:', song.title)
                }
            },
            {
                id: 'addToQueue',
                label: t('contextMenu.addToQueue'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                ),
                onClick: () => {
                    console.log('Add to queue:', song.title)
                }
            },
            {
                id: 'divider-1',
                label: '',
                divider: true
            },
            {
                id: 'viewAlbum',
                label: t('contextMenu.viewAlbum'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                ),
                onClick: () => {
                    console.log('View album:', song.album)
                }
            },
            {
                id: 'viewArtist',
                label: t('contextMenu.viewArtist'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                ),
                onClick: () => {
                    console.log('View artist:', song.artist)
                }
            },
            {
                id: 'divider-2',
                label: '',
                divider: true
            },
            {
                id: 'removeFromPlaylist',
                label: t('playlists.removeFromPlaylist'),
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ),
                danger: true,
                onClick: () => {
                    handleRemoveSong(playlistSong.id)
                }
            }
        ], event)
    }

    return (
        <div className="flex gap-6 h-[calc(100vh-280px)]">
            {/* Left Panel - Playlists List */}
            <div className="w-80 flex-shrink-0 flex flex-col border border-[var(--border)] rounded-xl bg-[var(--card)] overflow-hidden">
                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--text)]">{t('playlists.myPlaylists')}</h3>
                    <button
                        onClick={startCreate}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        {t('playlists.newPlaylist')}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-[var(--muted)]">{t('playlists.loading')}</div>
                        </div>
                    ) : playlists.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-[var(--muted)]">
                                <path d="M9 18V5l12-2v13"></path>
                                <circle cx="6" cy="18" r="3"></circle>
                                <circle cx="18" cy="16" r="3"></circle>
                            </svg>
                            <p className="text-[var(--muted)] mb-2">{t('playlists.noPlaylistsYet')}</p>
                            <p className="text-sm text-[var(--muted)]">{t('playlists.createFirstPlaylist')}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border)]">
                            {playlists.map((playlist) => (
                                <button
                                    key={playlist.id}
                                    onClick={() => setSelectedPlaylist(playlist)}
                                    onContextMenu={(e) => handlePlaylistContextMenu(playlist, e)}
                                    className={clsx(
                                        "w-full p-4 text-left transition-colors hover:bg-[var(--overlay)]",
                                        selectedPlaylist?.id === playlist.id && "bg-[var(--primary)]/10"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className={clsx(
                                                "font-medium truncate",
                                                selectedPlaylist?.id === playlist.id ? "text-[var(--primary)]" : "text-[var(--text)]"
                                            )}>
                                                {playlist.name}
                                            </h4>
                                            {playlist.description && (
                                                <p className="text-xs text-[var(--muted)] truncate mt-1">
                                                    {playlist.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted)]">
                                                <span>{playlist.song_count || 0} {t('playlists.songs')}</span>
                                                {playlist.is_public && (
                                                    <span className="flex items-center gap-1">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                                        </svg>
                                                        {t('playlists.public')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Playlist Details */}
            <div className="flex-1 flex flex-col border border-[var(--border)] rounded-xl bg-[var(--card)] overflow-hidden">
                {isCreating ? (
                    <div className="flex-1 flex flex-col">
                        <div className="p-6 border-b border-[var(--border)]">
                            <h3 className="text-xl font-semibold text-[var(--text)] mb-4">{t('playlists.createNewPlaylist')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                                        {t('playlists.playlistName')}
                                    </label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder={t('playlists.enterPlaylistName')}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                                        {t('playlists.descriptionOptional')}
                                    </label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder={t('playlists.enterDescription')}
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="create-public"
                                        checked={editIsPublic}
                                        onChange={(e) => setEditIsPublic(e.target.checked)}
                                        className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                                    />
                                    <label htmlFor="create-public" className="text-sm text-[var(--text)]">
                                        {t('playlists.makePublic')}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex gap-3">
                            <button
                                onClick={handleCreatePlaylist}
                                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors"
                            >
                                {t('playlists.createPlaylistButton')}
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                            >
                                {t('playlists.cancel')}
                            </button>
                        </div>
                    </div>
                ) : !selectedPlaylist ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-[var(--muted)]">
                                <path d="M9 18V5l12-2v13"></path>
                                <circle cx="6" cy="18" r="3"></circle>
                                <circle cx="18" cy="16" r="3"></circle>
                            </svg>
                            <p className="text-[var(--muted)]">{t('playlists.selectPlaylist')}</p>
                        </div>
                    </div>
                ) : isEditing ? (
                    <div className="flex-1 flex flex-col">
                        <div className="p-6 border-b border-[var(--border)]">
                            <h3 className="text-xl font-semibold text-[var(--text)] mb-4">{t('playlists.editPlaylist')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                                        {t('playlists.playlistName')}
                                    </label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                                        {t('playlists.description')}
                                    </label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="edit-public"
                                        checked={editIsPublic}
                                        onChange={(e) => setEditIsPublic(e.target.checked)}
                                        className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                                    />
                                    <label htmlFor="edit-public" className="text-sm text-[var(--text)]">
                                        {t('playlists.makePublic')}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex gap-3">
                            <button
                                onClick={handleUpdatePlaylist}
                                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors"
                            >
                                {t('playlists.saveChanges')}
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                            >
                                {t('playlists.cancel')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Playlist Header */}
                        <div className="p-6 border-b border-[var(--border)]">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
                                        {selectedPlaylist.name}
                                    </h2>
                                    {selectedPlaylist.description && (
                                        <p className="text-[var(--muted)] mb-3">
                                            {selectedPlaylist.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                                        <span>{selectedPlaylist.song_count || 0} {t('playlists.songs')}</span>
                                        {selectedPlaylist.total_duration && (
                                            <span>{formatTime(selectedPlaylist.total_duration)}</span>
                                        )}
                                        {selectedPlaylist.is_public && (
                                            <span className="flex items-center gap-1 text-[var(--primary)]">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                                </svg>
                                                {t('playlists.public')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={startEdit}
                                        className="p-2 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                                        title={t('playlists.edit')}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleDeletePlaylist}
                                        className="p-2 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
                                        title={t('playlists.delete')}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Songs List */}
                        <div className="flex-1 overflow-y-auto">
                            {isLoadingSongs ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-[var(--muted)]">{t('playlists.loadingSongs')}</div>
                                </div>
                            ) : playlistSongs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-[var(--muted)]">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                    </svg>
                                    <p className="text-[var(--muted)] mb-2">{t('playlists.noSongsInPlaylist')}</p>
                                    <p className="text-sm text-[var(--muted)]">{t('playlists.addSongsFromLibrary')}</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[var(--border)]">
                                    {playlistSongs.map((playlistSong, index) => {
                                        const song = playlistSong.song
                                        if (!song) return null

                                        return (
                                            <div
                                                key={playlistSong.id}
                                                onContextMenu={(e) => handleSongContextMenu(playlistSong, e)}
                                                className="p-4 hover:bg-[var(--overlay)] transition-colors group cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 text-center text-sm text-[var(--muted)]">
                                                        {index + 1}
                                                    </div>
                                                    <div className="w-12 h-12 rounded bg-[var(--border)] flex-shrink-0 overflow-hidden">
                                                        {song.artwork ? (
                                                            <img
                                                                src={artworkToDataUrl(song.artwork)}
                                                                alt={song.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]">
                                                                    <path d="M9 18V5l12-2v13"></path>
                                                                    <circle cx="6" cy="18" r="3"></circle>
                                                                    <circle cx="18" cy="16" r="3"></circle>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-[var(--text)] truncate">
                                                            {song.title}
                                                        </h4>
                                                        <p className="text-sm text-[var(--muted)] truncate">
                                                            {song.artist || t('playlists.unknownArtist')}
                                                        </p>
                                                    </div>
                                                    {song.album && (
                                                        <div className="hidden md:block flex-1 min-w-0">
                                                            <p className="text-sm text-[var(--muted)] truncate">
                                                                {song.album}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        {song.duration && (
                                                            <span className="text-sm text-[var(--muted)]">
                                                                {formatTime(song.duration)}
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => handleRemoveSong(playlistSong.id)}
                                                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500 transition-all"
                                                            title={t('playlists.removeFromPlaylist')}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
