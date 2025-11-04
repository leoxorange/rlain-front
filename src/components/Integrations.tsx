import { useTranslation } from 'react-i18next'

const brands = [
  'Spotify','Apple Music','Tidal','Qobuz','YouTube Music','NAS','AirPlay 2','Chromecast','DLNA'
]

export default function Integrations() {
  const { t } = useTranslation()

  return (
    <section id="integrations" className="w-full py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-center text-3xl font-thin">{t('integrations.title')}</h2>
        <p className="mx-auto mb-5 max-w-2xl text-center text-muted">
          {t('integrations.subtitle')}
        </p>
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3">
          {brands.map((b, i) => (
            <div key={i}
              className="rounded-full border border-white/10 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-100">
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
