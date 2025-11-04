import { useTranslation } from 'react-i18next'
import SpotlightCard from './SpotlightCard/SpotlightCard'

export default function Devices() {
  const { t } = useTranslation()

  const devices = [
    { name: t('devices.study'), hint: 'USB DAC / ASIO / WASAPI' },
    { name: t('devices.livingRoom'), hint: 'HDMI ARC / eARC / AirPlay 2' },
    { name: t('devices.bedroom'), hint: 'Chromecast / Spotify Connect' },
    { name: t('devices.studio'), hint: 'Exclusive / Bit-Perfect' },
  ]

  return (
    <section id="devices" className="w-full py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-3xl font-thin">{t('devices.title')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {devices.map((d, i) => (
            <SpotlightCard key={i} className="glass" spotlightColor="rgba(0, 229, 255, 0.2)">
              <div className="mb-3 h-40 w-full rounded-xl border border-white/10 bg-brand-x" />
              <h3 className="text-body font-semibold">{d.name}</h3>
              <p className="text-sm text-neutral-400">{d.hint}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
