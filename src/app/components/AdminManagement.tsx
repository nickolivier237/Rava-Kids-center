import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Mail, Lock, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { getAdmins, addAdmin, deleteAdmin } from '../../utils/api';

interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  role: string;
}

export function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const adminsData = await getAdmins();
      setAdmins(adminsData);
    } catch (error: any) {
      console.error('Error loading admins:', error);
      alert(`Erreur lors du chargement des admins: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addAdmin(formData.email, formData.password, formData.name);
      alert('Admin ajouté avec succès !');
      setFormData({ email: '', password: '', name: '' });
      setIsFormOpen(false);
      loadAdmins();
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
      console.error('Add admin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (adminId: string, adminEmail: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'admin ${adminEmail} ?`)) {
      setIsLoading(true);
      try {
        await deleteAdmin(adminId);
        alert('Admin supprimé avec succès !');
        loadAdmins();
      } catch (error: any) {
        alert(`Erreur: ${error.message}`);
        console.error('Delete admin error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '' });
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Administrateurs</h2>
          <p className="text-sm text-gray-600">Ajoutez ou supprimez des administrateurs</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#6B9AC4] hover:bg-[#5A89B3] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un Admin
        </Button>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="text-3xl font-bold text-[#6B9AC4]">{admins.length}</div>
          <div className="text-sm text-gray-600">Total Administrateurs</div>
        </CardContent>
      </Card>

      {/* Admins List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && admins.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="w-12 h-12 border-4 border-[#6B9AC4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : admins.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-gray-400">
              Aucun administrateur trouvé
            </CardContent>
          </Card>
        ) : (
          admins.map((admin) => (
            <Card key={admin.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF8B8B] to-[#FFB347] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{admin.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {admin.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{admin.email}</span>
                  </div>
                  <p className="text-xs">
                    Créé le: {new Date(admin.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(admin.id, admin.email)}
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Admin Form Modal */}
      {isFormOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={resetForm}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white rounded-lg shadow-2xl z-50">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-bold">Ajouter un Administrateur</h2>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">Nom Complet *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Ex: Jean Dupont"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="admin@ravakidscenter.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Mot de Passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    placeholder="Minimum 6 caractères"
                    minLength={6}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#6B9AC4] hover:bg-[#5A89B3] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Ajout...' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
