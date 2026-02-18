export interface GetHomeDataResponse {
  result: {
    dailyTrends: Array<{
      date: string;
      amount: number;
    }>;
    bankruptcyPrediction: Array<{
      baseDate: string;
      expectedDate: string;
    }>;
  };
}

export interface GetBudgetDataResponse {
  result: {
    todayRemaining: number;
  };
}

export interface GetSnowballDataResponse {
  result: {
    totalSnowballs: number;
    todayEarned: number;
  };
}

export interface GetNotificationDataResponse {
  result: {
    unreadCount: number;
  };
}

export interface GetIglooStatusDataResponse {
  result: {
    requiredSnowballsForNextLevel: number;
    iglooLevel: number;
    freezeFailCount: number;
  };
}

export interface PostIglooUpgradeResponse {
  result: {
    afterLevel: number;
    snowballBalanceAfter: number;
  };
}

export interface PostIglooDowngradeResponse {
  result: {
    snowballBalance: number;
    freezeFailCount: number;
  };
}

export interface PostSnowballLossResponse {
  result: {
    snowballBalance: number;
    freezeFailCount: number;
  };
}
