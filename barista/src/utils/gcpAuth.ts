import { GoogleAuth } from 'google-auth-library';

export async function getAuthHeaders(targetAudience: string) {
  const auth = new GoogleAuth();
  let headers: Record<string, string> | any = {};
  
  // If targetAudience is localhost, no auth is needed
  if (targetAudience.includes('localhost') || targetAudience.includes('127.0.0.1')) {
    return headers;
  }

  try {
    const client = await auth.getIdTokenClient(targetAudience);
    headers = await client.getRequestHeaders(targetAudience);
    console.log(`[getAuthHeaders] Successfully retrieved headers for audience ${targetAudience}.`);
  } catch (error) {
    console.error(`[getAuthHeaders] Failed to get IdTokenClient for ${targetAudience}. Proceeding without auth headers.`, error);
  }
  
  return headers;
}