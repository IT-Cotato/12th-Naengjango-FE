type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export default function Toggle({ checked, onChange, disabled = false, label, className }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-8.5 w-24 items-center rounded-full bg-white-800/40
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className ?? ''}
      `}
    >
      <span
        className={`
          absolute Regular_10 left-5 transition-colors duration-200 ease-in-out text-gray-800 z-10
        `}
      >
        ON
      </span>

      <span
        className={`
          absolute right-4.5 Regular_10 transition-colors duration-200 ease-in-out text-gray-800 z-10
        `}
      >
        OFF
      </span>

      <span
        className={`
          absolute inline-block h-6 w-12 transform rounded-[20px] bg-white shadow-sm transition-transform duration-200 ease-in-out z-0
          ${checked ? 'translate-x-11' : 'translate-x-1'}
        `}
      />

      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}
