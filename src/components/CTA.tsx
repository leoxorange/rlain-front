import { useTranslation } from 'react-i18next'

export default function CTA() {
  const { t } = useTranslation()

  return (
    <section className="w-full py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-indigo-400/15 to-violet-400/10 p-8 text-center shadow">
          <h2 className="text-3xl font-bold">{t('cta.title')}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted">
            {t('cta.subtitle')}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button className="rounded-xl bg-gradient-to-tr from-indigo-400 to-violet-400 px-5 py-3 text-base font-semibold text-neutral-900 shadow hover:opacity-90">
              {t('cta.startNow')}
            </button>
            <button className="rounded-xl border border-white/15 bg-neutral-900 px-5 py-3 text-base text-white hover:bg-neutral-800">
              {t('cta.viewPricing')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
