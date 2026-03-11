import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { checkAdminExists, signupAdmin, loginAdmin } from '../../utils/api';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkIfAdminExists();
  }, []);

  const checkIfAdminExists = async () => {
    try {
      const exists = await checkAdminExists();
      setIsSignup(!exists);
    } catch (error) {
      console.error('Error checking admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signupAdmin(email, password, name);
        // After signup, login automatically
        await loginAdmin(email, password);
        onLogin();
      } else {
        await loginAdmin(email, password);
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF8B8B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#FF8B8B] via-[#FFB347] to-[#87CCA8] rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">
            {isSignup ? 'Créer Compte Admin' : 'Tableau de Bord Admin'}
          </CardTitle>
          
          <p className="text-sm text-gray-600">
            {isSignup 
              ? 'Première connexion - Créez votre compte administrateur'
              : 'Connectez-vous pour gérer les produits - Rava Kids Center'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="name">Nom Complet</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="admin@ravakids.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de Passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder={isSignup ? 'Créez un mot de passe fort' : 'Entrez le mot de passe'}
                required
                minLength={6}
              />
              {isSignup && (
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 caractères
                </p>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF8B8B] via-[#FFB347] to-[#87CCA8] hover:opacity-90 text-white"
              disabled={loading}
            >
              {loading ? 'Chargement...' : (isSignup ? 'Créer Mon Compte' : 'Se Connecter')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}