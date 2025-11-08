import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { get, getBlob, updateUserPreferences } from '../utils/net'

export type PlayMode = 'list' | 'loop' | 'random'

interface AppContextType {
    // User data
    user: UserInfo | null

    // Libraries data
    libraries: Library[]
    currentLibraryId: number | null
    isLoadingLibraries: boolean

    // Library actions
    setCurrentLibraryId: (id: number) => void
    refreshLibraries: () => Promise<void>
    addLibrary: (library: Library) => void
    updateLibrary: (library: Library) => void
    removeLibrary: (id: number) => void

    // User preferences
    preferences: UserPreferences | null
    updatePreferences: (prefs: UserPreferences) => Promise<void>

    // Player state
    currentSong: Song | null
    isPlaying: boolean
    currentAlbum: Album | null
    isFullscreenPlayerOpen: boolean
    currentTime: number
    duration: number
    volume: number
    isLoading: boolean
    queue: Song[]
    currentQueueIndex: number
    playMode: PlayMode

    // Player actions
    setCurrentSong: (song: Song | null) => void
    setIsPlaying: (playing: boolean) => void
    setCurrentAlbum: (album: Album | null) => void
    setIsFullscreenPlayerOpen: (open: boolean) => void
    play: () => void
    pause: () => void
    togglePlayPause: () => void
    seek: (time: number) => void
    changeVolume: (volume: number) => void
    playAlbum: (songs: Song[], album: Album) => void
    playSong: (song: Song, album?: Album) => void
    playNext: () => void
    playPrevious: () => void
    playQueueIndex: (index: number) => void
    clearQueue: () => void
    togglePlayMode: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
    children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const { user } = useAuth()

    // User preferences state
    const [preferences, setPreferences] = useState<UserPreferences | null>(null)

    // Libraries state
    const [libraries, setLibraries] = useState<Library[]>([])
    const [currentLibraryId, setCurrentLibraryId] = useState<number | null>(null)
    const [isLoadingLibraries, setIsLoadingLibraries] = useState(false)

    // Player state
    const [currentSong, setCurrentSong] = useState<Song | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null)
    const [isFullscreenPlayerOpen, setIsFullscreenPlayerOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(user?.preferences?.volume || 0.5)
    const [isLoading, setIsLoading] = useState(false)
    const [queue, setQueue] = useState<Song[]>([])
    const [currentQueueIndex, setCurrentQueueIndex] = useState(-1)
    const [playMode, setPlayMode] = useState<PlayMode>('list')

    // Single shared audio instance
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Audio event handlers
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

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

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
        audio.addEventListener('loadstart', handleLoadStart)
        audio.addEventListener('canplay', handleCanPlay)
        audio.addEventListener('error', handleError)

        return () => {
            // Cleanup: remove event listeners
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('durationchange', handleDurationChange)
            audio.removeEventListener('loadstart', handleLoadStart)
            audio.removeEventListener('canplay', handleCanPlay)
            audio.removeEventListener('error', handleError)

            // Pause and clear source to free resources
            audio.pause()
            audioRef.current = null
        }
    }, [])

    // Handle song ended event with proper dependency tracking
    useEffect(() => {
        if (!audioRef.current) return

        const handleEnded = () => {
            // Auto-play based on play mode
            if (playMode === 'loop') {
                // Loop: replay current song from the beginning
                if (audioRef.current) {
                    audioRef.current.currentTime = 0
                    audioRef.current.play().catch(err => {
                        console.error('Failed to replay song:', err)
                        setIsPlaying(false)
                    })
                    setCurrentTime(0)
                }
            } else if (playMode === 'random' && queue.length > 0) {
                // Random: pick random song from queue
                const randomIndex = Math.floor(Math.random() * queue.length)
                setCurrentQueueIndex(randomIndex)
                setCurrentSong(queue[randomIndex])
                setIsPlaying(true)
                setCurrentTime(0)
            } else if (playMode === 'list' && currentQueueIndex < queue.length - 1) {
                // List: play next song sequentially
                const nextIndex = currentQueueIndex + 1
                setCurrentQueueIndex(nextIndex)
                setCurrentSong(queue[nextIndex])
                setIsPlaying(true)
                setCurrentTime(0)
            } else {
                // No more songs to play
                setIsPlaying(false)
                setCurrentTime(0)
            }
        }

        const audio = audioRef.current
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('ended', handleEnded)
        }
    }, [playMode, queue, currentQueueIndex])

    // Load and play song when currentSong changes
    useEffect(() => {
        if (currentSong && audioRef.current) {
            loadSong(currentSong.id)
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

        // Sync volume to server
        updatePreferences({ volume: clampedVolume })
    }

    // Queue management functions
    const playAlbum = (songs: Song[], album: Album) => {
        if (songs.length === 0) return

        // Replace entire queue with album songs
        setQueue(songs)
        setCurrentQueueIndex(0)
        setCurrentSong(songs[0])
        setCurrentAlbum(album)
        setIsPlaying(true)
    }

    const playSong = (song: Song, album?: Album) => {
        // Add song to the front of the queue
        setQueue(prevQueue => [song, ...prevQueue])
        setCurrentQueueIndex(0)
        setCurrentSong(song)
        if (album) {
            setCurrentAlbum(album)
        }
        setIsPlaying(true)
    }

    const playNext = () => {
        if (currentQueueIndex < queue.length - 1) {
            const nextIndex = currentQueueIndex + 1
            setCurrentQueueIndex(nextIndex)
            setCurrentSong(queue[nextIndex])
            setIsPlaying(true)
        }
    }

    const playPrevious = () => {
        if (currentQueueIndex > 0) {
            const prevIndex = currentQueueIndex - 1
            setCurrentQueueIndex(prevIndex)
            setCurrentSong(queue[prevIndex])
            setIsPlaying(true)
        }
    }

    const playQueueIndex = (index: number) => {
        if (index >= 0 && index < queue.length) {
            setCurrentQueueIndex(index)
            setCurrentSong(queue[index])
            setIsPlaying(true)
        }
    }

    const clearQueue = () => {
        setQueue([])
        setCurrentQueueIndex(-1)
        setCurrentSong(null)
        setCurrentAlbum(null)
        setIsPlaying(false)
        setCurrentTime(0)
        setDuration(0)
        // Stop and clear the audio
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }

    const togglePlayMode = () => {
        setPlayMode((prevMode) => {
            // Cycle through modes: list → loop → random → list
            if (prevMode === 'list') return 'loop'
            if (prevMode === 'loop') return 'random'
            return 'list'
        })
    }

    // Update user preferences on server and local state
    const updatePreferences = useCallback(async (prefs: UserPreferences) => {
        if (!user?.user_id) return

        try {
            await updateUserPreferences(user.user_id, prefs)

            // Update local preferences state
            setPreferences((prev) => {
                if (!prev) {
                    // Initialize with defaults if no preferences exist
                    return {
                        volume: prefs.volume ?? 0.75,
                        tc_enable: prefs.tc_enable ?? false,
                        tc_target: (prefs.tc_target as 'mp3' | 'aac' | 'opus' | 'flac') ?? 'mp3',
                        tc_bitrate: (prefs.tc_bitrate as 128 | 256 | 320) ?? 320,
                        theme: (prefs.theme as 'light' | 'dark' | 'system') ?? 'system',
                        notification: prefs.notification ?? false,
                    }
                }

                return {
                    ...prev,
                    ...(prefs.volume !== undefined && { volume: prefs.volume }),
                    ...(prefs.tc_enable !== undefined && { tc_enable: prefs.tc_enable }),
                    ...(prefs.tc_target !== undefined && { tc_target: prefs.tc_target as 'mp3' | 'aac' | 'opus' | 'flac' }),
                    ...(prefs.tc_bitrate !== undefined && { tc_bitrate: prefs.tc_bitrate as 128 | 256 | 320 }),
                    ...(prefs.theme !== undefined && { theme: prefs.theme as 'light' | 'dark' | 'system' }),
                    ...(prefs.notification !== undefined && { notification: prefs.notification }),
                }
            })
        } catch (error) {
            console.error('Failed to update user preferences:', error)
        }
    }, [user?.user_id])

    // Initialize preferences from user data
    useEffect(() => {
        if (user?.preferences) {
            setPreferences(user.preferences)
            // Also sync volume from preferences
            if (user.preferences.volume !== undefined) {
                setVolume(user.preferences.volume)
            }
        } else {
            setPreferences(null)
        }
    }, [user?.preferences])

    // Clear player state when user logs out
    useEffect(() => {
        if (!user) {
            // User logged out - stop all playback and clear state
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
                // Revoke blob URL to prevent memory leaks
                if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
                    URL.revokeObjectURL(audioRef.current.src)
                }
                audioRef.current.src = ''
            }

            // Clear all player state
            setCurrentSong(null)
            setIsPlaying(false)
            setCurrentAlbum(null)
            setQueue([])
            setCurrentQueueIndex(-1)
            setCurrentTime(0)
            setDuration(0)
            setIsLoading(false)
        }
    }, [user])

    // Load libraries when user is available
    useEffect(() => {
        if (user?.user_id) {
            loadLibraries()
        } else {
            setLibraries([])
            setCurrentLibraryId(null)
        }
    }, [user?.user_id])

    // Set first library as current when libraries are loaded
    useEffect(() => {
        if (libraries.length > 0 && currentLibraryId === null) {
            setCurrentLibraryId(libraries[0].id)
        }
    }, [libraries, currentLibraryId])

    const loadLibraries = async () => {
        if (!user?.user_id) return

        setIsLoadingLibraries(true)
        try {
            const data = await get<Library[]>(`/libraries/user/${user.user_id}`)
            setLibraries(data)
        } catch (err) {
            console.error('Failed to load libraries:', err)
        } finally {
            setIsLoadingLibraries(false)
        }
    }

    const refreshLibraries = async () => {
        await loadLibraries()
    }

    const addLibrary = (library: Library) => {
        setLibraries(prev => [...prev, library])
        // Set as current if it's the first library
        if (libraries.length === 0) {
            setCurrentLibraryId(library.id)
        }
    }

    const updateLibrary = (library: Library) => {
        setLibraries(prev =>
            prev.map(lib => lib.id === library.id ? library : lib)
        )
    }

    const removeLibrary = (id: number) => {
        setLibraries(prev => prev.filter(lib => lib.id !== id))
        // If removing current library, switch to another
        if (currentLibraryId === id) {
            const remaining = libraries.filter(lib => lib.id !== id)
            setCurrentLibraryId(remaining.length > 0 ? remaining[0].id : null)
        }
    }

    const value: AppContextType = {
        user,
        libraries,
        currentLibraryId,
        isLoadingLibraries,
        setCurrentLibraryId,
        refreshLibraries,
        addLibrary,
        updateLibrary,
        removeLibrary,
        preferences,
        updatePreferences,
        currentSong,
        isPlaying,
        currentAlbum,
        isFullscreenPlayerOpen,
        currentTime,
        duration,
        volume,
        isLoading,
        queue,
        currentQueueIndex,
        playMode,
        setCurrentSong,
        setIsPlaying,
        setCurrentAlbum,
        setIsFullscreenPlayerOpen,
        play,
        pause,
        togglePlayPause,
        seek,
        changeVolume,
        playAlbum,
        playSong,
        playNext,
        playPrevious,
        playQueueIndex,
        clearQueue,
        togglePlayMode,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
