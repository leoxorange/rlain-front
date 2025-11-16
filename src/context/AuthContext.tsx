import { createContext, useContext, useState, type ReactNode } from 'react'
import { getUserInfo, saveAuth, clearAuth, isAuthenticated, saveUserInfo } from '../utils/auth'

interface AuthContextType {
    user: UserInfo | null
    isAuth: boolean
    isLoading: boolean
    login: (authResponse: AuthResponse) => void
    logout: () => void
    updateUser: (updatedUser: Partial<UserInfo>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Initialize auth state synchronously from localStorage to prevent flash
    const [user, setUser] = useState<UserInfo | null>(() => getUserInfo())
    const [isAuth, setIsAuth] = useState(() => isAuthenticated())
    const [isLoading] = useState(false)

    const login = (authResponse: AuthResponse) => {
        saveAuth(authResponse)
        setUser({
            user_id: authResponse.user_id,
            username: authResponse.username,
            email: authResponse.email,
            nickname: authResponse.nickname,
            preferences: authResponse.preferences
        })
        setIsAuth(true)
    }

    const logout = () => {
        clearAuth()
        setUser(null)
        setIsAuth(false)
    }

    const updateUser = (updatedUser: Partial<UserInfo>) => {
        if (!user) return

        const newUser = {
            ...user,
            ...updatedUser
        }

        setUser(newUser)
        saveUserInfo(newUser)
    }

    return (
        <AuthContext.Provider value={{ user, isAuth, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
