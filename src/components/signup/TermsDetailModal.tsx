import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { back, close } from '@/assets';
import Button from '@/components/common/Button';
import type { Term } from './TermsAgreementModal';

interface TermsDetailModalProps {
  isOpen: boolean;
  term: Term;
  onClose: () => void;
  onAgree: () => void;
}

const TermsDetailModal: React.FC<TermsDetailModalProps> = ({ isOpen, term, onClose, onAgree }) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const handleScroll = () => {
      const element = contentRef.current;
      if (!element) return;

      const { scrollTop, scrollHeight, clientHeight } = element;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px 여유
      setIsScrolledToBottom(isAtBottom);
    };

    const element = contentRef.current;
    element.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 체크

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-4 ">
        <button type="button" onClick={onClose} className="p-1">
          <img src={back} alt="뒤로" className="w-6 h-6" />
        </button>
        <h2 className="Bold_24 text-gray-800">{term.label}</h2>
        <button type="button" onClick={onClose} className="p-1">
          <img src={close} alt="닫기" className="w-6 h-6" />
        </button>
      </div>

      {/* 내용 */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-5 py-6"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
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
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="ml-2">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              hr: () => <hr className="my-4 border-gray-300" />,
            }}
          >
            {term.content || `${term.label} 설명`}
          </ReactMarkdown>
        </div>
      </div>

      <div className="px-5 pb-6 pt-3">
        <Button disabled={!isScrolledToBottom} onClick={onAgree}>
          동의하기
        </Button>
      </div>
    </div>
  );
};

export default TermsDetailModal;
