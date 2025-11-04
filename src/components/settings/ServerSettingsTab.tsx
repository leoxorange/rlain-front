import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Toggle } from '../form/Toggle'
import { Input } from '../form/Input'

export const ServerSettingsTab = () => {
    const { t } = useTranslation()

    const [serverPort, setServerPort] = useState('8096')
    const [maxConnections, setMaxConnections] = useState('10')
    const [enableHttps, setEnableHttps] = useState(false)
    const [enableLogging, setEnableLogging] = useState(true)

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{t('settings.server.network')}</h3>
                <div className="space-y-4">
                    <Input
                        label={t('settings.server.port')}
                        description={t('settings.server.portDesc')}
                        type="number"
                        value={serverPort}
                        onChange={setServerPort}
                    />
                    <Input
                        label={t('settings.server.maxConnections')}
                        description={t('settings.server.maxConnectionsDesc')}
                        type="number"
                        value={maxConnections}
                        onChange={setMaxConnections}
                    />
                    <Toggle
                        label={t('settings.server.enableHttps')}
                        description={t('settings.server.enableHttpsDesc')}
                        checked={enableHttps}
                        onChange={setEnableHttps}
                    />
                </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{t('settings.server.logging')}</h3>
                <div className="space-y-4">
                    <Toggle
                        label={t('settings.server.enableLogging')}
                        description={t('settings.server.enableLoggingDesc')}
                        checked={enableLogging}
                        onChange={setEnableLogging}
                    />
                </div>
            </div>
        </div>
    )
}
