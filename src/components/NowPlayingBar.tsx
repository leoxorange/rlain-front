import { useApp } from '../context/AppContext'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { formatTime, artworkToDataUrl } from '../utils/kit'

interface NowPlayingBarProps {
    className?: string
}

export const NowPlayingBar = ({
    className = ''
}: NowPlayingBarProps) => {
    const { currentSong, isPlaying, setIsFullscreenPlayerOpen } = useApp()
    const { togglePlayPause, currentTime, duration, volume, changeVolume, seek } = useAudioPlayer()

    if (!currentSong) {
        return null
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        seek(percent * duration)
    }

    const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        changeVolume(percent)
    }

    const artworkUrl = currentSong.artwork ? artworkToDataUrl(currentSong.artwork) : undefined

    return (
        <div className={`fixed bottom-0 left-64 right-0 border-t border-[var(--border)] bg-[var(--card)] ${className}`}>
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
                                onClick={() => console.log('Previous')}
                                className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
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
                                onClick={() => console.log('Next')}
                                className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
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

                    {/* Volume Control */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] flex-shrink-0">
                            {volume === 0 ? (
                                <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                            ) : volume < 0.5 ? (
                                <>
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                </>
                            ) : (
                                <>
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                </>
                            )}
                        </svg>
                        <div
                            className="h-1 w-24 rounded-full bg-[var(--border)] cursor-pointer"
                            onClick={handleVolumeChange}
                        >
                            <div
                                className="h-full rounded-full bg-[var(--primary)]"
                                style={{ width: `${volume * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
