import { useRef, useState, useEffect } from 'react'

interface VolumeControlProps {
    volume: number
    onVolumeChange: (volume: number) => void
    className?: string
    showPercentage?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export const VolumeControl = ({
    volume,
    onVolumeChange,
    className = '',
    showPercentage = false,
    size = 'md'
}: VolumeControlProps) => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [previousVolume, setPreviousVolume] = useState(0.5)

    const sizeConfig = {
        sm: { width: 'w-24', height: 'h-1', thumbSize: 'w-2.5 h-2.5', iconSize: 18 },
        md: { width: 'w-32', height: 'h-1.5', thumbSize: 'w-3 h-3', iconSize: 20 },
        lg: { width: 'w-40', height: 'h-1.5', thumbSize: 'w-3 h-3', iconSize: 20 }
    }

    const config = sizeConfig[size]

    const updateVolume = (clientX: number) => {
        if (!sliderRef.current) return

        const rect = sliderRef.current.getBoundingClientRect()
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        onVolumeChange(percent)

        // Save volume if not muted
        if (percent > 0) {
            setPreviousVolume(percent)
        }
    }

    const handleToggleMute = () => {
        if (volume > 0) {
            // Mute: save current volume and set to 0
            setPreviousVolume(volume)
            onVolumeChange(0)
        } else {
            // Unmute: restore previous volume
            onVolumeChange(previousVolume)
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true)
        updateVolume(e.clientX)
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) {
            updateVolume(e.clientX)
        }
    }

    useEffect(() => {
        if (!isDragging) return

        const handleMouseMove = (e: MouseEvent) => {
            updateVolume(e.clientX)
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    return (
        <div className={`flex justify-center items-center gap-2 sm:gap-3 ${className}`}>
            {/* Volume Icon - Clickable to toggle mute */}
            <button
                onClick={handleToggleMute}
                className="flex-shrink-0 rounded p-1 text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                aria-label={volume > 0 ? 'Mute' : 'Unmute'}
            >
                <svg
                    width={config.iconSize}
                    height={config.iconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
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
            </button>

            {/* Volume Slider */}
            <div
                ref={sliderRef}
                className={`${config.width} ${config.height} rounded-full bg-[var(--border)] cursor-pointer group relative select-none`}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
            >
                <div
                    className="h-full rounded-full bg-[var(--primary)] relative transition-colors"
                    style={{ width: `${volume * 100}%` }}
                >
                    {/* Draggable Thumb */}
                    <div
                        className={`absolute right-0 top-1/2 -translate-y-1/2 ${config.thumbSize} bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                            isDragging ? '!opacity-100 scale-110' : ''
                        }`}
                    />
                </div>
            </div>

            {/* Volume Percentage */}
            {showPercentage && (
                <span className="text-xs sm:text-sm text-[var(--muted)] tabular-nums w-8 sm:w-10 text-right">
                    {Math.round(volume * 100)}%
                </span>
            )}
        </div>
    )
}
