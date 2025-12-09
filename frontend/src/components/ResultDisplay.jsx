import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ResultDisplay = ({ result }) => {
  if (result.error) {
    return (
      <div className="mt-8 bg-red-50 rounded-xl p-6 border-2 border-red-200">
        <div className="flex items-center mb-4">
          <XCircle className="h-8 w-8 text-red-500 mr-3" />
          <h3 className="text-2xl font-bold text-red-800">Error</h3>
        </div>
        <p className="text-red-700">{result.reasoning}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-center mb-4">
        {result.isValid ? (
          <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
        ) : (
          <XCircle className="h-8 w-8 text-red-500 mr-3" />
        )}
        <h3 className="text-2xl font-bold text-gray-800">
          {result.isValid ? 'Claim Valid ✓' : 'Claim Invalid ✗'}
        </h3>
      </div>
      
      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Analysis:</h4>
        <p className="text-gray-600 whitespace-pre-wrap">{result.reasoning}</p>
      </div>
      
      {result.coverage && (
        <div className="bg-blue-100 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Coverage Details:</h4>
          <p className="text-blue-700">{result.coverage}</p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;