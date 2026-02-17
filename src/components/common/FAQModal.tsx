import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  questionNumber: string;
  question: string;
  // 마크다운 지원 답변
  answer: string;
};

export default function FAQModal({ isOpen, onClose, questionNumber, question, answer }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30" onClick={onClose}>
      <div
        className="w-full max-h-[287px] rounded-t-[30px] bg-white-800 p-6 overflow-y-auto"
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
          <div className="Medium_20 text-gray-200 mb-2">A.</div>
          <div className="Medium_16 text-gray-800 leading-relaxed prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="ml-2">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                table: ({ children }) => (
                  <table className="w-full text-left border-collapse border border-gray-200 my-3 text-[13px]">
                    {children}
                  </table>
                ),
                thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr className="border-t border-gray-200">{children}</tr>,
                th: ({ children }) => (
                  <th className="px-2 py-1 font-semibold text-gray-800 border-r border-gray-200 last:border-r-0">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-2 py-1 text-gray-700 border-r border-gray-200 last:border-r-0">
                    {children}
                  </td>
                ),
                br: () => <br />,
              }}
            >
              {answer}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
