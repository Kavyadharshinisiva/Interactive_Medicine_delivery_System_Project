import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Header from './components/Header';
import VirtualAssistant from './components/VirtualAssistant';
import MedicineCard from './components/MedicineCard';
import Cart from './components/Cart';
import OrderConfirmation from './components/OrderConfirmation';
import { Medicine } from './types';
import { medicines } from './data/medicines';

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(medicines.map(m => m.category)))];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: Medicine) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.medicine.id === medicine.id);
      if (existingItem) {
        return prev.map(item =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(medicineId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.medicine.id === medicineId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (medicineId: string) => {
    setCartItems(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  const handleCheckout = () => {
    const newOrderId = 'MD' + Date.now().toString().slice(-8);
    setOrderId(newOrderId);
    setCartItems([]);
    setIsCartOpen(false);
    setIsOrderConfirmationOpen(true);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">
              Your AI Health Assistant
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Get personalized medicine recommendations based on your symptoms. 
              Fast delivery, verified medicines, trusted care.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                ✓ AI-Powered Recommendations
              </span>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                ✓ 2-Hour Delivery
              </span>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                ✓ Verified Medicines
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Virtual Assistant */}
          <div className="lg:col-span-1">
            <VirtualAssistant onAddToCart={addToCart} />
          </div>

          {/* Medicine Catalog */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Medicine Catalog</h2>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search medicines, symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Medicine Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredMedicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onAddToCart={() => addToCart(medicine)}
                  />
                ))}
              </div>

              {filteredMedicines.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No medicines found matching your criteria.</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <OrderConfirmation
        isOpen={isOrderConfirmationOpen}
        onClose={() => setIsOrderConfirmationOpen(false)}
        orderId={orderId}
      />
    </div>
  );
}

export default App;