export type ParseLedgerResponse = {
  type: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

export async function parseLedgerText(rawText: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/parser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText }),
  });

  // swagger가 */* 로 되어 있어서 json/text 둘 다 대응
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    // 서버가 에러를 string으로 내려주는 케이스 대비
    const msg = typeof data === 'string' ? data : '분석 요청 실패';
    throw new Error(msg);
  }

  // 1) 서버가 JSON 객체를 준다
  if (typeof data === 'object') return data as ParseLedgerResponse;

  // 2) 서버가 JSON 문자열을 text/plain으로 준다 → 파싱 시도
  try {
    return JSON.parse(data) as ParseLedgerResponse;
  } catch {
    throw new Error(data || '응답 형식이 올바르지 않습니다.');
  }
}
