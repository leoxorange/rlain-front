import { useTranslation } from 'react-i18next'

export const AboutSettingsTab = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="text-center space-y-4 py-8">
                <div className="inline-block rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-[var(--text)]">LAIN</h3>
                    <p className="text-sm text-[var(--muted)] mt-1">{t('settings.about.version')} 1.0.0</p>
                </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{t('settings.about.systemInfo')}</h3>
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                        <span className="text-sm text-[var(--muted)]">{t('settings.about.serverVersion')}</span>
                        <span className="text-sm font-medium text-[var(--text)]">v1.0.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                        <span className="text-sm text-[var(--muted)]">{t('settings.about.platform')}</span>
                        <span className="text-sm font-medium text-[var(--text)]">Linux x64</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                        <span className="text-sm text-[var(--muted)]">{t('settings.about.uptime')}</span>
                        <span className="text-sm font-medium text-[var(--text)]">24h 35m</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{t('settings.about.links')}</h3>
                <div className="space-y-2">
                    <a href="#" className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        {t('settings.about.documentation')}
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        {t('settings.about.support')}
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        {t('settings.about.github')}
                    </a>
                </div>
            </div>
        </div>
    )
}
