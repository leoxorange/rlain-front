import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { Toggle } from '../form/Toggle'
import { Input } from '../form/Input'
import { updateUser as updateUserApi } from '../../utils/net'

export const UserSettingsTab = () => {
    const { t } = useTranslation()
    const { user, updateUser } = useAuth()
    const { preferences, updatePreferences } = useApp()

    const [displayName, setDisplayName] = useState(user?.nickname || '')
    const [email, setEmail] = useState(user?.email || '')
    const [notificationsEnabled, setNotificationsEnabled] = useState(preferences?.notification ?? false)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [hasChanges, setHasChanges] = useState(false)
    // const [emailNotifications, setEmailNotifications] = useState(false)

    // Sync user data when user changes
    useEffect(() => {
        if (user) {
            setDisplayName(user.nickname || '')
            setEmail(user.email || '')
        }
    }, [user])

    // Sync notification setting with preferences
    useEffect(() => {
        if (preferences) {
            setNotificationsEnabled(preferences.notification || false)
        }
    }, [preferences])

    // Check if there are unsaved changes
    useEffect(() => {
        const changed = displayName !== (user?.nickname || '') || email !== (user?.email || '')
        setHasChanges(changed)
    }, [displayName, email, user])

    const handleNotificationsChange = (enabled: boolean) => {
        setNotificationsEnabled(enabled)
        updatePreferences({ notification: enabled })
    }

    const handleSaveChanges = async () => {
        if (!user?.user_id || !hasChanges) return

        setIsSaving(true)
        setMessage(null)

        try {
            const updatedUserData = await updateUserApi(user.user_id, {
                nickname: displayName,
                email: email
            })

            // Update local user state and localStorage
            updateUser({
                nickname: updatedUserData.nickname,
                email: updatedUserData.email
            })

            setMessage({ type: 'success', text: t('settings.user.updateSuccess') })
            setHasChanges(false)

            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000)
        } catch (error) {
            console.error('Failed to update user:', error)
            setMessage({ type: 'error', text: t('settings.user.updateError') })
        } finally {
            setIsSaving(false)
        }
    }

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

                    {/* Save button */}
                    <div className="flex items-center gap-4 pt-2">
                        <button
                            onClick={handleSaveChanges}
                            disabled={!hasChanges || isSaving}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                hasChanges && !isSaving
                                    ? 'bg-[var(--primary)] text-white hover:opacity-90'
                                    : 'bg-[var(--surface)] text-[var(--text-secondary)] cursor-not-allowed'
                            }`}
                        >
                            {isSaving ? t('settings.user.saving') : t('settings.user.saveChanges')}
                        </button>

                        {/* Success/Error message */}
                        {message && (
                            <span
                                className={`text-sm ${
                                    message.type === 'success' ? 'text-green-500' : 'text-red-500'
                                }`}
                            >
                                {message.text}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{t('settings.user.notifications')}</h3>
                <div className="space-y-4">
                    <Toggle
                        label={t('settings.user.enableNotifications')}
                        description={t('settings.user.enableNotificationsDesc')}
                        checked={notificationsEnabled}
                        onChange={handleNotificationsChange}
                    />
                    {/* <Toggle
                        label={t('settings.user.emailNotifications')}
                        description={t('settings.user.emailNotificationsDesc')}
                        checked={emailNotifications}
                        onChange={setEmailNotifications}
                        disabled={!notificationsEnabled}
                    /> */}
                </div>
            </div>
        </div>
    )
}
