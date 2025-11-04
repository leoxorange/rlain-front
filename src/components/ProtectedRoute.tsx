import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuth, isLoading } = useAuth()

    // Show nothing while checking auth state (prevents flash)
    if (isLoading) {
        return null
    }

    if (!isAuth) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
