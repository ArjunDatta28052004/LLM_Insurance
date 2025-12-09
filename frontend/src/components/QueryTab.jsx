import React, { useState } from 'react';
import { Upload, Send, Loader2 } from 'lucide-react';
import { claimAPI } from '../services/api';
import ResultDisplay from './ResultDisplay';

const QueryTab = ({ companies }) => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [queryText, setQueryText] = useState('');
  const [queryFile, setQueryFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!selectedCompany || (!queryText && !queryFile)) return;

    const formData = new FormData();
    formData.append('companyId', selectedCompany);
    if (queryText) formData.append('queryText', queryText);
    if (queryFile) formData.append('queryDocument', queryFile);

    setLoading(true);
    setResult(null);
    
    try {
      const data = await claimAPI.queryClaim(formData);
      setResult(data);
    } catch (error) {
      console.error('Error querying claim:', error);
      setResult({ 
        error: true,
        reasoning: 'Failed to process query. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Claim Query</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Insurance Company
          </label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a company...</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Query Details (Text)
          </label>
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="e.g., 36 years old Male, Knee Replacement, Kolkata, 36 months of policy"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Upload Medical Document (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              onChange={(e) => setQueryFile(e.target.files[0])}
              className="hidden"
              id="query-file"
              accept=".pdf,.txt,.doc,.docx"
            />
            <label htmlFor="query-file" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {queryFile ? queryFile.name : 'Click to upload document'}
              </p>
            </label>
          </div>
        </div>

        <button
          onClick={handleQuery}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Query
            </>
          )}
        </button>
      </div>

      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default QueryTab;