import { useTranslation } from 'react-i18next'
import { Logo } from "./Logo";

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="w-full border-t border-default bg-app py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <Logo />
          <p className="text-sm text-body">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <a className="text-muted hover:text-body" href="#">{t('footer.support')}</a>
          <a className="text-muted hover:text-body" href="#">{t('footer.privacy')}</a>
          <a className="text-muted hover:text-body" href="#">{t('footer.terms')}</a>
        </div>
      </div>
    </footer>
  )
}
