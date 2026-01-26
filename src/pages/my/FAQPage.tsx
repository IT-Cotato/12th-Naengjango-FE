import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { close } from '@/assets';
import FAQModal from '@/components/common/FAQModal';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: '자주 묻는 질문1?',
    answer: '답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다.',
  },
  {
    id: '2',
    question: '자주 묻는 질문2?',
    answer: '답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다.',
  },
  {
    id: '3',
    question: '자주 묻는 질문3?',
    answer: '답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다.',
  },
  {
    id: '4',
    question: '자주 묻는 질문4?',
    answer: '답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다.',
  },
  {
    id: '5',
    question: '자주 묻는 질문5?',
    answer: '답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다.',
  },
  {
    id: '6',
    question: '자주 묻는 질문6?',
    answer: '답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다.',
  },
  {
    id: '7',
    question: '자주 묻는 질문7?',
    answer: '답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다.',
  },
  {
    id: '8',
    question: '자주 묻는 질문8?',
    answer: '답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다.',
  },
  {
    id: '9',
    question: '자주 묻는 질문9?',
    answer: '답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다.',
  },
];

export default function FAQPage() {
  const navigate = useNavigate();
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleQuestionClick = (faq: FAQItem) => {
    setSelectedFAQ(faq);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFAQ(null);
  };

  return (
    <div className="min-h-dvh bg-white">
      <header className="flex h-18 items-center justify-between px-6 pt-4 shrink-0 relative">
        <div className="w-6" />
        <h1 className="Bold_24 text-gray-800 absolute left-1/2 -translate-x-1/2">FAQ</h1>
        <button type="button" onClick={() => navigate('/my')}>
          <img src={close} alt="닫기" className="h-6 w-6" />
        </button>
      </header>
      <div className="px-6 pt-8 pb-24">
        {FAQ_DATA.map((faq) => (
          <button
            key={faq.id}
            type="button"
            onClick={() => handleQuestionClick(faq)}
            className="w-full h-[70px] flex items-center justify-between border-t border-white-400"
          >
            <span className="Medium_18 text-gray-800 ">
              <span className="Medium_20 text-main-skyblue mr-2">Q{faq.id}.</span> {faq.question}
            </span>
            <span className="Medium_20 text-gray-200">A.</span>
          </button>
        ))}
      </div>
      {selectedFAQ && (
        <FAQModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          questionNumber={selectedFAQ.id}
          question={selectedFAQ.question}
          answer={selectedFAQ.answer}
        />
      )}
    </div>
  );
}
