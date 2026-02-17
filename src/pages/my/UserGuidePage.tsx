import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { back } from '@/assets';
import { USER_GUIDE_MD } from '@/constants/docs';

export default function UserGuidePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <header className="flex h-18 items-center justify-between px-6 pt-4 shrink-0">
        <button type="button" onClick={() => navigate(-1)}>
          <img src={back} alt="뒤로가기" className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
        <div className="Regular_15 text-gray-800 leading-relaxed prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="Bold_20 text-gray-800 mb-4 mt-6 first:mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="Bold_18 text-gray-800 mb-3 mt-5 first:mt-0">{children}</h2>
              ),
              p: ({ children }) => <p className="mb-3">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
              ),
              li: ({ children }) => <li className="ml-2">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              hr: () => <hr className="my-4 border-gray-300" />,
            }}
          >
            {USER_GUIDE_MD}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
