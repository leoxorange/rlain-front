import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserSettingsTab } from './settings/UserSettingsTab'
import { LibrarySettingsTab } from './settings/LibrarySettingsTab'
import { TranscodingSettingsTab } from './settings/TranscodingSettingsTab'
import { ServerSettingsTab } from './settings/ServerSettingsTab'
import { AboutSettingsTab } from './settings/AboutSettingsTab'

interface SettingsPanelProps {
    isOpen: boolean
    onClose: () => void
}

type TabType = 'user' | 'library' | 'transcoding' | 'server' | 'about'

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<TabType>('user')

    if (!isOpen) return null

    const tabs = [
        { id: 'user' as TabType, label: t('settings.tabs.user') },
        { id: 'library' as TabType, label: t('settings.tabs.library') },
        { id: 'transcoding' as TabType, label: t('settings.tabs.transcoding') },
        { id: 'server' as TabType, label: t('settings.tabs.server') },
        { id: 'about' as TabType, label: t('settings.tabs.about') },
    ]

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving settings...')
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md bg-black/30"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--card)]/95 to-[var(--bg)]/95 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[var(--primary)]/10 to-transparent px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[var(--primary)]/20 p-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text)]">{t('settings.title')}</h2>
                            <p className="text-xs text-[var(--muted)]">{t('settings.subtitle')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
                        aria-label={t('common.close')}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-white/10 bg-[var(--bg-alt)]/50 px-6 overflow-x-auto">
                    <div className="flex gap-1 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                                    activeTab === tab.id
                                        ? 'text-[var(--primary)]'
                                        : 'text-[var(--muted)] hover:text-[var(--text)]'
                                }`}
                            >
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'user' && <UserSettingsTab />}
                    {activeTab === 'library' && <LibrarySettingsTab />}
                    {activeTab === 'transcoding' && <TranscodingSettingsTab />}
                    {activeTab === 'server' && <ServerSettingsTab />}
                    {activeTab === 'about' && <AboutSettingsTab />}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 bg-[var(--bg-alt)]/50 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        {t('common.save')}
                    </button>
                </div>
            </div>
        </div>
    )
}
