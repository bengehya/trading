'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';

interface AuthFormProps {
  onSuccess: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        // Connexion
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          setMessage('Connexion réussie !');
          setTimeout(() => onSuccess(), 1000);
        }
      } else {
        // Inscription
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || 'Trader',
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setMessage('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
          // Basculer vers la connexion après 3 secondes
          setTimeout(() => {
            setIsLogin(true);
            setMessage('');
          }, 3000);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent mb-2">TGA</h1>
          <p className="text-text-secondary">Trading Growth Assistant</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              isLogin
                ? 'bg-success text-white'
                : 'bg-dark-bg text-text-secondary hover:bg-dark-border'
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-2" />
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              !isLogin
                ? 'bg-success text-white'
                : 'bg-dark-bg text-text-secondary hover:bg-dark-border'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                <User className="w-4 h-4 inline mr-2" />
                Nom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Votre nom"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              <Lock className="w-4 h-4 inline mr-2" />
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {!isLogin && (
              <p className="text-xs text-text-secondary mt-1">
                Minimum 6 caractères
              </p>
            )}
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Chargement...</span>
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4 inline mr-2" />
                Se connecter
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 inline mr-2" />
                S'inscrire
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          {isLogin ? (
            <p>
              Pas encore de compte ?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-accent hover:underline"
              >
                S'inscrire
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-accent hover:underline"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-dark-border text-center text-xs text-text-secondary">
          <p>En vous connectant, vous acceptez nos conditions d'utilisation</p>
          <p className="mt-2">Made with 💚 for traders</p>
        </div>
      </div>
    </div>
  );
}
