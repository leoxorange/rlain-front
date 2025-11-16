import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface ContextMenuItem {
    id: string
    label: string
    icon?: ReactNode
    onClick?: () => void
    divider?: boolean
    disabled?: boolean
    danger?: boolean
    submenu?: ContextMenuItem[]
}

export interface ContextMenuProps {
    items: ContextMenuItem[]
    position: { x: number; y: number }
    onClose: () => void
}

function SubmenuItem({ item, onClose }: { item: ContextMenuItem; onClose: () => void }) {
    const [showSubmenu, setShowSubmenu] = useState(false)
    const itemRef = useRef<HTMLButtonElement>(null)

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowSubmenu(true)}
            onMouseLeave={() => setShowSubmenu(false)}
        >
            <button
                ref={itemRef}
                disabled={item.disabled}
                className={`
                    w-full flex items-center gap-3 px-4 py-2 text-left text-sm
                    transition-colors
                    ${item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'text-[var(--text)] hover:bg-[var(--overlay)]'
                    }
                `}
            >
                {item.icon && (
                    <span className="flex-shrink-0">
                        {item.icon}
                    </span>
                )}
                <span className="flex-1">{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>

            {showSubmenu && item.submenu && (
                <div
                    className="absolute left-full top-0 ml-1 min-w-[200px] rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl py-1 z-[10000]"
                >
                    {item.submenu.map((subitem) => (
                        <button
                            key={subitem.id}
                            onClick={() => {
                                if (!subitem.disabled && subitem.onClick) {
                                    subitem.onClick()
                                    onClose()
                                }
                            }}
                            disabled={subitem.disabled}
                            className={`
                                w-full flex items-center gap-3 px-4 py-2 text-left text-sm
                                transition-colors
                                ${subitem.disabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : subitem.danger
                                        ? 'text-red-500 hover:bg-red-500/10'
                                        : 'text-[var(--text)] hover:bg-[var(--overlay)]'
                                }
                            `}
                        >
                            {subitem.icon && (
                                <span className="flex-shrink-0">
                                    {subitem.icon}
                                </span>
                            )}
                            <span className="flex-1">{subitem.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [onClose])

    // Adjust position to keep menu within viewport
    useEffect(() => {
        if (menuRef.current) {
            const menu = menuRef.current
            const rect = menu.getBoundingClientRect()
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight

            let { x, y } = position

            // Adjust horizontal position
            if (x + rect.width > viewportWidth) {
                x = viewportWidth - rect.width - 10
            }

            // Adjust vertical position
            if (y + rect.height > viewportHeight) {
                y = viewportHeight - rect.height - 10
            }

            menu.style.left = `${Math.max(10, x)}px`
            menu.style.top = `${Math.max(10, y)}px`
        }
    }, [position])

    const handleItemClick = (item: ContextMenuItem) => {
        if (!item.disabled && !item.submenu && item.onClick) {
            item.onClick()
            onClose()
        }
    }

    return (
        <div
            ref={menuRef}
            className="fixed z-[9999] min-w-[200px] rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl py-1"
            style={{ left: position.x, top: position.y }}
        >
            {items.map((item) => (
                <div key={item.id}>
                    {item.divider ? (
                        <div className="my-1 h-px bg-[var(--border)]" />
                    ) : item.submenu ? (
                        <SubmenuItem item={item} onClose={onClose} />
                    ) : (
                        <button
                            onClick={() => handleItemClick(item)}
                            disabled={item.disabled}
                            className={`
                                w-full flex items-center gap-3 px-4 py-2 text-left text-sm
                                transition-colors
                                ${item.disabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : item.danger
                                        ? 'text-red-500 hover:bg-red-500/10'
                                        : 'text-[var(--text)] hover:bg-[var(--overlay)]'
                                }
                            `}
                        >
                            {item.icon && (
                                <span className="flex-shrink-0">
                                    {item.icon}
                                </span>
                            )}
                            <span className="flex-1">{item.label}</span>
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
