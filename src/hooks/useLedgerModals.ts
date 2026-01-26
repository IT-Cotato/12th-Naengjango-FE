// hooks/useLedgerModals.ts
import { useState } from 'react';
import type { ParsedLedgerData } from '@/types/ledger';
import type { ParseLedgerResponse } from '@/apis/ledger/types';

type Params = {
  onCloseFab: () => void;
  parseLedgerText: (text: string) => Promise<ParseLedgerResponse>;
};

export default function useLedgerModals({ onCloseFab, parseLedgerText }: Params) {
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const [isParsedOpen, setIsParsedOpen] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedLedgerData | null>(null);

  const [isParsing, setIsParsing] = useState(false);
  const [pasteError, setPasteError] = useState('');

  const onPaste = () => {
    onCloseFab();
    setPasteText('');
    setPasteError('');
    setIsPasteOpen(true);
  };

  const onClosePaste = () => setIsPasteOpen(false);

  const onSubmitPaste = async () => {
    const text = pasteText.trim();
    if (!text || isParsing) return;

    setIsParsing(true);
    setPasteError('');

    try {
      const parsed: ParseLedgerResponse = await parseLedgerText(text);

      // ✅ 여기서만 memo 결합
      const completed: ParsedLedgerData = {
        ...parsed,
        memo: text,
      };

      setIsPasteOpen(false);
      setParsedData(completed);
      setIsParsedOpen(true);
    } catch (e) {
      setPasteError(e instanceof Error ? e.message : '분석 실패');
    } finally {
      setIsParsing(false);
    }
  };

  const onCloseParsed = () => {
    setIsParsedOpen(false);
    setParsedData(null);
  };

  return {
    isPasteOpen,
    setIsPasteOpen,
    pasteText,
    setPasteText,

    isParsedOpen,
    parsedData,
    setParsedData,

    isParsing,
    pasteError,

    onPaste,
    onClosePaste,
    onSubmitPaste,
    onCloseParsed,
  };
}
