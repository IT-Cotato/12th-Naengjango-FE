import { blueManual, bluePaste } from '@/assets';

type Props = {
  onPaste: () => void;
  onManual: () => void;
};

export default function LedgerActionSheet({ onPaste, onManual }: Props) {
  return (
    <div
      className="
        px-4 py-3
        bg-[color:var(--color-sub-skyblue)]
        rounded-lg
        shadow-[0px_0px_10px_0px_rgba(94,151,215,1.00)]
        inline-flex flex-col
        gap-2.5
      "
    >
      <div className="w-32 flex flex-col gap-3.5">
        {/* 문자 붙여넣기 */}
        <button
          type="button"
          onClick={onPaste}
          className="w-full inline-flex items-center justify-center gap-1"
        >
          <div className="w-6 flex justify-center">
            <img src={bluePaste} alt="문자 붙여넣기" />
          </div>

          <span className="text-[color:var(--color-main-skyblue)] text-base leading-6 tracking-tight">
            문자 붙여넣기
          </span>
        </button>

        {/* 수동 입력하기 */}
        <button
          type="button"
          onClick={onManual}
          className="w-full inline-flex items-center justify-center gap-1"
        >
          <div className="w-6 flex justify-center">
            <img src={blueManual} alt="수동 입력하기" />
          </div>

          <span className="text-[color:var(--color-main-skyblue)] text-base leading-6 tracking-tight">
            수동 입력하기
          </span>
        </button>
      </div>
    </div>
  );
}
