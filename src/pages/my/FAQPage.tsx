import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { close } from '@/assets';
import FAQModal from '@/components/common/FAQModal';
import { FAQ_ITEMS, type FAQItem } from '@/constants/faq';

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
        {FAQ_ITEMS.map((faq) => (
          <button
            key={faq.id}
            type="button"
            onClick={() => handleQuestionClick(faq)}
            className="w-full h-[70px] flex items-center justify-between border-t border-white-400"
          >
            <div className="flex items-center gap-2">
              <span className="Medium_20 text-main-skyblue text-left w-10 shrink-0">
                Q{faq.id}.
              </span>
              <span className="Medium_18 text-gray-800 text-left">
                {faq.question}
              </span>
            </div>
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
