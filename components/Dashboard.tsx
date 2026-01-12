'use client';

import { Challenge, Trade, RulesSettings } from '@/types';
import { calculateDailyTarget, calculateTheoreticalCapital, getAdviceMessage, calculateMaxRiskPerTrade } from '@/lib/calculations';
import { TrendingUp, Target, Calendar, Activity, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface DashboardProps {
  challenge: Challenge;
  todayTrades: Trade[];
  rules: RulesSettings;
}

export default function Dashboard({ challenge, todayTrades, rules }: DashboardProps) {
  const todayTarget = calculateDailyTarget(
    challenge.initialCapital,
    challenge.dailyTargetPercent,
    challenge.currentDay
  );
  
  const theoreticalCapital = calculateTheoreticalCapital(
    challenge.initialCapital,
    challenge.dailyTargetPercent,
    challenge.currentDay
  );

  const progressPercent = ((challenge.currentCapital / todayTarget) * 100).toFixed(1);
  const deviationPercent = (((challenge.currentCapital - theoreticalCapital) / theoreticalCapital) * 100).toFixed(1);
  const maxRisk = calculateMaxRiskPerTrade(challenge.currentCapital, rules.maxRiskPerTradePercent);
  
  const { status, message } = getAdviceMessage(challenge, todayTrades, rules);
  const daysRemaining = challenge.durationDays - challenge.currentDay;

  const statusColor = {
    'on-track': 'bg-success',
    'warning': 'bg-[#F59E0B]',
    'blocked': 'bg-danger'
  }[status];

  const statusIcon = {
    'on-track': <CheckCircle2 className="w-6 h-6" />,
    'warning': <AlertTriangle className="w-6 h-6" />,
    'blocked': <XCircle className="w-6 h-6" />
  }[status];

  return (
    <div className="space-y-6">
      {/* Message dynamique */}
      <div className={`${statusColor} rounded-xl p-6 flex items-center gap-4`}>
        {statusIcon}
        <p className="text-lg font-semibold text-white">{message}</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Capital actuel */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Capital actuel</span>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-white">${challenge.currentCapital.toFixed(2)}</p>
          <p className="text-sm text-text-secondary mt-1">
            Objectif: ${todayTarget.toFixed(2)}
          </p>
        </div>

        {/* Progression du jour */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Progression du jour</span>
            <Target className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-accent">{progressPercent}%</p>
          <p className={`text-sm mt-1 ${parseFloat(deviationPercent) >= 0 ? 'text-success' : 'text-danger'}`}>
            Écart au plan: {deviationPercent}%
          </p>
        </div>

        {/* Jours restants */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Jours restants</span>
            <Calendar className="w-5 h-5 text-text-secondary" />
          </div>
          <p className="text-3xl font-bold text-white">{daysRemaining}</p>
          <p className="text-sm text-text-secondary mt-1">
            Jour {challenge.currentDay}/{challenge.durationDays}
          </p>
        </div>

        {/* Trades aujourd'hui */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Trades aujourd'hui</span>
            <Activity className="w-5 h-5 text-text-secondary" />
          </div>
          <p className="text-3xl font-bold text-white">
            {todayTrades.length}/{rules.maxTradesPerDay}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            Risque max: ${maxRisk.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Graphique de progression */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Progression vs Plan théorique</h3>
        <div className="h-64 flex items-center justify-center text-text-secondary">
          <div className="text-center">
            <p className="mb-2">📊 Graphique de progression</p>
            <p className="text-sm">Capital réel: ${challenge.currentCapital.toFixed(2)}</p>
            <p className="text-sm">Capital théorique: ${theoreticalCapital.toFixed(2)}</p>
            <p className="text-sm mt-4 text-xs">(Le graphique interactif sera affiché ici)</p>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">Croissance totale</p>
          <p className="text-2xl font-bold text-success">
            +{((challenge.currentCapital - challenge.initialCapital) / challenge.initialCapital * 100).toFixed(1)}%
          </p>
        </div>
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">Objectif final</p>
          <p className="text-2xl font-bold text-accent">${challenge.targetCapital}</p>
        </div>
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">Reste à gagner</p>
          <p className="text-2xl font-bold text-white">
            ${(challenge.targetCapital - challenge.currentCapital).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
