export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getAuthHeaders } from '../../../../utils/gcpAuth';

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_MINDSET_SERVICE_URL || process.env.MINDSET_SERVICE_URL || 'http://localhost:8000';
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/tips/random`;
  
  try {
    const authHeaders = await getAuthHeaders(baseUrl);

    const res = await fetch(url, { headers: authHeaders });
    if (!res.ok) {
        throw new Error(`Status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error fetching tips/random", error);
    return NextResponse.json({ error: 'Failed to fetch tip' }, { status: 500 });
  }
}