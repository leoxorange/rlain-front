import { useTranslation } from 'react-i18next'
import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'

interface NavbarAttr {
    handleFreeTrial: () => void
    handleLogin: () => void
}

export default function Navbar({ handleFreeTrial, handleLogin }: NavbarAttr) {
    const { t } = useTranslation()

    return (
        <header className="sticky top-0 z-50 w-full nav-glass">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                <Logo />

                <nav className="hidden gap-6 text-sm md:flex">
                    <a href="#integrations" className="text-[var(--muted)] hover:text-[var(--text)]">{t('nav.integrations')}</a>
                    <a href="#features" className="text-[var(--muted)] hover:text-[var(--text)]">{t('nav.features')}</a>
                    <a href="#devices" className="text-[var(--muted)] hover:text-[var(--text)]">{t('nav.devices')}</a>
                </nav>

                <div className="flex items-center gap-2">
                    {/* 语言切换 */}
                    <LanguageSwitcher />

                    {/* 主题切换 */}
                    <ThemeSwitcher />

                    <button onClick={handleLogin} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[color-mix(in srgb,var(--card),var(--overlay) 40%)]">
                        {t('nav.login')}
                    </button>
                    <button onClick={handleFreeTrial} className="rounded-lg bg-brand-grad px-4 py-2 text-sm font-semibold text-[var(--bg)] shadow hover:opacity-90">
                        {t('nav.freeTrial')}
                    </button>
                </div>
            </div>
        </header>
    )
}
