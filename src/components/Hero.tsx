import { useTranslation } from 'react-i18next'
import { Logo } from "./Logo";

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="w-full py-20 sm:py-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* 左侧文案 */}
        <div>
          <Logo className="text-5xl"/>
          <p className="mb-5 max-w-xl text-muted">
            {t('hero.description')}
          </p>
          <div className="mb-3 flex flex-wrap gap-3">
            <button className="rounded-xl bg-gradient-to-tr from-[var(--accent)] to-violet-400 px-5 py-3 text-base font-semibold text-neutral-900 shadow hover:opacity-90">
              {t('hero.getStarted')}
            </button>
          </div>
          <div className="text-sm text-neutral-400">{t('hero.features')}</div>
        </div>

        {/* 右侧视觉 */}
        <div className="w-full">
          <div className="rounded-2xl glass p-5 backdrop-blur">
            {/* now playing */}
            <div className="flex items-center gap-4">
              <div className="h-18 w-18 rounded-lg bg-gradient-to-br from-[var(--accent)] to-violet-400 shadow" style={{height:72, width:72}}/>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-lg font-semibold">Midnight City</h4>
                <p className="truncate text-sm text-muted">M83 · Hurry Up, We&apos;re Dreaming</p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded bg-neutral-800">
                  <div className="h-full w-[42%] bg-gradient-to-r from-indigo-400 to-violet-400" />
                </div>
              </div>
            </div>
            {/* spectrum */}
            <div className="mt-5 h-36 w-full overflow-hidden rounded-xl bg-brand-grad">
              <div className="h-full w-full bg-brand-x" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
