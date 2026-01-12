'use client';

import { Challenge } from '@/types';
import { Target, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface ChallengeViewProps {
  challenge: Challenge;
}

export default function ChallengeView({ challenge }: ChallengeViewProps) {
  const startDate = new Date(challenge.startDate).toLocaleDateString('fr-FR');
  const endDate = new Date(challenge.endDate).toLocaleDateString('fr-FR');
  const progressPercent = ((challenge.currentCapital - challenge.initialCapital) / (challenge.targetCapital - challenge.initialCapital) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{challenge.name}</h2>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            challenge.status === 'active' ? 'bg-success text-white' :
            challenge.status === 'completed' ? 'bg-accent text-black' :
            'bg-danger text-white'
          }`}>
            {challenge.status === 'active' ? 'En cours' :
             challenge.status === 'completed' ? 'Terminé' : 'Abandonné'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Capital initial */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-dark-bg rounded-lg">
              <DollarSign className="w-6 h-6 text-text-secondary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Capital initial</p>
              <p className="text-2xl font-bold">${challenge.initialCapital}</p>
            </div>
          </div>

          {/* Capital actuel */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-success bg-opacity-20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Capital actuel</p>
              <p className="text-2xl font-bold text-success">${challenge.currentCapital.toFixed(2)}</p>
            </div>
          </div>

          {/* Objectif final */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent bg-opacity-20 rounded-lg">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Objectif final</p>
              <p className="text-2xl font-bold text-accent">${challenge.targetCapital}</p>
            </div>
          </div>

          {/* Durée */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-dark-bg rounded-lg">
              <Calendar className="w-6 h-6 text-text-secondary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Durée</p>
              <p className="text-2xl font-bold">{challenge.durationDays} jours</p>
              <p className="text-sm text-text-secondary">Jour {challenge.currentDay}/{challenge.durationDays}</p>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Progression globale</span>
            <span className="text-sm font-semibold text-accent">{progressPercent}%</span>
          </div>
          <div className="w-full h-4 bg-dark-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success to-accent transition-all duration-500"
              style={{ width: `${Math.min(parseFloat(progressPercent), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Paramètres du challenge */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">⚙️ Paramètres du Challenge</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-dark-border">
            <span className="text-text-secondary">Objectif journalier</span>
            <span className="font-semibold text-accent">+{challenge.dailyTargetPercent}%</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-dark-border">
            <span className="text-text-secondary">Date de début</span>
            <span className="font-semibold">{startDate}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-dark-border">
            <span className="text-text-secondary">Date de fin</span>
            <span className="font-semibold">{endDate}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-text-secondary">Croissance attendue</span>
            <span className="font-semibold text-success">
              +{((challenge.targetCapital - challenge.initialCapital) / challenge.initialCapital * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Historique jour par jour */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">📅 Historique Jour par Jour</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: challenge.durationDays }, (_, i) => {
            const day = i + 1;
            const isPast = day < challenge.currentDay;
            const isCurrent = day === challenge.currentDay;
            const isFuture = day > challenge.currentDay;

            return (
              <div
                key={day}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-semibold
                  ${isPast ? 'bg-success text-white' : ''}
                  ${isCurrent ? 'bg-accent text-black' : ''}
                  ${isFuture ? 'bg-dark-border text-text-secondary' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success" />
            <span className="text-text-secondary">Complété</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent" />
            <span className="text-text-secondary">Aujourd'hui</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-dark-border" />
            <span className="text-text-secondary">À venir</span>
          </div>
        </div>
      </div>
    </div>
  );
}
