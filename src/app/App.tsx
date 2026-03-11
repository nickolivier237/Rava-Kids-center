import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard, Product } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { FilterSection } from './components/FilterSection';
import { Dashboard } from './components/Dashboard';
import { AdminLogin } from './components/AdminLogin';
import { ProductQuickView } from './components/ProductQuickView';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { TrustSection } from './components/TrustSection';
import { HowToOrder } from './components/HowToOrder';
import { getProducts } from '../utils/api';

interface CartItem extends Product {
  quantity: number;
}

const defaultProducts: Product[] = [

];

export default function App() {
  const [view, setView] = useState<'store' | 'admin' | 'login'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedAgeRange, setSelectedAgeRange] = useState('Tous');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState('price-asc');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('237680246823');

  // Load products from API on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsFromAPI = await getProducts();
      // If no products in database, use default products
      if (productsFromAPI.length === 0) {
        setProducts(defaultProducts);
      } else {
        setProducts(productsFromAPI);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to default products on error
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  // Refresh products when coming back from admin
  const handleProductsChange = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const handleLogin = () => {
    setView('admin');
  };

  const handleLogout = () => {
    setView('store');
    // Reload products when returning to store
    loadProducts();
  };

  // Check URL for admin access
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setView('login');
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleAddToCartWithQuantity = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsCartOpen(true); // Open cart drawer after adding
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === 'Tous' || product.category === selectedCategory;
    const ageMatch =
      selectedAgeRange === 'Tous' || product.ageRange === selectedAgeRange;
    return categoryMatch && ageMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // default order
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Show admin login
  if (view === 'login') {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Show admin dashboard
  if (view === 'admin') {
    return (
      <Dashboard
        products={products}
        onProductsChange={handleProductsChange}
        onLogout={handleLogout}
      />
    );
  }

  // Show store
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF8B8B] via-[#FFB347] via-[#87CCA8] to-[#6B9AC4] bg-clip-text text-transparent">
            Mode Enfantine - Collection Complète 0-15 Ans
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez notre magnifique collection de vêtements pour enfants de 0 à 15 ans.
            Robes, pantalons, t-shirts, ensembles et plus ! Tissus de qualité et prix abordables !
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-[#FF8B8B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* Filters */}
            <FilterSection
              selectedCategory={selectedCategory}
              selectedAgeRange={selectedAgeRange}
              onCategoryChange={setSelectedCategory}
              onAgeRangeChange={setSelectedAgeRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickView={() => setQuickViewProduct(product)}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez d'ajuster vos filtres pour voir plus de produits
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Trust Section */}
      <TrustSection />

      {/* How To Order */}
      <HowToOrder />

      {/* Footer */}
      <footer className="bg-white mt-16 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg mb-3">À Propos</h3>
              <p className="text-gray-600 text-sm">
                Nous proposons des vêtements de haute qualité et magnifiques pour les enfants de 0 à 15 ans.
                Le bonheur et le confort de vos enfants sont notre priorité !
              </p>
              <button
                onClick={() => setView('login')}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Accès Admin
              </button>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-gray-600 text-sm mb-2">
                📱 WhatsApp: +237 680 246 823
              </p>
              <p className="text-gray-600 text-sm">
                📧 Email: info@ravakidscenter.com
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Commande Rapide</h3>
              <p className="text-gray-600 text-sm mb-3">
                Ajoutez des articles au panier et commandez directement via WhatsApp !
              </p>
              <a
                href="https://wa.me/237680246823"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Discutez avec nous
              </a>
            </div>
          </div>
          <div className="text-center mt-8 pt-6 border-t text-sm text-gray-500">
            © 2026 Rava Kids Center. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Product Quick View */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCartWithQuantity}
        whatsappNumber={whatsappNumber}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp whatsappNumber={whatsappNumber} />
    </div>
  );
}