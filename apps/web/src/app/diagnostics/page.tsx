'use client';

import { useEffect, useState } from 'react';
import { config } from '@/lib/config';
import { runDiagnostics, type ConfigDiagnostics } from '@/lib/diagnostics';

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<ConfigDiagnostics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runChecks() {
      setLoading(true);
      const results = await runDiagnostics(config.apiUrl);
      setDiagnostics(results);
      setLoading(false);
    }
    runChecks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Running diagnostics...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!diagnostics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-red-600">Failed to run diagnostics</p>
          </div>
        </div>
      </div>
    );
  }

  const hasErrors = diagnostics.errors.length > 0;
  const hasWarnings = diagnostics.warnings.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Configuration Diagnostics
          </h1>
          <p className="text-gray-600">
            Check your Themis configuration and connectivity
          </p>
        </div>

        {/* Overall Status */}
        <div className={`rounded-lg shadow-sm p-6 ${
          hasErrors ? 'bg-red-50 border-2 border-red-200' :
          hasWarnings ? 'bg-yellow-50 border-2 border-yellow-200' :
          'bg-green-50 border-2 border-green-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {hasErrors ? (
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : hasWarnings ? (
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-lg font-medium ${
                hasErrors ? 'text-red-900' :
                hasWarnings ? 'text-yellow-900' :
                'text-green-900'
              }`}>
                {hasErrors ? 'Configuration Issues Detected' :
                 hasWarnings ? 'Configuration Warnings' :
                 'All Systems Operational'}
              </h3>
              <p className={`mt-1 text-sm ${
                hasErrors ? 'text-red-700' :
                hasWarnings ? 'text-yellow-700' :
                'text-green-700'
              }`}>
                {hasErrors ? 'Please fix the errors below to use the application.' :
                 hasWarnings ? 'The application may work but has some warnings.' :
                 'Your configuration is correct and the API is reachable.'}
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Environment</dt>
              <dd className="mt-1 text-sm text-gray-900">{diagnostics.environment}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">API URL</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{diagnostics.apiUrl}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(diagnostics.timestamp).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        {/* Status Checks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Checks</h2>
          <div className="space-y-3">
            <StatusCheck
              label="API URL Format"
              status={diagnostics.apiUrlValid}
              message={diagnostics.apiUrlValid ? 'URL format is valid' : 'URL format is invalid'}
            />
            <StatusCheck
              label="API Reachability"
              status={diagnostics.apiReachable}
              message={
                diagnostics.apiReachable === null ? 'Skipped (invalid URL)' :
                diagnostics.apiReachable ? 'API is reachable' : 'Cannot reach API'
              }
            />
            <StatusCheck
              label="CORS Configuration"
              status={diagnostics.corsConfigured}
              message={diagnostics.corsConfigured ? 'CORS is properly configured' : 'CORS not configured or API unreachable'}
            />
          </div>
        </div>

        {/* Errors */}
        {diagnostics.errors.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-4">❌ Errors</h2>
            <ul className="space-y-2">
              {diagnostics.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {diagnostics.warnings.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-yellow-900 mb-4">⚠️ Warnings</h2>
            <ul className="space-y-2">
              {diagnostics.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-700 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg shadow-sm p-6 border-2 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">📚 Need Help?</h2>
          <div className="text-sm text-blue-800 space-y-2">
            <p>If you're experiencing issues, check these resources:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>
                <a 
                  href="https://github.com/LucaDeAng/themis/blob/main/DEPLOYMENT_TROUBLESHOOTING.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  Deployment Troubleshooting Guide
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/LucaDeAng/themis/blob/main/RAILWAY_SETUP.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  Railway Setup Guide
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/LucaDeAng/themis#readme" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  README Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Run Diagnostics Again
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusCheck({ 
  label, 
  status, 
  message 
}: { 
  label: string; 
  status: boolean | null; 
  message: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center">
        <span className="text-sm text-gray-600 mr-3">{message}</span>
        {status === null ? (
          <span className="text-gray-400">⏭️</span>
        ) : status ? (
          <span className="text-green-600">✅</span>
        ) : (
          <span className="text-red-600">❌</span>
        )}
      </div>
    </div>
  );
}
