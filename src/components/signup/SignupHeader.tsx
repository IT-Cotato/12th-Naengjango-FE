import { back } from '@/assets/index';
import { close } from '@/assets/index';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../common/AlertModal';

type Props = {
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
};

export default function SignupHeader({ onBack, showBack = true }: Props) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="flex h-18 items-center justify-between px-2">
      {showBack ? (
        <button type="button" onClick={handleBack}>
          <img src={back} alt="back" className="flex h-6 w-6 items-center justify-center" />
        </button>
      ) : (
        <div className="h-6 w-6" />
      )}
      <button type="button" onClick={() => setIsModalOpen(true)}>
        <img src={close} alt="close" className="flex h-6 w-6 items-center justify-center" />
      </button>
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="정말 회원가입을 포기하시겠습니까?"
        message={`거의 다 왔어요.\n조금만 더 입력하면 돼요!`}
        className="h-[157px]"
        buttonClassName="h-[47px]"
        twoButtons={{
          leftText: '취소',
          rightText: '가입 포기',
          onRight: handleModalClose,
        }}
      />
    </header>
  );
}
