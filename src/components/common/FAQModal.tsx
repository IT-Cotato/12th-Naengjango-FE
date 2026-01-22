type Props = {
  isOpen: boolean;
  onClose: () => void;
  questionNumber: string;
  question: string;
  answer: string;
};

export default function FAQModal({ isOpen, onClose, questionNumber, question, answer }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30" onClick={onClose}>
      <div
        className="w-full h-[287px] rounded-t-[30px] bg-white-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <div className="w-11 h-1 rounded-full bg-gray-200" />
        </div>
        <p className="text-start text-[15px] font-medium mb-5">
          <span className="Medium_20 text-main-skyblue mr-2">Q{questionNumber}.</span>{' '}
          <span className="Medium_20 text-[#000000]">{question}</span>
        </p>
        <div className="mb-18">
          <div className="Medium_20 text-gray-200 whitespace-pre-line ">A.<span className="Medium_18 text-gray-800 ml-2">{answer}</span></div>
        </div>
      </div>
    </div>
  );
}
