import { useNavigate } from 'react-router-dom';
import { errorpage, back } from '@/assets';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <header className="flex h-18 items-center px-6 pt-4 shrink-0">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img src={back} alt="뒤로가기" className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <img src={errorpage} alt="" className="w-[231px] h-[231px] shrink-0" aria-hidden />
        <p className="Bold_18 text-accent-darkblue text-center mt-4 leading-[150%]">
          에러가 발생했습니다.
        </p>
        <p className="SemiBold_15 text-gray-800 text-center leading-[150%]">
          잠시 후 다시 시도해 주십시오.
        </p>
      </main>
    </div>
  );
}
