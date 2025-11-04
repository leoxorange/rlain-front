import { useTranslation } from 'react-i18next'

export default function Features() {
  const { t } = useTranslation()

  const cards = [
    { title: t('features.unifiedLibrary'), desc: t('features.unifiedLibraryDesc') },
    { title: t('features.discovery'), desc: t('features.discoveryDesc') },
    { title: t('features.multiRoom'), desc: t('features.multiRoomDesc') },
    { title: t('features.audiophile'), desc: t('features.audiophileDesc') }
  ]

  return (
    <section id="features" className="w-full glass py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-3xl font-thin">{t('features.title')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow">
              <h3 className="mb-1 text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-muted">{c.desc}</p>
              <a href="#" className="mt-3 inline-block text-sm font-medium text-indigo-300 hover:text-indigo-200">
                {t('features.learnMore')} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
