import React, { useState, useEffect } from 'react';
import { User, Building2 } from 'lucide-react';
import { companyAPI } from './services/api';
import QueryTab from './components/QueryTab';
import UploadTab from './components/UploadTab';

const App = () => {
  const [activeTab, setActiveTab] = useState('query');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await companyAPI.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Insurance Policy AI</h1>
            <p className="text-blue-100">Intelligent claim validation powered by AI</p>
          </div>

          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('query')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'query'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="inline mr-2 h-5 w-5" />
              Query Claims
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className="inline mr-2 h-5 w-5" />
              Upload Policy
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'query' ? (
              <QueryTab companies={companies} />
            ) : (
              <UploadTab companies={companies} onUploadSuccess={fetchCompanies} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;