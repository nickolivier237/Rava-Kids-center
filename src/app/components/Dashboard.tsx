import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Product } from './ProductCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { createProduct, updateProduct, deleteProduct, uploadImage, logoutAdmin } from '../../utils/api';

interface DashboardProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  onLogout: () => void;
}

const categories = ['Robes', 'T-Shirts', 'Pantalons', 'Ensembles', 'Chaussures', 'Sacs', 'Accessoires'];
const ageRanges = ['0-3 ans', '3-7 ans', '7-12 ans', '12-15 ans'];

export function Dashboard({ products, onProductsChange, onLogout }: DashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    ageRange: '0-3 ans',
    category: 'Robes',
    description: '',
    sizes: '',
    inStock: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image: '',
      ageRange: '0-3 ans',
      category: 'Robes',
      description: '',
      sizes: '',
      inStock: true,
    });
    setImagePreview('');
    setAdditionalImages([]);
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      ageRange: product.ageRange,
      category: product.category,
      description: product.description,
      sizes: product.sizes.join(', '),
      inStock: product.inStock !== false,
    });
    setImagePreview(product.image);
    setAdditionalImages(product.images?.slice(1) || []);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setIsLoading(true);
      try {
        await deleteProduct(productId);
        const updatedProducts = products.filter((p) => p.id !== productId);
        onProductsChange(updatedProducts);
      } catch (error: any) {
        alert(`Erreur lors de la suppression: ${error.message}`);
        console.error('Delete error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const sizesArray = formData.sizes
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      const productData: any = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image,
        ageRange: formData.ageRange,
        category: formData.category,
        description: formData.description,
        sizes: sizesArray,
        inStock: formData.inStock,
        images: [formData.image, ...additionalImages],
      };

      let savedProduct;
      if (editingProduct) {
        // Update existing product
        savedProduct = await updateProduct(editingProduct.id, productData);
        const updatedProducts = products.map((p) =>
          p.id === editingProduct.id ? savedProduct : p
        );
        onProductsChange(updatedProducts);
      } else {
        // Add new product
        savedProduct = await createProduct(productData);
        onProductsChange([savedProduct, ...products]);
      }

      resetForm();
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image (JPG, PNG, etc.)');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop grande. Taille maximale: 5MB');
        return;
      }

      setUploadingImage(true);
      try {
        // Upload to Supabase Storage
        const url = await uploadImage(file);
        setFormData({ ...formData, image: url });
        setImagePreview(url);
      } catch (error: any) {
        alert(`Erreur lors de l'upload: ${error.message}`);
        console.error('Upload error:', error);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image (JPG, PNG, etc.)');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop grande. Taille maximale: 5MB');
        return;
      }

      setUploadingImage(true);
      try {
        // Upload to Supabase Storage
        const url = await uploadImage(file);
        setAdditionalImages([...additionalImages, url]);
      } catch (error: any) {
        alert(`Erreur lors de l'upload: ${error.message}`);
        console.error('Upload error:', error);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleAdditionalImageUrlChange = (url: string) => {
    setAdditionalImages([...additionalImages, url]);
  };

  const productsByCategory = categories.map((category) => ({
    category,
    products: products.filter((p) => p.category === category),
  }));

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF8B8B] via-[#FFB347] to-[#87CCA8] bg-clip-text text-transparent">
              Tableau de Bord Admin
            </h1>
            <p className="text-sm text-gray-600">Gérer les vêtements - Rava Kids Center</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-pink-600">{products.length}</div>
              <div className="text-sm text-gray-600">Total Articles</div>
            </CardContent>
          </Card>
          {ageRanges.map((range) => (
            <Card key={range}>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600">
                  {products.filter((p) => p.ageRange === range).length}
                </div>
                <div className="text-sm text-gray-600">{range}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#6B9AC4] hover:bg-[#5A89B3] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un Article
          </Button>
        </div>

        {/* Products by Category */}
        <div className="space-y-8">
          {productsByCategory.map(({ category, products: categoryProducts }) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                {category}
                <Badge variant="secondary">{categoryProducts.length}</Badge>
              </h2>
              {categoryProducts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-400">
                    Aucun article dans cette catégorie
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>Prix: {product.price.toLocaleString('fr-FR')} FCFA</p>
                          <p>Âge: {product.ageRange}</p>
                          <p>Tailles: {product.sizes.join(', ')}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="flex-1"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={resetForm}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-lg shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Modifier l\'Article' : 'Ajouter un Article'}
              </h2>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">Nom de l'Article *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Ex: T-shirt Bleu, Robe Princesse, Pantalon Jeans"
                />
              </div>

              <div>
                <Label htmlFor="price">Prix (FCFA) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  placeholder="Ex: 25000"
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <Label>Image du Produit *</Label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-2 mb-4 relative">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Upload Button */}
                <div className="space-y-3">
                  <label
                    htmlFor="imageUpload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#6B9AC4] hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-[#6B9AC4]" />
                    <span className="text-sm font-medium text-gray-700">
                      {imagePreview ? 'Changer l\'image' : 'Télécharger une image'}
                    </span>
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="flex items-center gap-2">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-xs text-gray-500">OU</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* URL Input as alternative */}
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="Coller l'URL de l'image"
                    className="text-sm"
                  />
                  
                  <p className="text-xs text-gray-500">
                    📸 Téléchargez depuis votre appareil ou collez une URL • Max 5MB
                  </p>
                </div>

                {/* Hidden required field to ensure image is provided */}
                <input
                  type="text"
                  value={formData.image}
                  onChange={() => {}}
                  required
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ageRange">Tranche d'Âge *</Label>
                  <Select
                    value={formData.ageRange}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ageRange: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ageRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="sizes">Tailles (séparées par des virgules) *</Label>
                <Input
                  id="sizes"
                  value={formData.sizes}
                  onChange={(e) =>
                    setFormData({ ...formData, sizes: e.target.value })
                  }
                  required
                  placeholder="Ex: S, M, L ou 3T, 4T, 5T"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  placeholder="Décrivez le vêtement (matière, couleur, détails)..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) =>
                    setFormData({ ...formData, inStock: e.target.checked })
                  }
                  className="w-4 h-4 text-[#6B9AC4] border-gray-300 rounded focus:ring-[#6B9AC4]"
                />
                <Label htmlFor="inStock" className="cursor-pointer">
                  Produit Disponible
                </Label>
              </div>

              {/* Additional Images Section */}
              <div className="border-t pt-4">
                <Label>Images Supplémentaires (Optionnel)</Label>
                <p className="text-xs text-gray-500 mb-3">Ajoutez plus d'images pour créer une galerie</p>
                
                {/* Additional Images Preview */}
                {additionalImages.length > 0 && (
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {additionalImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Image ${index + 2}`}
                          className="w-full h-24 object-cover rounded border-2 border-gray-200"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => {
                            setAdditionalImages(additionalImages.filter((_, i) => i !== index));
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <label
                    htmlFor="additionalImageUpload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#6B9AC4] hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-[#6B9AC4]" />
                    <span className="text-sm text-gray-700">
                      Ajouter une image ({additionalImages.length})
                    </span>
                  </label>
                  <input
                    id="additionalImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleAdditionalImageUpload}
                    className="hidden"
                  />

                  <div className="flex items-center gap-2">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-xs text-gray-500">OU</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      id="additionalImageUrl"
                      type="url"
                      placeholder="Coller l'URL de l'image"
                      className="text-sm flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value) {
                            handleAdditionalImageUrlChange(input.value);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('additionalImageUrl') as HTMLInputElement;
                        if (input?.value) {
                          handleAdditionalImageUrlChange(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#6B9AC4] hover:bg-[#5A89B3] text-white"
                >
                  {editingProduct ? 'Mettre à Jour' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}