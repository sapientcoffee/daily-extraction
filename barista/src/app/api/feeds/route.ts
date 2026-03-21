export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '../../../utils/gcpAuth';

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_PRESS_SERVICE_URL || process.env.PRESS_SERVICE_URL || 'https://press-service-412558227984.us-central1.run.app';
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/feeds`;
  
  try {
    const authHeaders = await getAuthHeaders(baseUrl);

    const res = await fetch(url, { headers: authHeaders });
    if (!res.ok) {
        throw new Error(`Status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error fetching feeds:", error.message);
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/feeds`;
  
  try {
    const body = await req.json();
    const authHeaders = await getAuthHeaders(baseUrl);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend error (${res.status}): ${errorText}`);
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(errorJson, { status: res.status });
      } catch {
        return NextResponse.json({ error: `Backend returned error ${res.status}` }, { status: res.status });
      }
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error creating feed:", error.message);
    return NextResponse.json({ error: 'Failed to create feed' }, { status: 500 });
  }
}
