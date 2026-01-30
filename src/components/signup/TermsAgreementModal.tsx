import { useState, useMemo } from 'react';
import { go, before_agree, after_agree } from '@/assets';
import Button from '@/components/common/Button';
import TermsDetailModal from './TermsDetailModal';

export type TermType = 'all' | 'terms' | 'privacy' | 'sms';

export interface Term {
  id: TermType;
  label: string;
  required: boolean;
  content: string; // 상세 화면에 표시할 내용
}

interface TermsAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  terms: Term[];
}

const TermsAgreementModal: React.FC<TermsAgreementModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  terms,
}) => {
  const [checkedTerms, setCheckedTerms] = useState<Set<TermType>>(new Set());
  const [detailTermId, setDetailTermId] = useState<TermType | null>(null);

  // 필수 약관만 추출
  const requiredTerms = useMemo(
    () => terms.filter((term) => term.required && term.id !== 'all'),
    [terms],
  );

  // 모든 약관 (전체 동의용)
  const allTerms = useMemo(
    () => terms.filter((term) => term.id !== 'all'),
    [terms],
  );

  // 전체 동의 체크 여부
  const isAllChecked = useMemo(() => {
    return allTerms.every((term) => checkedTerms.has(term.id));
  }, [allTerms, checkedTerms]);

  // 확인 버튼 활성화 여부 (필수 약관 모두 체크)
  const canConfirm = useMemo(() => {
    return requiredTerms.every((term) => checkedTerms.has(term.id));
  }, [requiredTerms, checkedTerms]);

  // 전체 동의 토글
  const handleToggleAll = () => {
    if (isAllChecked) {
      // 전체 해제
      setCheckedTerms(new Set());
    } else {
      // 모든 약관 전체 체크
      setCheckedTerms(new Set(allTerms.map((term) => term.id)));
    }
  };

  // 개별 약관 토글
  const handleToggleTerm = (termId: TermType) => {
    if (termId === 'all') {
      handleToggleAll();
      return;
    }

    const newChecked = new Set(checkedTerms);
    if (newChecked.has(termId)) {
      newChecked.delete(termId);
    } else {
      newChecked.add(termId);
    }
    setCheckedTerms(newChecked);
  };

  const handleOpenDetail = (termId: TermType) => {
    setDetailTermId(termId);
  };

  const handleAgreeFromDetail = (termId: TermType) => {
    const newChecked = new Set(checkedTerms);
    newChecked.add(termId);
    setCheckedTerms(newChecked);
    setDetailTermId(null);
  };

  if (!isOpen) return null;

  const detailTerm = detailTermId ? terms.find((t) => t.id === detailTermId) : null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-gray-800/30"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[390px] rounded-t-[20px] bg-white pb-6 pt-5"
          onClick={(e) => e.stopPropagation()}
        >

          {/* 약관 리스트 */}
          <div className="px-5 space-y-4">
            {/* 전체 동의 */}
            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-3 flex-1 cursor-pointer">
                <button
                  type="button"
                  onClick={handleToggleAll}
                  className="flex items-center justify-center"
                >
                  <img
                    src={isAllChecked ? after_agree : before_agree}
                    alt={isAllChecked ? '체크됨' : '체크 안됨'}
                    className="w-6 h-6"
                  />
                </button>
                <span className="SemiBold_14 text-gray-800">약관 전체 동의</span>
              </label>
            </div>

            {/* 개별 약관 */}
            {terms
              .filter((term) => term.id !== 'all')
              .map((term) => {
                const isChecked = checkedTerms.has(term.id);
                return (
                  <div key={term.id} className="flex items-center justify-between py-2">
                    <label className="flex items-center gap-3 flex-1 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => handleToggleTerm(term.id)}
                        className="flex items-center justify-center"
                      >
                        <img
                          src={isChecked ? after_agree : before_agree}
                          alt={isChecked ? '체크됨' : '체크 안됨'}
                          className="w-6 h-6"
                        />
                      </button>
                      <span className="SemiBold_15 text-gray-800">
                        {term.label}
                        {term.required ? (
                          <span className="SemiBold_15 text-gray-800"> (필수)</span>
                        ) : (
                          <span className="SemiBold_15 text-gray-800"> (선택)</span>
                        )}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(term.id)}
                      className="ml-2 p-1"
                    >
                      <img src={go} alt="상세보기" className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
          </div>

          <div className="px-5 mt-8">
            <Button disabled={!canConfirm} onClick={onConfirm}>
              확인
            </Button>
          </div>
        </div>
      </div>

      {/* 약관 상세 모달 */}
      {detailTerm && (
        <TermsDetailModal
          isOpen={detailTermId !== null}
          term={detailTerm}
          onClose={() => setDetailTermId(null)}
          onAgree={() => handleAgreeFromDetail(detailTerm.id)}
        />
      )}
    </>
  );
};

export default TermsAgreementModal;
