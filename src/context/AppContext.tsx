import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { get } from '../utils/net'
import type { UserInfo } from '../utils/auth'

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
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
    children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const { user } = useAuth()

    // Libraries state
    const [libraries, setLibraries] = useState<Library[]>([])
    const [currentLibraryId, setCurrentLibraryId] = useState<number | null>(null)
    const [isLoadingLibraries, setIsLoadingLibraries] = useState(false)

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
            // Mock data for development
            setLibraries([
                {
                    id: 1,
                    name: 'My Music',
                    path: '/music/personal',
                    user_id: user.user_id,
                    is_public: false,
                    created: new Date(),
                    updated: new Date()
                },
                {
                    id: 2,
                    name: 'Family Library',
                    path: '/music/family',
                    user_id: user.user_id,
                    is_public: true,
                    created: new Date(),
                    updated: new Date()
                },
            ])
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
