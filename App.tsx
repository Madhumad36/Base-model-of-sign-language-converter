
import React, { useState } from 'react';
import { Tab } from './types';
import LiveConversation from './components/LiveConversation';
import ImageAnalyzer from './components/ImageAnalyzer';
import Chat from './components/Chat';
import ImageGenerator from './components/ImageGenerator';
import ComplexQuery from './components/ComplexQuery';
import LowLatency from './components/LowLatency';
import { HandIcon } from './components/Icons';


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LiveConversation);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.LiveConversation:
        return <LiveConversation />;
      case Tab.ImageAnalyzer:
        return <ImageAnalyzer />;
      case Tab.Chat:
        return <Chat />;
      case Tab.ImageGenerator:
        return <ImageGenerator />;
      case Tab.ComplexQuery:
        return <ComplexQuery />;
      case Tab.LowLatency:
        return <LowLatency />;
      default:
        return <LiveConversation />;
    }
  };

  const TabButton: React.FC<{ tab: Tab }> = ({ tab }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`px-3 py-2 text-sm md:px-4 md:py-3 md:text-base font-medium rounded-t-lg transition-colors duration-200 ${
          isActive
            ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
      >
        {tab}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <HandIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Gemini AI Sign Language Assistant
            </h1>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <div className="border-b border-gray-700 mb-4">
          <nav className="flex flex-wrap -mb-px">
            {Object.values(Tab).map((tab) => (
              <TabButton key={tab} tab={tab} />
            ))}
          </nav>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-xl p-4 md:p-6 min-h-[70vh]">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-gray-800 text-center py-4">
        <p className="text-sm text-gray-500">Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
