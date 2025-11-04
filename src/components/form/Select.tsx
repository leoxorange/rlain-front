interface SelectOption {
    value: string
    label: string
}

interface SelectProps {
    label: string
    description?: string
    value: string
    options: SelectOption[]
    onChange: (value: string) => void
    disabled?: boolean
}

export const Select = ({ label, description, value, options, onChange, disabled }: SelectProps) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text)]">
                {label}
            </label>
            {description && (
                <p className="text-xs text-[var(--muted)]">{description}</p>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
