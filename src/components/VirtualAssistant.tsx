import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Heart, Shield } from 'lucide-react';
import { ChatMessage, Medicine } from '../types';
import { medicines } from '../data/medicines';
import MedicineCard from './MedicineCard';

interface VirtualAssistantProps {
  onAddToCart: (medicine: Medicine) => void;
}

export default function VirtualAssistant({ onAddToCart }: VirtualAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm Dr. AI, your personal health assistant. I'm here to help you find the right medicine based on your symptoms. What's bothering you today?",
      sender: 'assistant',
      timestamp: new Date(),
      suggestions: [
        'I have a headache and fever',
        'I feel nauseous and have stomach pain',
        'I have a persistent cough',
        'I have allergies and runny nose',
        'I can\'t sleep well',
        'Show me all medicines'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    conditions: [] as string[]
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findMedicinesForSymptoms = (symptoms: string[]): Medicine[] => {
    const foundMedicines = medicines.filter(medicine =>
      symptoms.some(symptom =>
        medicine.symptoms.some(medSymptom =>
          medSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(medSymptom.toLowerCase())
        )
      )
    );
    
    // Sort by rating and reviews for better recommendations
    return foundMedicines.sort((a, b) => {
      const scoreA = a.rating * Math.log(a.reviews + 1);
      const scoreB = b.rating * Math.log(b.reviews + 1);
      return scoreB - scoreA;
    });
  };

  const extractSymptomsFromText = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const detectedSymptoms: string[] = [];
    
    // Comprehensive symptom detection
    const symptomPatterns = {
      'headache': ['head', 'headache', 'migraine', 'head pain', 'head ache'],
      'fever': ['fever', 'temperature', 'hot', 'feverish', 'burning up'],
      'cough': ['cough', 'coughing', 'throat clearing', 'hack'],
      'cold': ['cold', 'runny nose', 'stuffy', 'congestion', 'sniffles'],
      'pain': ['pain', 'ache', 'hurt', 'sore', 'aching', 'painful'],
      'stomach': ['stomach', 'belly', 'tummy', 'abdomen', 'gastric'],
      'nausea': ['nausea', 'nauseous', 'sick', 'queasy', 'vomit'],
      'allergy': ['allergy', 'allergic', 'sneez', 'itch', 'rash', 'hives'],
      'sleep': ['sleep', 'insomnia', 'tired', 'fatigue', 'rest'],
      'anxiety': ['anxious', 'anxiety', 'nervous', 'stress', 'worry'],
      'diarrhea': ['diarrhea', 'loose stool', 'runs', 'bowel'],
      'constipation': ['constipation', 'constipated', 'blocked'],
      'muscle': ['muscle', 'joint', 'back', 'neck', 'shoulder'],
      'infection': ['infection', 'infected', 'bacterial', 'viral'],
      'diabetes': ['diabetes', 'blood sugar', 'glucose', 'diabetic'],
      'blood pressure': ['blood pressure', 'hypertension', 'bp'],
      'skin': ['skin', 'rash', 'eczema', 'dermatitis', 'acne'],
      'eye': ['eye', 'vision', 'sight', 'dry eyes', 'pink eye'],
      'heart': ['heart', 'chest pain', 'palpitation', 'cardiac']
    };

    Object.entries(symptomPatterns).forEach(([symptom, patterns]) => {
      if (patterns.some(pattern => lowerText.includes(pattern))) {
        detectedSymptoms.push(symptom);
      }
    });

    return detectedSymptoms;
  };

  const generateContextualResponse = (userMessage: string, detectedSymptoms: string[]): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        id: Date.now().toString(),
        text: "Hello! Great to meet you! I'm here to help you with your health concerns. Could you tell me what symptoms you're experiencing?",
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: [
          'I have pain somewhere',
          'I feel sick',
          'I have digestive issues',
          'I need vitamins',
          'Show popular medicines'
        ]
      };
    }

    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return {
        id: Date.now().toString(),
        text: "You're very welcome! I'm always here to help with your health needs. Is there anything else you'd like to know about medicines or your symptoms?",
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: [
          'How do I take these medicines?',
          'Are there any side effects?',
          'Find more medicines',
          'Check drug interactions'
        ]
      };
    }

    // Emergency or serious symptoms
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe', 'emergency', 'urgent', 'blood'];
    if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        id: Date.now().toString(),
        text: "⚠️ I notice you mentioned some serious symptoms. For severe or emergency symptoms, please consult a healthcare professional immediately or call emergency services. I can help with minor symptoms and over-the-counter medications.",
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: [
          'Find nearby hospitals',
          'Call emergency services',
          'Show mild symptom relief',
          'Contact a doctor'
        ]
      };
    }

    // Symptom-based responses
    if (detectedSymptoms.length > 0) {
      const recommendedMedicines = findMedicinesForSymptoms(detectedSymptoms);
      
      if (recommendedMedicines.length > 0) {
        const symptomText = detectedSymptoms.length === 1 
          ? `your ${detectedSymptoms[0]}` 
          : `your symptoms (${detectedSymptoms.join(', ')})`;
          
        return {
          id: Date.now().toString(),
          text: `I understand you're dealing with ${symptomText}. Based on your symptoms, here are my top recommendations. Please remember to consult with a healthcare professional before taking any medication, especially if symptoms persist.`,
          sender: 'assistant',
          timestamp: new Date(),
          medicines: recommendedMedicines.slice(0, 4),
          suggestions: [
            'Show more options',
            'What are the side effects?',
            'How should I take these?',
            'Are there natural alternatives?',
            'Check for drug interactions'
          ]
        };
      }
    }

    // Category-based queries
    const categories = ['pain', 'allergy', 'digestive', 'vitamin', 'antibiotic', 'skin', 'sleep'];
    const mentionedCategory = categories.find(cat => lowerMessage.includes(cat));
    
    if (mentionedCategory) {
      const categoryMedicines = medicines.filter(med => 
        med.category.toLowerCase().includes(mentionedCategory) ||
        med.symptoms.some(symptom => symptom.includes(mentionedCategory))
      );
      
      if (categoryMedicines.length > 0) {
        return {
          id: Date.now().toString(),
          text: `Here are some excellent ${mentionedCategory} medications I recommend. Each has been carefully selected based on effectiveness and user reviews.`,
          sender: 'assistant',
          timestamp: new Date(),
          medicines: categoryMedicines.slice(0, 4),
          suggestions: [
            'Show all in this category',
            'Compare these medicines',
            'What\'s most popular?',
            'Show cheaper alternatives'
          ]
        };
      }
    }

    // Show all medicines request
    if (lowerMessage.includes('show all') || lowerMessage.includes('all medicines') || lowerMessage.includes('browse')) {
      return {
        id: Date.now().toString(),
        text: "Here's a selection of our most popular and highly-rated medicines across different categories. You can also use the search function to find specific medications.",
        sender: 'assistant',
        timestamp: new Date(),
        medicines: medicines.slice(0, 6),
        suggestions: [
          'Show by category',
          'Most popular medicines',
          'Cheapest options',
          'Highest rated medicines'
        ]
      };
    }

    // Dosage and usage questions
    if (lowerMessage.includes('how to take') || lowerMessage.includes('dosage') || lowerMessage.includes('how much')) {
      return {
        id: Date.now().toString(),
        text: "Dosage information is provided on each medicine card. Always follow the recommended dosage and consult with a pharmacist or doctor if you're unsure. Never exceed the recommended dose.",
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: [
          'Show medicine details',
          'Drug interaction checker',
          'When to take medicines',
          'Food and medicine timing'
        ]
      };
    }

    // Side effects questions
    if (lowerMessage.includes('side effect') || lowerMessage.includes('adverse') || lowerMessage.includes('reaction')) {
      return {
        id: Date.now().toString(),
        text: "Side effects are listed for each medicine. Common side effects are usually mild, but if you experience severe reactions, stop taking the medicine and consult a healthcare professional immediately.",
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: [
          'Show medicines with fewer side effects',
          'Natural alternatives',
          'When to stop taking medicine',
          'Emergency contacts'
        ]
      };
    }

    // Price and cost questions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
      const affordableMedicines = medicines
        .filter(med => med.price < 50)
        .sort((a, b) => a.price - b.price);
        
      return {
        id: Date.now().toString(),
        text: "Here are some affordable medicine options under ₹50. Remember, the most expensive isn't always the best - these budget-friendly options are equally effective!",
        sender: 'assistant',
        timestamp: new Date(),
        medicines: affordableMedicines.slice(0, 4),
        suggestions: [
          'Show all budget options',
          'Generic vs branded',
          'Bulk purchase discounts',
          'Insurance coverage'
        ]
      };
    }

    // Default helpful response
    return {
      id: Date.now().toString(),
      text: "I'd love to help you find the right medicine! Could you describe your symptoms more specifically? For example, you could say 'I have a headache and fever' or 'I'm having stomach problems'.",
      sender: 'assistant',
      timestamp: new Date(),
      suggestions: [
        'I have pain',
        'I feel sick to my stomach',
        'I have cold symptoms',
        'I need vitamins',
        'I have skin problems',
        'Browse all medicines'
      ]
    };
  };

  const generateResponse = (userMessage: string): ChatMessage => {
    const detectedSymptoms = extractSymptomsFromText(userMessage);
    return generateContextualResponse(userMessage, detectedSymptoms);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate realistic AI thinking time
    const thinkingTime = 800 + Math.random() * 1200;
    setTimeout(() => {
      const assistantResponse = generateResponse(text);
      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full animate-pulse">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold">Dr. AI Assistant</h3>
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            </div>
            <div className="flex items-center space-x-4 text-blue-100 text-sm">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                Online
              </span>
              <span className="flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                Trusted by 10k+ users
              </span>
              <span className="flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Safe & Secure
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div key={message.id} className="space-y-3">
            <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                {message.sender === 'assistant' && (
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-1.5 rounded-full shadow-sm">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-1.5 rounded-full shadow-sm">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Medicine Recommendations */}
            {message.medicines && message.medicines.length > 0 && (
              <div className="ml-8 space-y-2">
                <div className="text-xs text-gray-500 font-medium mb-2">
                  💊 Recommended Medicines ({message.medicines.length})
                </div>
                {message.medicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onAddToCart={() => onAddToCart(medicine)}
                    compact
                  />
                ))}
              </div>
            )}

            {/* Enhanced Suggestions */}
            {message.suggestions && (
              <div className="ml-8 space-y-2">
                <div className="text-xs text-gray-500 font-medium">💡 Quick Actions:</div>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-1.5 rounded-full shadow-sm">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500 mr-2">Dr. AI is thinking</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Describe your symptoms... (e.g., 'I have a headache and fever')"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm placeholder-gray-500"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['🤒 Fever', '😷 Cold', '💊 Pain Relief', '🤢 Nausea', '😴 Sleep Aid'].map((quickAction) => (
            <button
              key={quickAction}
              onClick={() => handleSendMessage(quickAction.split(' ')[1])}
              className="px-3 py-1 bg-white text-gray-600 rounded-full text-xs hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
            >
              {quickAction}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}