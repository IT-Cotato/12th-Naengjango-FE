import { useRef } from 'react';

type Props = {
  open: boolean;

  value: string;
  onChange: (v: string) => void;

  onClose: () => void;
  onSubmit: () => void | Promise<void>;

  loading?: boolean;
  error?: string;
};

export default function LedgerPasteModal({
  open,
  value,
  onChange,
  onClose,
  onSubmit,
  loading = false,
  error = '',
}: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  if (!open) return null;

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sheetRef.current && sheetRef.current.contains(e.target as Node)) return;
    onClose();
  };

  const disabled = loading || value.trim().length === 0;

  /** textarea 높이 자동 조절 */
  const handleChange = (v: string) => {
    onChange(v);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60]"
      onMouseDown={handleBackdropMouseDown}
    >
      {/* dim */}
      <div className="absolute inset-0 bg-black/25" />

      {/* bottom sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-[color:var(--color-white-800)] rounded-tl-[30px] rounded-tr-[30px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] overflow-hidden"
      >
        {/* handle */}
        <div className="w-full flex justify-center pt-[17px]">
          <div className="w-11 h-1 bg-[color:var(--color-gray-200)] rounded-[2px]" />
        </div>

        {/* title */}
        <div className="w-full px-6 pt-[17px] flex justify-center items-center">
          <div className="flex-1 text-center text-[color:var(--color-gray-800)] text-2xl font-bold leading-9">
            문자 붙여넣기
          </div>
        </div>

        {/* input */}
        <div className="w-full pt-[24px] flex flex-col items-center gap-2">
          <div className="w-80 px-4 py-2 bg-[color:var(--color-white-800)] rounded-[10px] outline outline-[1.5px] outline-offset-[-1.5px] outline-[color:var(--color-gray-400)]">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="문자를 붙여넣으세요"
              rows={1}
              className="
                w-full
                bg-transparent
                outline-none
                resize-none
                text-[color:var(--color-gray-800)]
                text-base
                font-medium
                leading-6
                tracking-tight
                placeholder:text-[color:var(--color-gray-400)]
              "
            />
          </div>

          {error ? (
            <div className="w-80 text-sm text-[color:var(--color-error)] leading-5">{error}</div>
          ) : null}

          {/* button (피그마 투 코드 반영) */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled}
            className={[
              'w-80 h-14 px-4 py-2 rounded-[10px] inline-flex justify-center items-center gap-2.5',
              disabled
                ? 'bg-[color:var(--color-gray-300)]'
                : 'bg-[color:var(--color-main-skyblue)]',
            ].join(' ')}
          >
            <div className="flex-1 self-stretch text-center text-[color:var(--color-white-800)] text-base font-bold leading-10 tracking-tight">
              붙여넣기
            </div>
          </button>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
