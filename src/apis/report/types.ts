// --- Request Types ---

// 냉동 절약 효과 리포트 조회 요청
export interface GetReportRequest {
  period: string;
}

// --- Response Types ---

// 공통 API 응답 타입
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code?: string;
  message?: string;
  result?: T;
}

// 냉동 절약 효과 리포트 (월별,주별 성공 추이)
export interface SuccessTrendItem {
  label: string;
  successRate: number;
}

// 냉동 절약 효과 리포트 (요일별 성공률)
export type SuccessRateByDay = Record<string, number>;

// 냉동 절약 효과 리포트 (최고 절약 시간대)
export interface BestSavingTime {
  day: string;
  timeSlot: string;
  successRate: number;
}

// 냉동 절약 효과 리포트 조회 응답 결과
export interface GetReportResult {
  totalSavedAmount: number;
  /** 지난 주/달 대비 절약 금액 차이 (양수: 더 지킴, 음수: 못 지킴) */
  diffFromLastWeek?: number;
  /** API에서 period 구분 없이 내려주는 경우 */
  diffFromLastPeriod?: number;
  totalFailedAmount: number;
  /** 지난 주/달 대비 실패 금액 차이 (못 지킨 금액) */
  diffFailedFromLastPeriod?: number;
  successTrends: SuccessTrendItem[];
  successRateByDay: SuccessRateByDay;
  bestSavingTime: BestSavingTime;
}

// 냉동 절약 효과 리포트 조회 응답
export interface GetReportResponse extends ApiResponse<GetReportResult> {}

// 하루 가용 예산 조회
export interface DailyTrendItem {
  date: string;
  amount: number;
}

// 파산 시나리오 조회
export interface BankruptcyPredictionItem {
  baseDate: string;
  expectedDate: string;
}

// 하루 가용 예산 조회 및 파산 시나리오 조회 응답 결과
export interface GetDailyBudgetResult {
  todayAvailable: number;
  diffFromYesterday: number;
  dailyTrends: DailyTrendItem[];
  bankruptcyPrediction: BankruptcyPredictionItem[];
}

// 하루 가용 예산 조회 및 파산 시나리오 조회 응답
export interface GetDailyBudgetResponse extends ApiResponse<GetDailyBudgetResult> {}
