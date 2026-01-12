'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Target } from 'lucide-react';

interface CreateChallengeFormProps {
  userId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function CreateChallengeForm({ userId, onSuccess, onClose }: CreateChallengeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: 'Challenge 30 jours vers 2300$',
    initialCapital: '100',
    dailyTargetPercent: '20',
    durationDays: '30',
  });

  const targetCapital = parseFloat(formData.initialCapital) * Math.pow(
    1 + parseFloat(formData.dailyTargetPercent) / 100,
    parseInt(formData.durationDays)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(formData.durationDays));

      const { error: challengeError } = await supabase.from('challenges').insert({
        user_id: userId,
        name: formData.name,
        initial_capital: parseFloat(formData.initialCapital),
        target_capital: targetCapital,
        daily_target_percent: parseFloat(formData.dailyTargetPercent),
        duration_days: parseInt(formData.durationDays),
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'active',
        current_capital: parseFloat(formData.initialCapital),
        current_day: 1,
      });

      if (challengeError) throw challengeError;

      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création du challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-accent" />
            Créer un Challenge
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              🎯 Nom du Challenge
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Challenge 30 jours vers 2300$"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                💰 Capital Initial ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.initialCapital}
                onChange={(e) => setFormData({ ...formData, initialCapital: e.target.value })}
                className="input"
                placeholder="100"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                📈 Objectif Journalier (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.dailyTargetPercent}
                onChange={(e) => setFormData({ ...formData, dailyTargetPercent: e.target.value })}
                className="input"
                placeholder="20"
                required
                min="0.1"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              📅 Durée (jours)
            </label>
            <input
              type="number"
              value={formData.durationDays}
              onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
              className="input"
              placeholder="30"
              required
              min="1"
              max="365"
            />
          </div>

          {/* Aperçu du challenge */}
          <div className="bg-gradient-to-r from-accent/10 to-success/10 border border-accent/30 rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-2">Aperçu du Challenge :</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-text-secondary">Capital initial :</span>{' '}
                <span className="font-bold">${parseFloat(formData.initialCapital).toFixed(2)}</span>
              </p>
              <p className="text-sm">
                <span className="text-text-secondary">Capital cible :</span>{' '}
                <span className="font-bold text-accent">${targetCapital.toFixed(2)}</span>
              </p>
              <p className="text-sm">
                <span className="text-text-secondary">Croissance totale :</span>{' '}
                <span className="font-bold text-success">
                  +{(((targetCapital - parseFloat(formData.initialCapital)) / parseFloat(formData.initialCapital)) * 100).toFixed(0)}%
                </span>
              </p>
              <p className="text-sm">
                <span className="text-text-secondary">Durée :</span>{' '}
                <span className="font-bold">{formData.durationDays} jours</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
              {loading ? 'Création...' : '🚀 Créer le Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
