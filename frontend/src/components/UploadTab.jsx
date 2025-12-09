import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Building2, Loader2 } from 'lucide-react';
import { companyAPI } from '../services/api';

const UploadTab = ({ companies, onUploadSuccess }) => {
  const [policyFile, setPolicyFile] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handlePolicyUpload = async () => {
    if (!policyFile || !companyName) return;

    const formData = new FormData();
    formData.append('policy', policyFile);
    formData.append('companyName', companyName);

    setLoading(true);
    
    try {
      await companyAPI.uploadPolicy(formData);
      setUploadSuccess(true);
      setCompanyName('');
      setPolicyFile(null);
      onUploadSuccess();
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Error uploading policy:', error);
      alert('Failed to upload policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Insurance Policy</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g., HDFC ERGO, ICICI Lombard"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Policy Document
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              onChange={(e) => setPolicyFile(e.target.files[0])}
              className="hidden"
              id="policy-file"
              accept=".pdf,.txt,.doc,.docx"
            />
            <label htmlFor="policy-file" className="cursor-pointer">
              <FileText className="mx-auto h-16 w-16 text-gray-400" />
              <p className="mt-4 text-sm text-gray-600">
                {policyFile ? policyFile.name : 'Click to upload policy document'}
              </p>
              <p className="mt-2 text-xs text-gray-500">PDF, TXT, DOC, DOCX</p>
            </label>
          </div>
        </div>

        <button
          onClick={handlePolicyUpload}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Upload Policy
            </>
          )}
        </button>
      </div>

      {uploadSuccess && (
        <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
          <p className="text-green-800 font-semibold">Policy uploaded successfully!</p>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Companies</h3>
        <div className="grid gap-3">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 flex items-center"
            >
              <Building2 className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-800">{company.name}</p>
                <p className="text-sm text-gray-600">
                  Uploaded: {new Date(company.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadTab;