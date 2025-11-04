import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Toggle } from '../form/Toggle'
import { Select } from '../form/Select'
import { Radio } from '../form/Radio'

export const TranscodingSettingsTab = () => {
    const { t } = useTranslation()

    const [transcodingEnabled, setTranscodingEnabled] = useState(false)
    const [audioQuality, setAudioQuality] = useState('320')
    const [transcodingFormat, setTranscodingFormat] = useState('mp3')

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{t('settings.transcoding.general')}</h3>
                <div className="space-y-4">
                    <Toggle
                        label={t('settings.transcoding.enable')}
                        description={t('settings.transcoding.enableDesc')}
                        checked={transcodingEnabled}
                        onChange={setTranscodingEnabled}
                    />
                    <Select
                        label={t('settings.transcoding.format')}
                        description={t('settings.transcoding.formatDesc')}
                        value={transcodingFormat}
                        onChange={setTranscodingFormat}
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
                        onChange={setAudioQuality}
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
