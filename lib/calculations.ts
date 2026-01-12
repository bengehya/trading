import { Challenge, Trade } from '@/types';

export function calculateDailyTarget(
  initialCapital: number,
  dailyTargetPercent: number,
  currentDay: number
): number {
  return initialCapital * Math.pow(1 + dailyTargetPercent / 100, currentDay);
}

export function calculateTheoreticalCapital(
  initialCapital: number,
  dailyTargetPercent: number,
  currentDay: number
): number {
  return initialCapital * Math.pow(1 + dailyTargetPercent / 100, currentDay);
}

export function calculateMaxRiskPerTrade(
  currentCapital: number,
  riskPercent: number
): number {
  return (currentCapital * riskPercent) / 100;
}

export function calculateDrawdown(
  peakCapital: number,
  currentCapital: number
): number {
  return ((peakCapital - currentCapital) / peakCapital) * 100;
}

export function calculateProgressPercent(
  startCapital: number,
  currentCapital: number,
  targetCapital: number
): number {
  const progress = ((currentCapital - startCapital) / (targetCapital - startCapital)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export function getAdviceMessage(
  challenge: Challenge,
  todayTrades: Trade[],
  rules: { maxTradesPerDay: number; maxConsecutiveLosses: number }
): { status: 'on-track' | 'warning' | 'blocked'; message: string } {
  const theoreticalCapital = calculateTheoreticalCapital(
    challenge.initialCapital,
    challenge.dailyTargetPercent,
    challenge.currentDay
  );
  
  const todayTarget = calculateDailyTarget(
    challenge.initialCapital,
    challenge.dailyTargetPercent,
    challenge.currentDay
  );

  // Vérifier si l'objectif est atteint
  if (challenge.currentCapital >= todayTarget) {
    return {
      status: 'blocked',
      message: '🎯 Objectif atteint ! Arrête pour aujourd\'hui et profite de ta victoire ✅'
    };
  }

  // Vérifier le nombre de trades
  if (todayTrades.length >= rules.maxTradesPerDay) {
    return {
      status: 'blocked',
      message: '🛑 Limite de trades atteinte ! Repose-toi et reviens demain'
    };
  }

  // Vérifier les pertes consécutives
  const recentLosses = todayTrades
    .slice(-rules.maxConsecutiveLosses)
    .filter(t => t.resultAmount < 0).length;
  
  if (recentLosses >= rules.maxConsecutiveLosses) {
    return {
      status: 'blocked',
      message: '❌ Trop de pertes consécutives. STOP trading aujourd\'hui !'
    };
  }

  // Vérifier l'écart au plan
  const deviationPercent = ((challenge.currentCapital - theoreticalCapital) / theoreticalCapital) * 100;
  
  if (deviationPercent < -15) {
    return {
      status: 'warning',
      message: '⚠️ Tu t\'éloignes du plan théorique. Attention à la discipline !'
    };
  }

  // Avertissement sur le nombre de trades
  if (todayTrades.length >= rules.maxTradesPerDay - 1) {
    return {
      status: 'warning',
      message: `⚠️ Attention ! Tu as déjà pris ${todayTrades.length}/${rules.maxTradesPerDay} trades`
    };
  }

  // Tout va bien
  return {
    status: 'on-track',
    message: '✅ Tu es dans le plan ! Continue comme ça'
  };
}

export function calculateWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const wins = trades.filter(t => t.resultAmount > 0).length;
  return (wins / trades.length) * 100;
}

export function calculateProfitFactor(trades: Trade[]): number {
  const profits = trades.filter(t => t.resultAmount > 0).reduce((sum, t) => sum + t.resultAmount, 0);
  const losses = Math.abs(trades.filter(t => t.resultAmount < 0).reduce((sum, t) => sum + t.resultAmount, 0));
  return losses === 0 ? profits : profits / losses;
}
