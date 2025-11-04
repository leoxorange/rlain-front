interface RadioOption {
    value: string
    label: string
    description?: string
}

interface RadioProps {
    label: string
    description?: string
    value: string
    options: RadioOption[]
    onChange: (value: string) => void
    disabled?: boolean
}

export const Radio = ({ label, description, value, options, onChange, disabled }: RadioProps) => {
    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-[var(--text)]">
                    {label}
                </label>
                {description && (
                    <p className="mt-1 text-xs text-[var(--muted)]">{description}</p>
                )}
            </div>
            <div className="space-y-2">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`flex items-start gap-3 rounded-lg border border-[var(--border)] p-3 cursor-pointer transition-colors ${
                            value === option.value
                                ? 'bg-[var(--primary)]/10 border-[var(--primary)]'
                                : 'hover:bg-[var(--overlay)]'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <input
                            type="radio"
                            value={option.value}
                            checked={value === option.value}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={disabled}
                            className="mt-0.5 h-4 w-4 border-[var(--border)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0"
                        />
                        <div className="flex-1">
                            <div className="text-sm font-medium text-[var(--text)]">{option.label}</div>
                            {option.description && (
                                <div className="mt-1 text-xs text-[var(--muted)]">{option.description}</div>
                            )}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    )
}
