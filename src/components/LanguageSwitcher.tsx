import { useTranslation } from 'react-i18next'

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation()

    const toggleLanguage = () => {
        const newLang = i18n.language === 'zh' ? 'en' : 'zh'
        i18n.changeLanguage(newLang)
    }

    return (
        <button
            onClick={toggleLanguage}
            className="btn-ring rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[color-mix(in srgb,var(--card),var(--overlay) 40%)]"
            aria-label="切换语言 / Switch Language"
            title={i18n.language === 'zh' ? 'Switch to English' : '切换到中文'}
        >
            {i18n.language === 'zh' ? 'EN' : '中文'}
        </button>
    )
}
