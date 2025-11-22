import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Shield, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center pt-16 mb-16">
        <h1 className="text-5xl font-bold text-gray-100 mb-6">
          Your AI-Powered Mental Health Companion
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Experience compassionate conversations and emotional support, available 24/7
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all"
        >
          Get Started
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: <MessageCircle className="h-8 w-8 text-indigo-400" />,
            title: "24/7 Conversations",
            description: "Always available to listen and support you through any challenge"
          },
          {
            icon: <Shield className="h-8 w-8 text-indigo-400" />,
            title: "Private & Secure",
            description: "Your conversations are completely private and encrypted"
          },
          {
            icon: <Brain className="h-8 w-8 text-indigo-400" />,
            title: "AI-Powered Insights",
            description: "Personalized support based on your unique situation"
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-700"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-200">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}