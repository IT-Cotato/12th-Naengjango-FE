import { useState } from 'react';
import type { ParsedLedgerData } from '@/types/ledger';

type Params = {
  parseLedgerText: (text: string) => Promise<ParsedLedgerData>;
  onCloseFab: () => void;
};

export default function usePasteModal({ parseLedgerText, onCloseFab }: Params) {
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
    setParsedData(null);
    setIsParsedOpen(false);
    setIsPasteOpen(true);
  };

  const onClosePaste = () => setIsPasteOpen(false);

  const onSubmitPaste = async () => {
    const text = pasteText.trim();
    if (!text || isParsing) return;

    setPasteError('');
    setIsParsing(true);

    try {
      // ✅ 이미 ParsedLedgerData
      const parsed = await parseLedgerText(text);

      setIsPasteOpen(false);
      setParsedData(parsed);
      setIsParsedOpen(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '분석 실패';
      setPasteError(msg);
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
    setIsParsedOpen,
    parsedData,
    setParsedData,

    isParsing,
    setIsParsing,
    pasteError,
    setPasteError,

    onPaste,
    onClosePaste,
    onSubmitPaste,
    onCloseParsed,
  };
}
