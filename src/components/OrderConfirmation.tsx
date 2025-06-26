import React from 'react';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export default function OrderConfirmation({ isOpen, onClose, orderId }: OrderConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">Your order has been successfully placed</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="font-mono text-lg font-semibold text-gray-900">{orderId}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium">Order Processing</span>
            </div>
            <span className="text-xs text-blue-600">In Progress</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Out for Delivery</span>
            </div>
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Delivered</span>
            </div>
            <span className="text-xs text-gray-500">Pending</span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <Clock className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">Estimated Delivery</span>
          </div>
          <p className="text-sm text-yellow-700">
            Your order will be delivered within 2-4 hours by our partner delivery service.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}