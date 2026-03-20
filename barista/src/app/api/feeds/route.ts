export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '../../../utils/gcpAuth';

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_PRESS_SERVICE_URL || process.env.PRESS_SERVICE_URL || 'http://localhost:8081';
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
  } catch (error) {
    console.error("Error fetching feeds", error);
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
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error creating feed", error);
    return NextResponse.json({ error: 'Failed to create feed' }, { status: 500 });
  }
}