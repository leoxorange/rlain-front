import { useApp } from '../context/AppContext'
import { formatTime, artworkToDataUrl } from '../utils/kit'
import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { VolumeControl } from './VolumeControl'

interface NowPlayingBarProps {
    className?: string
    isSidebarCollapsed?: boolean
}

export const NowPlayingBar = ({
    className = '',
    isSidebarCollapsed = false
}: NowPlayingBarProps) => {
    const {
        currentSong,
        isPlaying,
        setIsFullscreenPlayerOpen,
        togglePlayPause,
        currentTime,
        duration,
        volume,
        changeVolume,
        seek,
        playNext,
        playPrevious,
        queue,
        currentQueueIndex,
        playQueueIndex,
        clearQueue,
        playMode,
        togglePlayMode
    } = useApp()

    const [isQueueOpen, setIsQueueOpen] = useState(false)
    const queueButtonRef = useRef<HTMLButtonElement>(null)
    const queueDropdownRef = useRef<HTMLDivElement>(null)

    // Animate queue dropdown when opening/closing
    useEffect(() => {
        if (!queueDropdownRef.current) return

        if (isQueueOpen) {
            // Slide up and fade in animation
            gsap.fromTo(
                queueDropdownRef.current,
                {
                    y: 20,
                    opacity: 0,
                    scale: 0.95
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                }
            )
        }
    }, [isQueueOpen])

    // Close queue dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isQueueOpen &&
                queueDropdownRef.current &&
                queueButtonRef.current &&
                !queueDropdownRef.current.contains(event.target as Node) &&
                !queueButtonRef.current.contains(event.target as Node)
            ) {
                setIsQueueOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isQueueOpen])

    if (!currentSong) {
        return null
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        seek(percent * duration)
    }

    const handleQueueItemClick = (index: number) => {
        playQueueIndex(index)
        setIsQueueOpen(false)
    }

    const handleClearQueue = () => {
        clearQueue()
        setIsQueueOpen(false)
    }

    const artworkUrl = currentSong.artwork ? artworkToDataUrl(currentSong.artwork) : undefined

    return (
        <div className={`fixed bottom-0 right-0 border-t border-[var(--border)] bg-[var(--card)] transition-all duration-300 ${isSidebarCollapsed ? 'left-0' : 'left-64'} ${className}`}>
            {/* Progress Bar */}
            <div
                className="h-1 bg-[var(--border)] cursor-pointer hover:h-1.5 transition-all group"
                onClick={handleProgressClick}
            >
                <div
                    className="h-full bg-[var(--primary)] group-hover:bg-[var(--primary)]/80 transition-colors"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
            </div>

            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Current Song Info */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <button
                            onClick={() => setIsFullscreenPlayerOpen(true)}
                            className="h-14 w-14 rounded bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] overflow-hidden flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
                            aria-label="Open fullscreen player"
                        >
                            {artworkUrl ? (
                                <img
                                    src={artworkUrl}
                                    alt={currentSong.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                    </svg>
                                </div>
                            )}
                        </button>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-[var(--text)] truncate">
                                {currentSong.title}
                            </p>
                            <p className="text-xs text-[var(--muted)] truncate">
                                {currentSong.artist || 'Unknown Artist'}
                            </p>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={playPrevious}
                                disabled={currentQueueIndex <= 0}
                                className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Previous track"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="19 20 9 12 19 4 19 20"></polygon>
                                    <line x1="5" y1="19" x2="5" y2="5"></line>
                                </svg>
                            </button>
                            <button
                                onClick={togglePlayPause}
                                className="rounded-full bg-[var(--primary)] p-3 text-white hover:opacity-90 transition-opacity"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="6" y="4" width="4" height="16"></rect>
                                        <rect x="14" y="4" width="4" height="16"></rect>
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={playNext}
                                disabled={currentQueueIndex >= queue.length - 1}
                                className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Next track"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                                    <line x1="19" y1="5" x2="19" y2="19"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Time Display */}
                        <div className="flex items-center gap-2 text-xs text-[var(--muted)] tabular-nums">
                            <span>{formatTime(currentTime)}</span>
                            <span>/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Queue and Volume Control */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        {/* Play Mode Button */}
                        <button
                            onClick={togglePlayMode}
                            className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
                            aria-label={`Play mode: ${playMode}`}
                            title={playMode === 'list' ? 'Sequential' : playMode === 'loop' ? 'Loop Single' : 'Shuffle'}
                        >
                            {playMode === 'list' ? (
                                // List icon (sequential)
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            ) : playMode === 'loop' ? (
                                // Loop icon (repeat one)
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="17 1 21 5 17 9"></polyline>
                                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                                    <polyline points="7 23 3 19 7 15"></polyline>
                                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                                    <text x="12" y="15" fontSize="8" fill="currentColor" textAnchor="middle" fontWeight="bold">1</text>
                                </svg>
                            ) : (
                                // Random/Shuffle icon
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 3 21 3 21 8"></polyline>
                                    <line x1="4" y1="20" x2="21" y2="3"></line>
                                    <polyline points="21 16 21 21 16 21"></polyline>
                                    <line x1="15" y1="15" x2="21" y2="21"></line>
                                    <line x1="4" y1="4" x2="9" y2="9"></line>
                                </svg>
                            )}
                        </button>

                        {/* Queue Button */}
                        <div className="relative">
                            <button
                                ref={queueButtonRef}
                                onClick={() => setIsQueueOpen(!isQueueOpen)}
                                className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
                                aria-label="Show queue"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                                {queue.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {queue.length}
                                    </span>
                                )}
                            </button>

                            {/* Queue Dropdown */}
                            {isQueueOpen && (
                                <div
                                    ref={queueDropdownRef}
                                    className="absolute bottom-full right-0 mb-2 w-80 max-h-96 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden flex flex-col"
                                    style={{ opacity: 0, transform: 'translateY(20px) scale(0.95)' }}
                                >
                                    {/* Queue Header */}
                                    <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-alt)] flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--text)]">Queue ({queue.length})</h3>
                                        {queue.length > 0 && (
                                            <button
                                                onClick={handleClearQueue}
                                                className="text-xs text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                                                title="Clear queue"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    {/* Queue List */}
                                    <div className="overflow-y-auto">
                                        {queue.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                                                Queue is empty
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-[var(--border)]">
                                                {queue.map((song, index) => {
                                                    const isCurrentSong = index === currentQueueIndex
                                                    const songArtworkUrl = song.artwork ? artworkToDataUrl(song.artwork) : undefined

                                                    return (
                                                        <button
                                                            key={`${song.id}-${index}`}
                                                            onClick={() => handleQueueItemClick(index)}
                                                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--overlay)] transition-colors text-left ${
                                                                isCurrentSong ? 'bg-[var(--primary)]/10' : ''
                                                            }`}
                                                        >
                                                            {/* Song Artwork */}
                                                            <div className="w-10 h-10 rounded bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] overflow-hidden flex-shrink-0">
                                                                {songArtworkUrl ? (
                                                                    <img
                                                                        src={songArtworkUrl}
                                                                        alt={song.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                                                                            <circle cx="12" cy="12" r="10"></circle>
                                                                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Song Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm font-medium truncate ${
                                                                    isCurrentSong ? 'text-[var(--primary)]' : 'text-[var(--text)]'
                                                                }`}>
                                                                    {song.title}
                                                                </p>
                                                                <p className="text-xs text-[var(--muted)] truncate">
                                                                    {song.artist || 'Unknown Artist'}
                                                                </p>
                                                            </div>

                                                            {/* Duration */}
                                                            <div className="text-xs text-[var(--muted)] tabular-nums flex-shrink-0">
                                                                {song.duration ? formatTime(song.duration) : '-'}
                                                            </div>

                                                            {/* Playing Indicator */}
                                                            {isCurrentSong && (
                                                                <div className="flex-shrink-0">
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--primary)]">
                                                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Volume Control */}
                        <VolumeControl
                            volume={volume}
                            onVolumeChange={changeVolume}
                            size="sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
