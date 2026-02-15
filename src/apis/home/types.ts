export interface GetHomeDataResponse {
  result: {
    diffFromYesterday: number;
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
