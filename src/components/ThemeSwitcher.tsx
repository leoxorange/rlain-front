import { useEffect, useState } from 'react'

function applyThemeClass(next: 'light' | 'dark') {
    const el = document.documentElement
    if (next === 'dark') el.classList.add('dark')
    else el.classList.remove('dark')
    localStorage.setItem('theme', next)
}

function getInitialTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) return saved
    // Follow system preference
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
    return mql?.matches ? 'dark' : 'light'
}

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme())

    useEffect(() => {
        applyThemeClass(theme)
        // Sync with system theme changes (only when not manually set)
        const mql = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = (e: MediaQueryListEvent) => {
            const saved = localStorage.getItem('theme')
            if (!saved) {
                const next = e.matches ? 'dark' : 'light'
                setTheme(next)
                applyThemeClass(next)
            }
        }
        mql.addEventListener('change', onChange)
        return () => mql.removeEventListener('change', onChange)
    }, [theme])

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        applyThemeClass(next)
    }

    return (
        <button
            onClick={toggleTheme}
            className="btn-ring rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text)] hover:bg-[color-mix(in srgb,var(--card),var(--overlay) 40%)]"
            aria-label="切换浅色/深色模式"
            title={theme === 'dark' ? '切换为浅色' : '切换为深色'}
        >
            {theme === 'dark' ? (
                /* Moon icon */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"></path>
                </svg>
            ) : (
                /* Sun icon */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm10-8a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zM4 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm14.95 6.364a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414zM6.171 6.171a1 1 0 0 1-1.414 0L4.05 5.464A1 1 0 0 1 5.464 4.05l.707.707a1 1 0 0 1 0 1.414zm12.728-2.121a1 1 0 0 1 0 1.414l-.707.707A1 1 0 1 1 16.778 4.05l.707-.707a1 1 0 0 1 1.414 0zM6.171 17.829a1 1 0 0 1 0 1.414l-.707.707A1 1 0 0 1 4.05 18.536l.707-.707a1 1 0 0 1 1.414 0z" />
                </svg>
            )}
        </button>
    )
}
