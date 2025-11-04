interface InputProps {
    label: string
    description?: string
    value: string
    onChange: (value: string) => void
    type?: 'text' | 'email' | 'password' | 'number'
    placeholder?: string
    disabled?: boolean
    required?: boolean
}

export const Input = ({
    label,
    description,
    value,
    onChange,
    type = 'text',
    placeholder,
    disabled,
    required
}: InputProps) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text)]">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {description && (
                <p className="text-xs text-[var(--muted)]">{description}</p>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    )
}
