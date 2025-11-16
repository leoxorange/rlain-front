import { createContext, useContext, useState, type ReactNode } from 'react'
import { ContextMenu, type ContextMenuItem } from '../components/ContextMenu'

interface ContextMenuState {
    items: ContextMenuItem[]
    position: { x: number; y: number }
    isOpen: boolean
}

interface ContextMenuContextType {
    showContextMenu: (items: ContextMenuItem[], event: React.MouseEvent) => void
    hideContextMenu: () => void
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined)

export function ContextMenuProvider({ children }: { children: ReactNode }) {
    const [menuState, setMenuState] = useState<ContextMenuState>({
        items: [],
        position: { x: 0, y: 0 },
        isOpen: false
    })

    const showContextMenu = (items: ContextMenuItem[], event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()

        setMenuState({
            items,
            position: { x: event.clientX, y: event.clientY },
            isOpen: true
        })
    }

    const hideContextMenu = () => {
        setMenuState(prev => ({ ...prev, isOpen: false }))
    }

    // Prevent default context menu globally
    const handleContextMenu = (e: MouseEvent) => {
        // Allow default context menu for input fields and textareas
        const target = e.target as HTMLElement
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            return
        }
        e.preventDefault()
    }

    // Add global context menu prevention
    useState(() => {
        document.addEventListener('contextmenu', handleContextMenu)
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
        }
    })

    return (
        <ContextMenuContext.Provider value={{ showContextMenu, hideContextMenu }}>
            {children}
            {menuState.isOpen && (
                <ContextMenu
                    items={menuState.items}
                    position={menuState.position}
                    onClose={hideContextMenu}
                />
            )}
        </ContextMenuContext.Provider>
    )
}

export function useContextMenu() {
    const context = useContext(ContextMenuContext)
    if (!context) {
        throw new Error('useContextMenu must be used within ContextMenuProvider')
    }
    return context
}
