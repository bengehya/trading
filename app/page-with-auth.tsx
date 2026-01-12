'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import TradesList from '@/components/TradesList';
import ChallengeView from '@/components/ChallengeView';
import Statistics from '@/components/Statistics';
import AuthForm from '@/components/AuthForm';
import AddTradeForm from '@/components/AddTradeForm';
import CreateChallengeForm from '@/components/CreateChallengeForm';
import { User, Bell, LogOut, Plus } from 'lucide-react';
import { Challenge, Trade, RulesSettings } from '@/types';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [rules, setRules] = useState<RulesSettings>({
    maxTradesPerDay: 3,
    maxDrawdownPercent: 10,
    maxRiskPerTradePercent: 2,
    stopIfObjectiveReached: true,
    maxConsecutiveLosses: 2,
  });
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Charger le challenge actif
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (challengeError && challengeError.code !== 'PGRST116') {
        throw challengeError;
      }

      if (challengeData) {
        setChallenge({
          id: challengeData.id,
          userId: challengeData.user_id,
          name: challengeData.name,
          initialCapital: challengeData.initial_capital,
          targetCapital: challengeData.target_capital,
          dailyTargetPercent: challengeData.daily_target_percent,
          durationDays: challengeData.duration_days,
          startDate: challengeData.start_date,
          endDate: challengeData.end_date,
          status: challengeData.status,
          currentCapital: challengeData.current_capital,
          currentDay: challengeData.current_day,
        });

        // Charger les trades du challenge
        const { data: tradesData, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('challenge_id', challengeData.id)
          .order('date', { ascending: false });

        if (tradesError) throw tradesError;

        if (tradesData) {
          setTrades(tradesData.map(t => ({
            id: t.id,
            challengeId: t.challenge_id,
            userId: t.user_id,
            date: t.date,
            instrument: t.instrument,
            direction: t.direction as 'buy' | 'sell',
            lotSize: t.lot_size,
            entryPrice: t.entry_price,
            stopLoss: t.stop_loss,
            takeProfit: t.take_profit,
            exitPrice: t.exit_price,
            resultAmount: t.result_amount,
            resultPercent: t.result_percent,
            setupType: t.setup_type,
            reason: t.reason,
            emotionalStateBefore: t.emotional_state_before,
            emotionalStateAfter: t.emotional_state_after,
          })));
        }
      }

      // Charger les règles
      const { data: rulesData, error: rulesError } = await supabase
        .from('rules_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (rulesError && rulesError.code !== 'PGRST116') {
        throw rulesError;
      }

      if (rulesData) {
        setRules({
          maxTradesPerDay: rulesData.max_trades_per_day,
          maxDrawdownPercent: rulesData.max_drawdown_percent,
          maxRiskPerTradePercent: rulesData.max_risk_per_trade_percent,
          stopIfObjectiveReached: rulesData.stop_if_objective_reached,
          maxConsecutiveLosses: rulesData.max_consecutive_losses,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setChallenge(null);
    setTrades([]);
  };

  const handleTradeSuccess = () => {
    setShowAddTrade(false);
    if (user) loadUserData(user.id);
  };

  const handleChallengeSuccess = () => {
    setShowCreateChallenge(false);
    if (user) loadUserData(user.id);
  };

  // Filtrer les trades d'aujourd'hui
  const today = new Date().toISOString().split('T')[0];
  const todayTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date).toISOString().split('T')[0];
    return tradeDate === today;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSuccess={checkUser} />;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2">Bienvenue !</h2>
          <p className="text-text-secondary mb-6">
            Vous n'avez pas encore de challenge actif. Créez-en un pour commencer !
          </p>
          <button
            onClick={() => setShowCreateChallenge(true)}
            className="btn-primary w-full"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Créer mon premier Challenge
          </button>
          <button
            onClick={handleLogout}
            className="mt-4 text-text-secondary hover:text-text-primary text-sm"
          >
            Se déconnecter
          </button>
        </div>
        {showCreateChallenge && (
          <CreateChallengeForm
            userId={user.id}
            onSuccess={handleChallengeSuccess}
            onClose={() => setShowCreateChallenge(false)}
          />
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard challenge={challenge} todayTrades={todayTrades} rules={rules} />;
      case 'trades':
        return <TradesList trades={trades} />;
      case 'challenge':
        return <ChallengeView challenge={challenge} />;
      case 'statistics':
        return <Statistics trades={trades} />;
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
                    <span className="font-semibold text-accent">{rules.maxTradesPerDay}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-border">
                    <span>Drawdown maximum</span>
                    <span className="font-semibold text-danger">{rules.maxDrawdownPercent}%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-border">
                    <span>Risque max par trade</span>
                    <span className="font-semibold">{rules.maxRiskPerTradePercent}%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-dark-border">
                    <span>Pertes consécutives max</span>
                    <span className="font-semibold">{rules.maxConsecutiveLosses}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span>Arrêt si objectif atteint</span>
                    <span className={`font-semibold ${rules.stopIfObjectiveReached ? 'text-success' : 'text-danger'}`}>
                      {rules.stopIfObjectiveReached ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard challenge={challenge} todayTrades={todayTrades} rules={rules} />;
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
              <button
                onClick={() => setShowAddTrade(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouveau Trade</span>
              </button>
              <button className="p-2 hover:bg-dark-card rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-dark-card rounded-lg transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>

      {/* Modals */}
      {showAddTrade && (
        <AddTradeForm
          challengeId={challenge.id}
          userId={user.id}
          currentCapital={challenge.currentCapital}
          onSuccess={handleTradeSuccess}
          onClose={() => setShowAddTrade(false)}
        />
      )}
    </div>
  );
}
