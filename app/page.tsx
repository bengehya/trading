'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import TradesList from '@/components/TradesList';
import ChallengeView from '@/components/ChallengeView';
import Statistics from '@/components/Statistics';
import { demoChallenge, demoTrades, demoRules } from '@/data/demo-data';
import { User, Bell } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filtrer les trades d'aujourd'hui
  const today = new Date().toISOString().split('T')[0];
  const todayTrades = demoTrades.filter(trade => {
    const tradeDate = new Date(trade.date).toISOString().split('T')[0];
    return tradeDate === today;
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard challenge={demoChallenge} todayTrades={todayTrades} rules={demoRules} />;
      case 'trades':
        return <TradesList trades={demoTrades} />;
      case 'challenge':
        return <ChallengeView challenge={demoChallenge} />;
      case 'statistics':
        return <Statistics trades={demoTrades} />;
      case 'planning':
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">📅 Planning Journalier</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold text-lg">Sessions recommandées</h3>
                <ul className="mt-2 space-y-2 text-text-secondary">
                  <li>⏰ 08:00 - 10:00 : Ouverture Londres</li>
                  <li>⏰ 14:00 - 16:00 : Ouverture New York</li>
                </ul>
              </div>
              
              <div className="card bg-dark-bg mt-6">
                <h3 className="font-semibold text-lg mb-4">✅ Checklist avant de trader</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-success" />
                    <span>Marché clair et tendance identifiée ?</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-success" />
                    <span>Setup validé selon ma stratégie ?</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-success" />
                    <span>Émotionnellement stable et concentré ?</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-success" />
                    <span>Stop Loss et Take Profit définis ?</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-success" />
                    <span>Ratio risque/rendement minimum respecté ?</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">⚙️ Paramètres & Règles</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Règles de Discipline</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-dark-border">
                    <span>Max trades par jour</span>
                    <span className="font-semibold text-accent">{demoRules.maxTradesPerDay}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-border">
                    <span>Drawdown maximum</span>
                    <span className="font-semibold text-danger">{demoRules.maxDrawdownPercent}%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-border">
                    <span>Risque max par trade</span>
                    <span className="font-semibold">{demoRules.maxRiskPerTradePercent}%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-border">
                    <span>Pertes consécutives max</span>
                    <span className="font-semibold">{demoRules.maxConsecutiveLosses}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span>Arrêt si objectif atteint</span>
                    <span className={`font-semibold ${demoRules.stopIfObjectiveReached ? 'text-success' : 'text-danger'}`}>
                      {demoRules.stopIfObjectiveReached ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard challenge={demoChallenge} todayTrades={todayTrades} rules={demoRules} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-primary border-b border-dark-border p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {activeTab === 'dashboard' && '📊 Dashboard'}
                {activeTab === 'trades' && '📝 Journal de Trading'}
                {activeTab === 'challenge' && '🎯 Mon Challenge'}
                {activeTab === 'statistics' && '📈 Statistiques'}
                {activeTab === 'planning' && '📅 Planning'}
                {activeTab === 'settings' && '⚙️ Paramètres'}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-dark-card rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              </button>
              <button className="p-2 hover:bg-dark-card rounded-lg transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
