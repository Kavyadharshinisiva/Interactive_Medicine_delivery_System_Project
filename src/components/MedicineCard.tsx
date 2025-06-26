import React from 'react';
import { Star, Plus, ShoppingCart } from 'lucide-react';
import { Medicine } from '../types';

interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart: () => void;
  compact?: boolean;
}

export default function MedicineCard({ medicine, onAddToCart, compact = false }: MedicineCardProps) {
  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">{medicine.name}</h4>
            <p className="text-xs text-gray-600 mb-1">{medicine.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-semibold text-sm">₹{medicine.price}</span>
              <button
                onClick={onAddToCart}
                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-48 object-cover"
        />
        {!medicine.inStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {medicine.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{medicine.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(medicine.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {medicine.rating} ({medicine.reviews} reviews)
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Dosage:</p>
          <p className="text-sm text-gray-700">{medicine.dosage}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">₹{medicine.price}</span>
          </div>
          <button
            onClick={onAddToCart}
            disabled={!medicine.inStock}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}