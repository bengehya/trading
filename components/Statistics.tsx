'use client';

import { Trade } from '@/types';
import { calculateWinRate, calculateProfitFactor } from '@/lib/calculations';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface StatisticsProps {
  trades: Trade[];
}

export default function Statistics({ trades }: StatisticsProps) {
  const winRate = calculateWinRate(trades);
  const profitFactor = calculateProfitFactor(trades);
  
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.resultAmount > 0).length;
  const losingTrades = trades.filter(t => t.resultAmount < 0).length;
  
  const totalProfit = trades.reduce((sum, t) => sum + (t.resultAmount > 0 ? t.resultAmount : 0), 0);
  const totalLoss = trades.reduce((sum, t) => sum + (t.resultAmount < 0 ? t.resultAmount : 0), 0);
  
  const averageWin = winningTrades > 0 ? totalProfit / winningTrades : 0;
  const averageLoss = losingTrades > 0 ? totalLoss / losingTrades : 0;
  
  const bestTrade = trades.length > 0 
    ? trades.reduce((max, t) => t.resultAmount > max.resultAmount ? t : max, trades[0])
    : null;
  
  const worstTrade = trades.length > 0
    ? trades.reduce((min, t) => t.resultAmount < min.resultAmount ? t : min, trades[0])
    : null;

  // Statistiques par setup
  const setupStats = trades.reduce((acc, trade) => {
    if (!acc[trade.setupType]) {
      acc[trade.setupType] = { wins: 0, losses: 0, total: 0 };
    }
    acc[trade.setupType].total++;
    if (trade.resultAmount > 0) {
      acc[trade.setupType].wins++;
    } else {
      acc[trade.setupType].losses++;
    }
    return acc;
  }, {} as Record<string, { wins: number; losses: number; total: number }>);

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <span className="text-text-secondary text-sm">Win Rate</span>
          </div>
          <p className="text-3xl font-bold text-accent">{winRate.toFixed(1)}%</p>
          <p className="text-sm text-text-secondary mt-1">
            {winningTrades} gains / {losingTrades} pertes
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-success" />
            <span className="text-text-secondary text-sm">Profit Factor</span>
          </div>
          <p className="text-3xl font-bold text-success">{profitFactor.toFixed(2)}</p>
          <p className="text-sm text-text-secondary mt-1">
            {profitFactor >= 2 ? 'Excellent' : profitFactor >= 1.5 ? 'Bon' : 'À améliorer'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <span className="text-text-secondary text-sm">Total des gains</span>
          </div>
          <p className="text-3xl font-bold text-success">+${totalProfit.toFixed(2)}</p>
          <p className="text-sm text-text-secondary mt-1">
            Moy: ${averageWin.toFixed(2)}/trade
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-danger" />
            <span className="text-text-secondary text-sm">Total des pertes</span>
          </div>
          <p className="text-3xl font-bold text-danger">{totalLoss.toFixed(2)}$</p>
          <p className="text-sm text-text-secondary mt-1">
            Moy: ${averageLoss.toFixed(2)}/trade
          </p>
        </div>
      </div>

      {/* Meilleur et pire trade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bestTrade && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Meilleur Trade
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Instrument</span>
                <span className="font-semibold">{bestTrade.instrument}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Setup</span>
                <span className="font-semibold">{bestTrade.setupType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Résultat</span>
                <span className="font-bold text-success text-xl">+${bestTrade.resultAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {worstTrade && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-danger" />
              Pire Trade
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Instrument</span>
                <span className="font-semibold">{worstTrade.instrument}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Setup</span>
                <span className="font-semibold">{worstTrade.setupType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Résultat</span>
                <span className="font-bold text-danger text-xl">{worstTrade.resultAmount.toFixed(2)}$</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques par setup */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">📊 Performance par Setup</h3>
        <div className="space-y-3">
          {Object.entries(setupStats).map(([setup, stats]) => {
            const setupWinRate = (stats.wins / stats.total) * 100;
            return (
              <div key={setup} className="border border-dark-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{setup}</span>
                  <span className={`font-bold ${setupWinRate >= 50 ? 'text-success' : 'text-danger'}`}>
                    {setupWinRate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span>{stats.total} trades</span>
                  <span className="text-success">{stats.wins} gains</span>
                  <span className="text-danger">{stats.losses} pertes</span>
                </div>
                <div className="mt-2 w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success"
                    style={{ width: `${setupWinRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conseils basés sur les statistiques */}
      <div className="card bg-gradient-to-r from-accent/10 to-success/10 border-accent/30">
        <h3 className="text-xl font-semibold mb-4">💡 Analyses et Conseils</h3>
        <div className="space-y-3 text-sm">
          {winRate >= 60 && (
            <p className="flex items-start gap-2">
              <span className="text-success text-xl">✓</span>
              <span>Excellent win rate ! Continue à respecter ton plan de trading.</span>
            </p>
          )}
          {profitFactor >= 2 && (
            <p className="flex items-start gap-2">
              <span className="text-success text-xl">✓</span>
              <span>Très bon profit factor, tes gains compensent largement tes pertes.</span>
            </p>
          )}
          {averageWin > Math.abs(averageLoss) * 2 && (
            <p className="flex items-start gap-2">
              <span className="text-success text-xl">✓</span>
              <span>Excellent ratio gains/pertes. Tu laisses courir tes profits !</span>
            </p>
          )}
          {winRate < 50 && (
            <p className="flex items-start gap-2">
              <span className="text-accent text-xl">!</span>
              <span>Win rate à améliorer. Focus sur la qualité des setups plutôt que la quantité.</span>
            </p>
          )}
          {totalTrades < 10 && (
            <p className="flex items-start gap-2">
              <span className="text-accent text-xl">!</span>
              <span>Continue à trader pour avoir des statistiques plus significatives.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
