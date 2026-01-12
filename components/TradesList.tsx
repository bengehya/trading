'use client';

import { Trade } from '@/types';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface TradesListProps {
  trades: Trade[];
}

export default function TradesList({ trades }: TradesListProps) {
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const emotionEmojis = {
    calm: '😌',
    stressed: '😰',
    revenge: '😤',
    tired: '😴',
    overconfident: '🤑',
    satisfied: '✅',
    frustrated: '😓',
    serene: '😊',
    relieved: '😮‍💨'
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">📝 Journal de Trading</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Date</th>
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Instrument</th>
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Direction</th>
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Setup</th>
              <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">Résultat</th>
              <th className="text-center py-3 px-4 text-text-secondary font-medium text-sm">État</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrades.map((trade) => (
              <tr 
                key={trade.id} 
                className="border-b border-dark-border hover:bg-[#1F2937] transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm">{formatDate(trade.date)}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium">{trade.instrument}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {trade.direction === 'buy' ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-danger" />
                    )}
                    <span className={`text-sm font-medium ${
                      trade.direction === 'buy' ? 'text-success' : 'text-danger'
                    }`}>
                      {trade.direction === 'buy' ? 'BUY' : 'SELL'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm bg-[#1F2937] px-3 py-1 rounded-full">
                    {trade.setupType}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div>
                    <p className={`text-sm font-bold ${
                      trade.resultAmount >= 0 ? 'text-success' : 'text-danger'
                    }`}>
                      {trade.resultAmount >= 0 ? '+' : ''}{trade.resultAmount.toFixed(2)}$
                    </p>
                    <p className={`text-xs ${
                      trade.resultPercent >= 0 ? 'text-success' : 'text-danger'
                    }`}>
                      ({trade.resultPercent >= 0 ? '+' : ''}{trade.resultPercent.toFixed(1)}%)
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-2xl" title={trade.emotionalStateBefore}>
                    {emotionEmojis[trade.emotionalStateBefore]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedTrades.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          <p>Aucun trade enregistré pour le moment</p>
          <p className="text-sm mt-2">Commence à enregistrer tes trades pour suivre ta progression</p>
        </div>
      )}
    </div>
  );
}
