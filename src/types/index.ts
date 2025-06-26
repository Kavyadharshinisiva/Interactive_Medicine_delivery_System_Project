export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  symptoms: string[];
  sideEffects: string[];
  dosage: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  category: string;
}

export interface Order {
  id: string;
  medicines: { medicine: Medicine; quantity: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  deliveryAddress: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
  medicines?: Medicine[];
}