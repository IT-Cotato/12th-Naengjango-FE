import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { close } from '@/assets';
import Button from '@/components/common/Button';

export default function InquiryPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const name = '냉잔고';

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    // api 연결 - 저장 버튼 클릭 시 호출 (나중에)
    console.log('문의하기:', { title, content });
    // 성공 시 마이페이지로 (state로 완료 상태 전달)
    navigate('/my', { state: { inquiryCompleted: true } });
  };

  return (
    <div className="min-h-dvh bg-white">
      <header className="flex h-18 items-center justify-between px-6 pt-4 shrink-0 relative">
        <div className="w-6" />
        <h1 className="Bold_24 text-gray-800 absolute left-1/2 -translate-x-1/2">문의하기</h1>
        <button type="button" onClick={() => navigate('/my')}>
          <img src={close} alt="닫기" className="h-6 w-6" />
        </button>
      </header>
      <div className="px-6 pt-8">
        <p className="SemiBold_20 text-gray-800">{name}님</p>
      </div>
      <div className="px-6 pt-1 pb-24">
        <div className="mb-4">
          <input
            type="text"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 border border-gray-200 rounded-[10px] px-4 text-base text-gray-800 placeholder:text-gray-200 outline-none"
          />
        </div>
        <div className="mb-6">
          <textarea
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[479px] rounded-[10px] border border-gray-200 px-4 py-3 text-base text-gray-800 placeholder:text-gray-200 outline-none resize-none"
          />
        </div>
        <Button disabled={!canSubmit} onClick={handleSubmit}>
          문의하기
        </Button>
      </div>
    </div>
  );
}
