import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { formatTime, artworkToDataUrl } from '../utils/kit'
import { gsap } from 'gsap'

interface FullscreenPlayerProps {
    isOpen: boolean
    onClose: () => void
}

export const FullscreenPlayer = ({ isOpen, onClose }: FullscreenPlayerProps) => {
    const { currentSong, isPlaying, currentAlbum } = useApp()
    const { togglePlayPause, currentTime, duration, volume, changeVolume, seek } = useAudioPlayer()
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    // Animate slide up/down when opening/closing
    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return

        if (isOpen) {
            // Slide up animation
            gsap.fromTo(
                containerRef.current,
                { y: '100%', opacity: 0 },
                {
                    y: '0%',
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                }
            )
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    delay: 0.1,
                    ease: 'power2.out'
                }
            )
        }
    }, [isOpen])

    // Handle close with animation
    const handleClose = () => {
        if (!containerRef.current || !contentRef.current) {
            onClose()
            return
        }

        gsap.to(contentRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.in'
        })
        gsap.to(containerRef.current, {
            y: '100%',
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: onClose
        })
    }

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) handleClose()
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    // Prevent body scroll when fullscreen player is open
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'
            document.body.style.overflow = 'hidden'

            return () => {
                // Restore scroll position
                document.body.style.position = ''
                document.body.style.top = ''
                document.body.style.width = ''
                document.body.style.overflow = ''
                window.scrollTo(0, scrollY)
            }
        }
    }, [isOpen])

    if (!isOpen || !currentSong) {
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
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 bg-gradient-to-b from-[var(--bg)] to-[var(--bg-alt)] flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[var(--border)]/30 flex-shrink-0">
                <button
                    onClick={handleClose}
                    className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
                    aria-label="Close fullscreen player"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <div className="text-sm font-medium text-[var(--text)]">
                    Now Playing
                </div>
                <button
                    className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
                    aria-label="More options"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </button>
            </div>

            {/* Main Content */}
            <div
                ref={contentRef}
                className="flex-1 flex flex-col items-center justify-center px-6 py-4 max-w-2xl mx-auto w-full min-h-0"
            >
                {/* Album Artwork */}
                <div className="w-full aspect-square max-w-[min(400px,70vh)] rounded-2xl overflow-hidden shadow-2xl mb-4 sm:mb-6 relative group flex-shrink-0">
                    {artworkUrl ? (
                        <img
                            src={artworkUrl}
                            alt={currentSong.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                        </div>
                    )}
                </div>

                {/* Song Info */}
                <div className="w-full text-center mb-4 flex-shrink-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-1 truncate px-4">
                        {currentSong.title}
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--muted)] truncate px-4">
                        {currentSong.artist || 'Unknown Artist'}
                    </p>
                    {currentAlbum && (
                        <p className="text-sm text-[var(--muted)] mt-1 truncate px-4">
                            {currentAlbum.album_name}
                        </p>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="w-full mb-2 flex-shrink-0">
                    <div
                        className="h-1.5 bg-[var(--border)] rounded-full cursor-pointer hover:h-2 transition-all group relative"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="h-full bg-[var(--primary)] rounded-full relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>

                {/* Time Display */}
                <div className="w-full flex items-center justify-between text-xs sm:text-sm text-[var(--muted)] tabular-nums mb-4 sm:mb-6 flex-shrink-0">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6 flex-shrink-0">
                    <button
                        onClick={() => console.log('Previous')}
                        className="rounded-full p-2 text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                        aria-label="Previous track"
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path>
                        </svg>
                    </button>

                    <button
                        onClick={togglePlayPause}
                        className="rounded-full bg-white p-4 text-black hover:scale-105 transition-transform shadow-xl"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        ) : (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={() => console.log('Next')}
                        className="rounded-full p-2 text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                        aria-label="Next track"
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 18h2V6h-2zm-11-6l8.5-6v12z"></path>
                        </svg>
                    </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 sm:gap-3 w-full max-w-xs flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] flex-shrink-0">
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
                        className="flex-1 h-1 sm:h-1.5 rounded-full bg-[var(--border)] cursor-pointer group relative"
                        onClick={handleVolumeChange}
                    >
                        <div
                            className="h-full rounded-full bg-[var(--primary)] relative"
                            style={{ width: `${volume * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <span className="text-xs sm:text-sm text-[var(--muted)] tabular-nums w-8 sm:w-10 text-right">
                        {Math.round(volume * 100)}%
                    </span>
                </div>
            </div>

            {/* Background Blur Effect (optional) */}
            {artworkUrl && (
                <div className="fixed inset-0 -z-10 opacity-20 blur-2xl">
                    <img
                        src={artworkUrl}
                        alt=""
                        className="w-full h-full object-cover scale-150"
                    />
                </div>
            )}
        </div>
    )
}
