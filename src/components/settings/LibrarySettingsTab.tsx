import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import { Toggle } from '../form/Toggle'
import { Input } from '../form/Input'
import { post, put, del } from '../../utils/net'

export const LibrarySettingsTab = () => {
    const { t } = useTranslation()
    const { user, libraries, isLoadingLibraries, addLibrary, updateLibrary, removeLibrary } = useApp()

    // Library management state
    const [editingLibrary, setEditingLibrary] = useState<Library | null>(null)
    const [isAddingLibrary, setIsAddingLibrary] = useState(false)
    const [newLibraryName, setNewLibraryName] = useState('')
    const [newLibraryPath, setNewLibraryPath] = useState('')
    const [newLibraryIsPublic, setNewLibraryIsPublic] = useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

    const handleAddLibrary = async () => {
        if (!newLibraryName.trim() || !newLibraryPath.trim() || !user?.user_id) return

        try {
            const newLibrary = await post<Library>('/libraries', {
                name: newLibraryName,
                path: newLibraryPath,
                user_id: user.user_id,
                is_public: newLibraryIsPublic,
            })
            addLibrary(newLibrary)
            setNewLibraryName('')
            setNewLibraryPath('')
            setNewLibraryIsPublic(false)
            setIsAddingLibrary(false)
        } catch (err) {
            console.error('Failed to add library:', err)
            // Mock success for development
            const mockLibrary: Library = {
                id: Date.now(),
                name: newLibraryName,
                path: newLibraryPath,
                user_id: user.user_id,
                is_public: newLibraryIsPublic,
                created: new Date(),
                updated: new Date(),
            }
            addLibrary(mockLibrary)
            setNewLibraryName('')
            setNewLibraryPath('')
            setNewLibraryIsPublic(false)
            setIsAddingLibrary(false)
        }
    }

    const handleUpdateLibrary = async (library: Library) => {
        try {
            await put(`/libraries/${library.id}`, library)
            updateLibrary(library)
            setEditingLibrary(null)
        } catch (err) {
            console.error('Failed to update library:', err)
            // Mock success for development
            updateLibrary(library)
            setEditingLibrary(null)
        }
    }

    const handleDeleteLibrary = async (id: number) => {
        try {
            await del(`/libraries/${id}`)
            removeLibrary(id)
            setDeleteConfirmId(null)
        } catch (err) {
            console.error('Failed to delete library:', err)
            // Mock success for development
            removeLibrary(id)
            setDeleteConfirmId(null)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Library Management Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--text)]">{t('settings.library.management')}</h3>
                    <button
                        onClick={() => setIsAddingLibrary(true)}
                        className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        {t('settings.library.addLibrary')}
                    </button>
                </div>

                {/* Add Library Form */}
                {isAddingLibrary && (
                    <div className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] p-4 space-y-3">
                        <Input
                            label={t('settings.library.libraryName')}
                            value={newLibraryName}
                            onChange={setNewLibraryName}
                            placeholder={t('settings.library.libraryNamePlaceholder')}
                            required
                        />
                        <Input
                            label={t('settings.library.libraryPath')}
                            value={newLibraryPath}
                            onChange={setNewLibraryPath}
                            placeholder={t('settings.library.libraryPathPlaceholder')}
                            required
                        />
                        <Toggle
                            label={t('settings.library.isPublic')}
                            description={t('settings.library.isPublicDesc')}
                            checked={newLibraryIsPublic}
                            onChange={setNewLibraryIsPublic}
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setIsAddingLibrary(false)
                                    setNewLibraryName('')
                                    setNewLibraryPath('')
                                    setNewLibraryIsPublic(false)
                                }}
                                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleAddLibrary}
                                disabled={!newLibraryName.trim() || !newLibraryPath.trim()}
                                className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('settings.library.addLibrary')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Libraries List */}
                <div className="space-y-2">
                    {isLoadingLibraries ? (
                        <div className="text-center py-8 text-sm text-[var(--muted)]">
                            {t('library.loading')}
                        </div>
                    ) : libraries.length === 0 ? (
                        <div className="text-center py-8 space-y-2">
                            <p className="text-sm text-[var(--muted)]">{t('settings.library.noLibrariesFound')}</p>
                            <p className="text-xs text-[var(--muted)]">{t('settings.library.createFirstLibrary')}</p>
                        </div>
                    ) : (
                        libraries.map((library) => (
                            <div
                                key={library.id}
                                className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
                            >
                                {editingLibrary?.id === library.id ? (
                                    // Edit Mode
                                    <div className="space-y-3">
                                        <Input
                                            label={t('settings.library.libraryName')}
                                            value={editingLibrary.name}
                                            onChange={(value) => setEditingLibrary({ ...editingLibrary, name: value })}
                                        />
                                        <Input
                                            label={t('settings.library.libraryPath')}
                                            value={String(editingLibrary.path)}
                                            onChange={(value) => setEditingLibrary({ ...editingLibrary, path: value })}
                                        />
                                        <Toggle
                                            label={t('settings.library.isPublic')}
                                            description={t('settings.library.isPublicDesc')}
                                            checked={editingLibrary.is_public}
                                            onChange={(value) => setEditingLibrary({ ...editingLibrary, is_public: value })}
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => setEditingLibrary(null)}
                                                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                                            >
                                                {t('common.cancel')}
                                            </button>
                                            <button
                                                onClick={() => handleUpdateLibrary(editingLibrary)}
                                                className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                                            >
                                                {t('common.save')}
                                            </button>
                                        </div>
                                    </div>
                                ) : deleteConfirmId === library.id ? (
                                    // Delete Confirmation
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-[var(--text)]">{t('settings.library.confirmDelete')}</p>
                                            <p className="text-xs text-red-400 mt-1">{t('settings.library.deleteWarning')}</p>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => setDeleteConfirmId(null)}
                                                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--overlay)] transition-colors"
                                            >
                                                {t('common.cancel')}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLibrary(library.id)}
                                                className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                                            >
                                                {t('settings.library.deleteLibrary')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-semibold text-[var(--text)]">{library.name}</h4>
                                                    {library.is_public && (
                                                        <span className="inline-flex items-center rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
                                                            {t('settings.library.isPublic')}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[var(--muted)] mt-1 font-mono">{String(library.path)}</p>
                                            </div>
                                            <div className="flex gap-4 text-xs text-[var(--muted)]">
                                                <div>
                                                    <span className="font-medium">{t('settings.library.createdAt')}:</span>{' '}
                                                    {new Date(library.created).toLocaleDateString()}
                                                </div>
                                                <div>
                                                    <span className="font-medium">{t('settings.library.updatedAt')}:</span>{' '}
                                                    {new Date(library.updated).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => setEditingLibrary(library)}
                                                className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--overlay)] hover:text-[var(--text)] transition-colors"
                                                title={t('settings.library.editLibrary')}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(library.id)}
                                                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors"
                                                title={t('settings.library.deleteLibrary')}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
