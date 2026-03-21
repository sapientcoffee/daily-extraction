export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getAuthHeaders } from '../../../utils/gcpAuth';

function getBaseUrl() {
  // Use production URL as fallback to avoid localhost 403s in deployed env if vars are missing
  return process.env.NEXT_PUBLIC_PRESS_SERVICE_URL || 
         process.env.PRESS_SERVICE_URL || 
         'https://press-service-412558227984.us-central1.run.app';
}

export async function POST() {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/chaos`;
  
  try {
    const authHeaders = await getAuthHeaders(baseUrl);

    // Explicitly construct headers and include a body for the POST request
    const res = await fetch(url, { 
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'trigger_chaos' })
    });
    
    if (!res.ok) {
        throw new Error(`Upstream service responded with status ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error initiating chaos:", error.message);
    return NextResponse.json({ error: 'Failed to initiate chaos', details: error.message }, { status: 500 });
  }
}
