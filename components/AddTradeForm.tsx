'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface AddTradeFormProps {
  challengeId: string;
  userId: string;
  currentCapital: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function AddTradeForm({ 
  challengeId, 
  userId, 
  currentCapital,
  onSuccess, 
  onClose 
}: AddTradeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // État du formulaire
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    instrument: 'Volatility 75',
    direction: 'buy',
    lotSize: '0.5',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    exitPrice: '',
    setupType: 'Order Block',
    reason: '',
    emotionalStateBefore: 'calm',
    emotionalStateAfter: 'satisfied',
  });

  const instruments = [
    'Volatility 75',
    'Volatility 100',
    'US30',
    'NAS100',
    'EUR/USD',
    'GBP/USD',
    'XAU/USD (Gold)',
    'BTC/USD',
  ];

  const setupTypes = [
    'Order Block',
    'FVG (Fair Value Gap)',
    'BOS (Break of Structure)',
    'Liquidity Sweep',
    'Supply Zone',
    'Demand Zone',
    'Trend Following',
    'Reversal',
    'Autre',
  ];

  const emotionalStates = [
    { value: 'calm', label: '😌 Calme' },
    { value: 'stressed', label: '😰 Stressé' },
    { value: 'revenge', label: '😤 Revanchard' },
    { value: 'tired', label: '😴 Fatigué' },
    { value: 'overconfident', label: '🤑 Trop confiant' },
    { value: 'satisfied', label: '✅ Satisfait' },
    { value: 'frustrated', label: '😓 Frustré' },
    { value: 'serene', label: '😊 Serein' },
    { value: 'relieved', label: '😮‍💨 Soulagé' },
  ];

  // Calculer automatiquement le résultat
  const calculateResult = () => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const lot = parseFloat(formData.lotSize);

    if (!entry || !exit || !lot) return { amount: 0, percent: 0 };

    const priceDiff = formData.direction === 'buy' ? exit - entry : entry - exit;
    const resultAmount = (priceDiff / entry) * (entry * lot);
    const resultPercent = (resultAmount / currentCapital) * 100;

    return {
      amount: parseFloat(resultAmount.toFixed(2)),
      percent: parseFloat(resultPercent.toFixed(2)),
    };
  };

  const result = calculateResult();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Insérer le trade
      const { error: tradeError } = await supabase.from('trades').insert({
        challenge_id: challengeId,
        user_id: userId,
        date: new Date(formData.date).toISOString(),
        instrument: formData.instrument,
        direction: formData.direction,
        lot_size: parseFloat(formData.lotSize),
        entry_price: parseFloat(formData.entryPrice),
        stop_loss: parseFloat(formData.stopLoss),
        take_profit: parseFloat(formData.takeProfit),
        exit_price: parseFloat(formData.exitPrice),
        result_amount: result.amount,
        result_percent: result.percent,
        setup_type: formData.setupType,
        reason: formData.reason,
        emotional_state_before: formData.emotionalStateBefore,
        emotional_state_after: formData.emotionalStateAfter,
      });

      if (tradeError) throw tradeError;

      // Mettre à jour le capital du challenge
      const newCapital = currentCapital + result.amount;
      const { error: challengeError } = await supabase
        .from('challenges')
        .update({ current_capital: newCapital })
        .eq('id', challengeId);

      if (challengeError) throw challengeError;

      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'ajout du trade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📝 Enregistrer un Trade</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date et Heure */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              📅 Date et Heure
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input"
              required
            />
          </div>

          {/* Instrument et Direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                🏷️ Instrument
              </label>
              <select
                value={formData.instrument}
                onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                className="input"
                required
              >
                {instruments.map((inst) => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                📊 Direction
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, direction: 'buy' })}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    formData.direction === 'buy'
                      ? 'bg-success text-white'
                      : 'bg-dark-bg text-text-secondary hover:bg-dark-border'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, direction: 'sell' })}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    formData.direction === 'sell'
                      ? 'bg-danger text-white'
                      : 'bg-dark-bg text-text-secondary hover:bg-dark-border'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  SELL
                </button>
              </div>
            </div>
          </div>

          {/* Prix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                Lot
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.lotSize}
                onChange={(e) => setFormData({ ...formData, lotSize: e.target.value })}
                className="input"
                placeholder="0.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                Entrée
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                className="input"
                placeholder="12500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                Stop Loss
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                className="input"
                placeholder="12400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                Take Profit
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.takeProfit}
                onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
                className="input"
                placeholder="12700"
                required
              />
            </div>
          </div>

          {/* Prix de sortie */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              💰 Prix de Sortie (Réel)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.exitPrice}
              onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
              className="input"
              placeholder="12700"
              required
            />
          </div>

          {/* Résultat calculé */}
          {formData.exitPrice && (
            <div className={`p-4 rounded-lg ${result.amount >= 0 ? 'bg-success/10 border border-success' : 'bg-danger/10 border border-danger'}`}>
              <p className="text-sm text-text-secondary mb-1">Résultat du trade :</p>
              <p className={`text-2xl font-bold ${result.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                {result.amount >= 0 ? '+' : ''}{result.amount}$ ({result.percent >= 0 ? '+' : ''}{result.percent}%)
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Nouveau capital : {(currentCapital + result.amount).toFixed(2)}$
              </p>
            </div>
          )}

          {/* Setup et Raison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                🎯 Setup
              </label>
              <select
                value={formData.setupType}
                onChange={(e) => setFormData({ ...formData, setupType: e.target.value })}
                className="input"
                required
              >
                {setupTypes.map((setup) => (
                  <option key={setup} value={setup}>{setup}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              💭 Raison du Trade
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="input min-h-[80px]"
              placeholder="OB clean avec BOS confirmé, confluence temporelle..."
            />
          </div>

          {/* États émotionnels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                😊 État AVANT le trade
              </label>
              <select
                value={formData.emotionalStateBefore}
                onChange={(e) => setFormData({ ...formData, emotionalStateBefore: e.target.value })}
                className="input"
                required
              >
                {emotionalStates.map((state) => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                🎭 État APRÈS le trade
              </label>
              <select
                value={formData.emotionalStateAfter}
                onChange={(e) => setFormData({ ...formData, emotionalStateAfter: e.target.value })}
                className="input"
              >
                {emotionalStates.map((state) => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : '✅ Enregistrer le Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
