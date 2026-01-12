-- SCRIPT SQL POUR CRÉER LES TABLES SUPABASE
-- Copiez ce script dans le SQL Editor de votre projet Supabase

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des challenges
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    initial_capital DECIMAL(10, 2) NOT NULL,
    target_capital DECIMAL(10, 2) NOT NULL,
    daily_target_percent DECIMAL(5, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    current_capital DECIMAL(10, 2) NOT NULL,
    current_day INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des trades
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    instrument TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('buy', 'sell')),
    lot_size DECIMAL(10, 2) NOT NULL,
    entry_price DECIMAL(10, 2) NOT NULL,
    stop_loss DECIMAL(10, 2) NOT NULL,
    take_profit DECIMAL(10, 2) NOT NULL,
    exit_price DECIMAL(10, 2),
    result_amount DECIMAL(10, 2) NOT NULL,
    result_percent DECIMAL(10, 2) NOT NULL,
    setup_type TEXT NOT NULL,
    reason TEXT,
    emotional_state_before TEXT NOT NULL,
    emotional_state_after TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paramètres de règles
CREATE TABLE IF NOT EXISTS rules_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    max_trades_per_day INTEGER NOT NULL DEFAULT 3,
    max_drawdown_percent DECIMAL(5, 2) NOT NULL DEFAULT 10,
    max_risk_per_trade_percent DECIMAL(5, 2) NOT NULL DEFAULT 2,
    stop_if_objective_reached BOOLEAN NOT NULL DEFAULT true,
    max_consecutive_losses INTEGER NOT NULL DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_challenge_id ON trades(challenge_id);
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(date);

-- Politiques de sécurité Row Level Security (RLS)

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules_settings ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies pour challenges
CREATE POLICY "Users can view own challenges" ON challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" ON challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" ON challenges
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges" ON challenges
    FOR DELETE USING (auth.uid() = user_id);

-- Policies pour trades
CREATE POLICY "Users can view own trades" ON trades
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON trades
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON trades
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades" ON trades
    FOR DELETE USING (auth.uid() = user_id);

-- Policies pour rules_settings
CREATE POLICY "Users can view own settings" ON rules_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON rules_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON rules_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Fonction pour créer automatiquement un profil après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Trader'));
    
    INSERT INTO public.rules_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour rules_settings
CREATE TRIGGER update_rules_settings_updated_at
    BEFORE UPDATE ON rules_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
