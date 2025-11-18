/**
 * Configuration Diagnostic Utility
 * 
 * This utility helps diagnose configuration issues in production.
 * It's safe to include in production as it only exposes non-sensitive configuration.
 */

export interface ConfigDiagnostics {
  apiUrl: string;
  apiUrlValid: boolean;
  apiReachable: boolean | null;
  corsConfigured: boolean;
  environment: 'development' | 'production' | 'test';
  timestamp: string;
  errors: string[];
  warnings: string[];
}

/**
 * Validates the API URL format
 */
function validateApiUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: 'API URL is not configured' };
  }

  // Check if it's a valid URL
  try {
    const parsed = new URL(url);
    
    // Check protocol
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'API URL must use http:// or https://' };
    }

    // Check if URL ends with /api
    if (!url.endsWith('/api')) {
      return { 
        valid: false, 
        error: 'API URL should end with /api (e.g., https://api.example.com/api)' 
      };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'API URL is not a valid URL' };
  }
}

/**
 * Tests if the API is reachable
 */
async function testApiReachability(apiUrl: string): Promise<{ reachable: boolean; error?: string }> {
  try {
    const healthUrl = `${apiUrl}/health`;
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't send credentials for health check
      credentials: 'omit',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'ok') {
        return { reachable: true };
      }
    }

    return { 
      reachable: false, 
      error: `API responded with status ${response.status}` 
    };
  } catch (err) {
    const error = err as Error;
    return { 
      reachable: false, 
      error: `Cannot reach API: ${error.message}. This might be a CORS issue or network problem.` 
    };
  }
}

/**
 * Runs all diagnostic checks
 */
export async function runDiagnostics(apiUrl: string): Promise<ConfigDiagnostics> {
  const diagnostics: ConfigDiagnostics = {
    apiUrl,
    apiUrlValid: false,
    apiReachable: null,
    corsConfigured: false,
    environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    timestamp: new Date().toISOString(),
    errors: [],
    warnings: [],
  };

  // Validate API URL
  const urlValidation = validateApiUrl(apiUrl);
  diagnostics.apiUrlValid = urlValidation.valid;
  if (!urlValidation.valid && urlValidation.error) {
    diagnostics.errors.push(urlValidation.error);
  }

  // Test API reachability (only if URL is valid)
  if (diagnostics.apiUrlValid) {
    const reachability = await testApiReachability(apiUrl);
    diagnostics.apiReachable = reachability.reachable;
    
    if (!reachability.reachable && reachability.error) {
      diagnostics.errors.push(reachability.error);
    } else if (reachability.reachable) {
      diagnostics.corsConfigured = true;
    }
  }

  // Add warnings for common issues
  if (diagnostics.environment === 'production' && apiUrl.includes('localhost')) {
    diagnostics.warnings.push(
      'API URL points to localhost in production. This will not work for deployed applications.'
    );
  }

  if (diagnostics.environment === 'production' && apiUrl.startsWith('http://')) {
    diagnostics.warnings.push(
      'API URL uses HTTP instead of HTTPS in production. This may cause mixed content issues.'
    );
  }

  return diagnostics;
}

/**
 * Formats diagnostics for console output
 */
export function formatDiagnosticsForConsole(diagnostics: ConfigDiagnostics): string {
  const lines: string[] = [
    '=== Themis Configuration Diagnostics ===',
    '',
    `Environment: ${diagnostics.environment}`,
    `Timestamp: ${diagnostics.timestamp}`,
    '',
    `API URL: ${diagnostics.apiUrl}`,
    `API URL Valid: ${diagnostics.apiUrlValid ? '✅' : '❌'}`,
    `API Reachable: ${diagnostics.apiReachable === null ? '⏭️ Skipped' : diagnostics.apiReachable ? '✅' : '❌'}`,
    `CORS Configured: ${diagnostics.corsConfigured ? '✅' : '❌'}`,
  ];

  if (diagnostics.errors.length > 0) {
    lines.push('', '❌ Errors:');
    diagnostics.errors.forEach(error => {
      lines.push(`  - ${error}`);
    });
  }

  if (diagnostics.warnings.length > 0) {
    lines.push('', '⚠️  Warnings:');
    diagnostics.warnings.forEach(warning => {
      lines.push(`  - ${warning}`);
    });
  }

  if (diagnostics.errors.length === 0 && diagnostics.warnings.length === 0) {
    lines.push('', '✅ All checks passed!');
  }

  lines.push('', '=== End Diagnostics ===');
  return lines.join('\n');
}

/**
 * Runs diagnostics and logs to console
 */
export async function logDiagnostics(apiUrl: string): Promise<ConfigDiagnostics> {
  const diagnostics = await runDiagnostics(apiUrl);
  console.log(formatDiagnosticsForConsole(diagnostics));
  return diagnostics;
}
