import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Toggle } from '../form/Toggle'
import { Input } from '../form/Input'

export const UserSettingsTab = () => {
    const { t } = useTranslation()
    const { user } = useAuth()

    const [displayName, setDisplayName] = useState(user?.nickname || '')
    const [email, setEmail] = useState(user?.email || '')
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(false)

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{t('settings.user.profile')}</h3>
                <div className="space-y-4">
                    <Input
                        label={t('settings.user.displayName')}
                        description={t('settings.user.displayNameDesc')}
                        value={displayName}
                        onChange={setDisplayName}
                    />
                    <Input
                        label={t('settings.user.email')}
                        description={t('settings.user.emailDesc')}
                        type="email"
                        value={email}
                        onChange={setEmail}
                    />
                </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{t('settings.user.notifications')}</h3>
                <div className="space-y-4">
                    <Toggle
                        label={t('settings.user.enableNotifications')}
                        description={t('settings.user.enableNotificationsDesc')}
                        checked={notificationsEnabled}
                        onChange={setNotificationsEnabled}
                    />
                    <Toggle
                        label={t('settings.user.emailNotifications')}
                        description={t('settings.user.emailNotificationsDesc')}
                        checked={emailNotifications}
                        onChange={setEmailNotifications}
                        disabled={!notificationsEnabled}
                    />
                </div>
            </div>
        </div>
    )
}
