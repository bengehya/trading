export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  userId: string;
  name: string;
  initialCapital: number;
  targetCapital: number;
  dailyTargetPercent: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'abandoned';
  currentCapital: number;
  currentDay: number;
}

export interface Trade {
  id: string;
  challengeId: string;
  userId: string;
  date: string;
  instrument: string;
  direction: 'buy' | 'sell';
  lotSize: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  exitPrice?: number;
  resultAmount: number;
  resultPercent: number;
  setupType: string;
  reason: string;
  emotionalStateBefore: EmotionalState;
  emotionalStateAfter?: EmotionalState;
}

export type EmotionalState = 
  | 'calm' 
  | 'stressed' 
  | 'revenge' 
  | 'tired' 
  | 'overconfident' 
  | 'satisfied' 
  | 'frustrated' 
  | 'serene' 
  | 'relieved';

export interface DailySummary {
  date: string;
  startingCapital: number;
  endingCapital: number;
  targetCapital: number;
  numberOfTrades: number;
  profitLoss: number;
  objectiveReached: boolean;
  notes?: string;
}

export interface RulesSettings {
  maxTradesPerDay: number;
  maxDrawdownPercent: number;
  maxRiskPerTradePercent: number;
  stopIfObjectiveReached: boolean;
  maxConsecutiveLosses: number;
}

export interface DashboardData {
  currentCapital: number;
  todayTarget: number;
  progressPercent: number;
  daysRemaining: number;
  tradesToday: number;
  maxTrades: number;
  status: 'on-track' | 'warning' | 'blocked';
  message: string;
  theoreticalCapital: number;
}
