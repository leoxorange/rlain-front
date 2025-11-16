const TOKEN_KEY = 'rlain_auth_token'
const USER_KEY = 'rlain_user_info'
const DEBUG = true

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

// Base64 encoding/decoding helpers
const encodeBase64 = (str: string): string => {
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
            return String.fromCharCode(parseInt(p1, 16))
        }))
    } catch {
        // Fallback for browsers without btoa
        return str
    }
}

const decodeBase64 = (str: string): string => {
    try {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    } catch {
        // Fallback if decoding fails
        return str
    }
}

// User info management with base64 encoding
export const saveUserInfo = (user: UserInfo): void => {
    let encodedUser;
    if(DEBUG) {
        encodedUser = JSON.stringify(user)
    } else encodedUser = encodeBase64(JSON.stringify(user))
    localStorage.setItem(USER_KEY, encodedUser)
}

export const getUserInfo = (): UserInfo | null => {
    const encodedUserStr = localStorage.getItem(USER_KEY)
    if (!encodedUserStr) return null
    try {
        if(DEBUG) {
            return JSON.parse(encodedUserStr)
        } else {
            return JSON.parse(decodeBase64(encodedUserStr))
        }
    } catch (error) {
        console.error('Failed to decode user info:', error)
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
