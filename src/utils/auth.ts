const TOKEN_KEY = 'rlain_auth_token'
const USER_KEY = 'rlain_user_info'

// Token management
export const saveToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY)
}

// User info management
export const saveUserInfo = (user: UserInfo): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUserInfo = (): UserInfo | null => {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null
    try {
        return JSON.parse(userStr)
    } catch {
        return null
    }
}

export const removeUserInfo = (): void => {
    localStorage.removeItem(USER_KEY)
}

// Combined auth operations
export const saveAuth = (authResponse: AuthResponse): void => {
    saveToken(authResponse.token)
    saveUserInfo({
        user_id: authResponse.user_id,
        username: authResponse.username,
        email: authResponse.email,
        nickname: authResponse.nickname,
        preferences: authResponse.preferences
    })
}

export const clearAuth = (): void => {
    removeToken()
    removeUserInfo()
}

export const isAuthenticated = (): boolean => {
    return !!getToken()
}
