import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Welcome } from './pages/Welcome'
import Library from './pages/Library'

export default () => {
    return (
        <AuthProvider>
            <AppProvider>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route
                        path="/library"
                        element={
                            <ProtectedRoute>
                                <Library />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AppProvider>
        </AuthProvider>
    )
}
