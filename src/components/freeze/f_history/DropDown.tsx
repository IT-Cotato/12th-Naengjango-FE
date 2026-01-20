import { useState } from 'react';
import dropdown from '@/assets/icons/dropdown.svg';

export type SortOption = '최신순' | '가격순';

type DropDownProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export default function DropDown({ value, onChange }: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: SortOption[] = ['최신순', '가격순'];

  const sortedOptions = [value, ...options.filter((option) => option !== value)];

  return (
    <>
      {/* 활성화 전*/}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-[58px] h-[22px] pl-[7px] relative rounded-md outline outline-[0.5px] outline-gray-200
        inline-flex justify-center items-center cursor-pointer bg-white-800"
      >
        <div className="text-gray-400 Medium_12 font-sans leading-none tracking-tight">{value}</div>
        <img
          src={dropdown}
          alt="chevron"
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* 활성화 후 */}
      {isOpen && (
        <div className="absolute -top-1 right-0 w-[58px] mt-1 inline-flex flex-col z-10">
          {sortedOptions.map((option, index) => {
            const isCurrent = index === 0;

            return (
              <div
                key={option}
                onClick={() => {
                  if (!isCurrent) {
                    onChange(option);
                  }
                  setIsOpen(false);
                }}
                className={`
        pl-[7px] pr-[4px] py-0.5 bg-white-800
        outline outline-[0.5px] outline-gray-200
        inline-flex justify-between items-center cursor-pointer
        ${index === 0 ? 'rounded-t-md' : ''}
        ${index === sortedOptions.length - 1 ? 'rounded-b-md' : ''}
      `}
              >
                <div className="text-gray-400 Medium_12 font-sans leading-[18px] tracking-tight">
                  {option}
                </div>

                {/* 첫번째는 chevron 추가 */}
                {isCurrent && <img src={dropdown} alt="chevron" className="w-4 h-4 rotate-180" />}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
