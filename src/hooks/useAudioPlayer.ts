import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { getBlob } from '../utils/net'

export const useAudioPlayer = () => {
    const { currentSong, isPlaying, setIsPlaying } = useApp()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.75)
    const [isLoading, setIsLoading] = useState(false)

    // Handler functions for loading state
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    // Initialize audio element
    useEffect(() => {
        // Create audio element if it doesn't exist
        if (!audioRef.current) {
            audioRef.current = new Audio()
            audioRef.current.volume = volume
            audioRef.current.muted = volume === 0
        }

        const audio = audioRef.current

        // Event listeners
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('durationchange', handleDurationChange)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('loadstart', handleLoadStart)
        audio.addEventListener('canplay', handleCanPlay)
        audio.addEventListener('error', handleError)

        return () => {
            // Cleanup: remove event listeners
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('durationchange', handleDurationChange)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('loadstart', handleLoadStart)
            audio.removeEventListener('canplay', handleCanPlay)
            audio.removeEventListener('error', handleError)

            // Pause and clear source to free resources
            audio.pause()
            audioRef.current = null
        }
    }, [])

    // Handle time updates
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    const handleDurationChange = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        // TODO: Auto-play next song in queue
    }

    const handleError = (e: Event) => {
        const audio = e.target as HTMLAudioElement
        console.error('Audio playback error:', {
            error: e,
            audioError: audio.error,
            errorCode: audio.error?.code,
            errorMessage: audio.error?.message,
            src: audio.src,
            networkState: audio.networkState,
            readyState: audio.readyState
        })
        setIsPlaying(false)
        setIsLoading(false)
    }

    // Load and play song when currentSong changes
    useEffect(() => {
        if (currentSong && audioRef.current) {
            loadSong(currentSong.id)
        }
        return () => {
            pause()
        }
    }, [currentSong?.id])

    // Handle play/pause state
    useEffect(() => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    // Update volume with proper muting
    useEffect(() => {
        if (audioRef.current) {
            // Ensure complete muting at 0
            if (volume === 0) {
                audioRef.current.volume = 0
                audioRef.current.muted = true
            } else {
                audioRef.current.muted = false
                // Linear volume control
                audioRef.current.volume = volume
            }
        }
    }, [volume])

    const loadSong = async (songId: number) => {
        if (!audioRef.current) return

        // Pause current playback before loading new song
        setIsPlaying(false)
        setIsLoading(true)

        try {
            const blob = await getBlob(`/songs/${songId}/play`)

            // Revoke old blob URL to prevent memory leaks
            if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
                URL.revokeObjectURL(audioRef.current.src)
            }

            audioRef.current.src = URL.createObjectURL(blob)
            audioRef.current.load()

            // Auto-play if needed
            if (isPlaying) {
                try {
                    play()
                } catch (playError) {
                    console.error('Play error:', playError)
                    setIsPlaying(false)
                }
            }
        } catch (error) {
            console.error('Failed to load song:', error)
            setIsPlaying(false)
        } finally {
            setIsLoading(false)
        }
    }

    const play = () => {
        if (currentSong) {
            setIsPlaying(true)
        }
    }

    const pause = () => {
        setIsPlaying(false)
    }

    const togglePlayPause = () => {
        if (isPlaying) {
            pause()
        } else {
            play()
        }
    }

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setCurrentTime(time)
        }
    }

    const changeVolume = (newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume))
        setVolume(clampedVolume)
    }

    return {
        currentTime,
        duration,
        volume,
        isLoading,
        play,
        pause,
        togglePlayPause,
        seek,
        changeVolume,
    }
}
