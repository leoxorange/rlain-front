import { type ReactNode } from 'react'
import { Logo } from './Logo'

export interface SidebarNavItem {
    id: string
    label: string
    icon: ReactNode
    href?: string
    onClick?: () => void
    isActive?: boolean
}

export interface SidebarProps {
    navigationItems: SidebarNavItem[]
    className?: string
    logoClassName?: string
    showLogo?: boolean
    isCollapsed?: boolean
    onToggle?: () => void
}

export function Sidebar({
    navigationItems,
    className = '',
    logoClassName = 'text-3xl',
    showLogo = true,
    isCollapsed = false,
    onToggle
}: SidebarProps) {
    return (
        <aside className={`fixed left-0 top-0 h-full border-r border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-300 z-40 ${isCollapsed ? '-translate-x-full w-64' : 'translate-x-0 w-64'} ${className}`}>
            {showLogo && (
                <div className="mb-8">
                    <Logo className={logoClassName} />
                </div>
            )}

            <nav className="space-y-2">
                {navigationItems.map((item) => {
                    const Tag = item.href ? 'a' : 'button'
                    const baseClasses = "flex w-full items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors"
                    const activeClasses = item.isActive
                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] hover:cursor-pointer"

                    return (
                        <Tag
                            key={item.id}
                            href={item.href}
                            onClick={item.onClick}
                            className={`${baseClasses} ${activeClasses}`}
                        >
                            {item.icon}
                            {item.label}
                        </Tag>
                    )
                })}
            </nav>

            {/* Toggle Button - Visible on the right edge when sidebar is open */}
            {onToggle && !isCollapsed && (
                <button
                    onClick={onToggle}
                    className="absolute -right-4 top-6 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text)] shadow-lg transition-all hover:bg-[var(--overlay)] hover:scale-110"
                    aria-label="Close sidebar"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            )}
        </aside>
    )
}
