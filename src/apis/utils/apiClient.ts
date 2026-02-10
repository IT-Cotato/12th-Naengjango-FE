const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 공통 fetch 및 응답 처리 
async function fetchAndParseResponse<T>(
  res: Response,
  defaultErrorMessage: string
): Promise<T> {
  let responseData: any;
  try {
    const text = await res.text();
    responseData = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error('서버 응답을 파싱할 수 없습니다.');
  }

  if (!res.ok || !responseData.isSuccess) {
    const message = responseData.message || defaultErrorMessage;
    throw new Error(message);
  }

  return responseData as T;
}

// 공통 post json 요청 함수
export async function postJson<T>(url: string, data: unknown, defaultErrorMessage: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return fetchAndParseResponse<T>(res, defaultErrorMessage);
}

// 인증이 필요한 post json 요청 함수
export async function postJsonWithAuth<T>(
  url: string,
  data: unknown,
  defaultErrorMessage: string,
  accessToken: string
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return fetchAndParseResponse<T>(res, defaultErrorMessage);
}
