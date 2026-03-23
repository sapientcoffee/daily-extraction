import { GoogleAuth } from 'google-auth-library';

/**
 * Retrieves OIDC ID Token headers for GCP service-to-service authentication.
 * 
 * @param targetAudience - The base URL of the target service (e.g., Cloud Run URL).
 * @returns Headers object containing the Authorization bearer token, or empty object if local/error.
 */
export async function getAuthHeaders(targetAudience: string) {
  // Skip auth for local development
  if (targetAudience.includes('localhost') || targetAudience.includes('127.0.0.1')) {
    return {};
  }

  const auth = new GoogleAuth();
  try {
    // 1. Try to get token from metadata server if running on GCP
    // This is often more reliable on App Hosting / Cloud Run
    try {
      const client = await auth.getIdTokenClient(targetAudience);
      const headers = await client.getRequestHeaders() as any;
      const authHeader = headers['Authorization'] || headers['authorization'];
      
      if (authHeader) {
        console.log(`[getAuthHeaders] Successfully retrieved OIDC token via getIdTokenClient for audience: ${targetAudience}`);
        return headers;
      }
    } catch (innerErr: any) {
      console.warn(`[getAuthHeaders] getIdTokenClient failed, trying fallback: ${innerErr.message}`);
    }

    // 2. Fallback: Manually fetch from metadata server
    // Ref: https://cloud.google.com/run/docs/authenticating/service-to-service#python
    const encodedAudience = encodeURIComponent(targetAudience);
    const metadataUrl = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodedAudience}`;
    const metadataRes = await fetch(metadataUrl, {
      headers: { 'Metadata-Flavor': 'Google' }
    });

    if (metadataRes.ok) {
      const token = await metadataRes.text();
      console.log(`[getAuthHeaders] Successfully retrieved OIDC token via Metadata Server for audience: ${targetAudience}`);
      return { 'Authorization': `Bearer ${token}` };
    } else {
      console.error(`[getAuthHeaders] Metadata server returned ${metadataRes.status} for audience ${targetAudience}`);
    }

    return {};
  } catch (error: any) {
    console.error(`[getAuthHeaders] Failed to retrieve OIDC token for ${targetAudience}:`, error.message);
    return {};
  }
}
