import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import { Toggle } from '../form/Toggle'
import { Select } from '../form/Select'
import { Radio } from '../form/Radio'

export const TranscodingSettingsTab = () => {
    const { t } = useTranslation()
    const { preferences, updatePreferences } = useApp()

    const [transcodingEnabled, setTranscodingEnabled] = useState(preferences?.tc_enable ?? false)
    const [audioQuality, setAudioQuality] = useState(String(preferences?.tc_bitrate ?? 320))
    const [transcodingFormat, setTranscodingFormat] = useState(preferences?.tc_target ?? 'mp3')

    // Sync local state with preferences when they change
    useEffect(() => {
        if (preferences) {
            setTranscodingEnabled(preferences.tc_enable || false)
            setAudioQuality(String(preferences.tc_bitrate))
            setTranscodingFormat(preferences.tc_target || 'mp3')
        }
    }, [preferences])

    const handleTranscodingEnabledChange = (enabled: boolean) => {
        setTranscodingEnabled(enabled)
        updatePreferences({ tc_enable: enabled })
    }

    const handleFormatChange = (format: string) => {
        const validFormat = format as 'mp3' | 'aac' | 'opus' | 'flac'
        setTranscodingFormat(validFormat)
        updatePreferences({ tc_target: format })
    }

    const handleQualityChange = (quality: string) => {
        setAudioQuality(quality)
        updatePreferences({ tc_bitrate: parseInt(quality, 10) })
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{t('settings.transcoding.general')}</h3>
                <div className="space-y-4">
                    <Toggle
                        label={t('settings.transcoding.enable')}
                        description={t('settings.transcoding.enableDesc')}
                        checked={transcodingEnabled}
                        onChange={handleTranscodingEnabledChange}
                    />
                    <Select
                        label={t('settings.transcoding.format')}
                        description={t('settings.transcoding.formatDesc')}
                        value={transcodingFormat}
                        onChange={handleFormatChange}
                        options={[
                            { value: 'mp3', label: 'MP3' },
                            { value: 'aac', label: 'AAC' },
                            { value: 'opus', label: 'Opus' },
                            { value: 'flac', label: 'FLAC' },
                        ]}
                        disabled={!transcodingEnabled}
                    />
                    <Radio
                        label={t('settings.transcoding.quality')}
                        description={t('settings.transcoding.qualityDesc')}
                        value={audioQuality}
                        onChange={handleQualityChange}
                        options={[
                            { value: '128', label: t('settings.transcoding.quality128'), description: t('settings.transcoding.quality128Desc') },
                            { value: '256', label: t('settings.transcoding.quality256'), description: t('settings.transcoding.quality256Desc') },
                            { value: '320', label: t('settings.transcoding.quality320'), description: t('settings.transcoding.quality320Desc') },
                        ]}
                        disabled={!transcodingEnabled}
                    />
                </div>
            </div>
        </div>
    )
}
