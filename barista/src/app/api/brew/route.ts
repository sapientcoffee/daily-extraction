export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getAuthHeaders } from '../../../utils/gcpAuth';

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_ORIGIN_SERVICE_URL || process.env.ORIGIN_SERVICE_URL || 'http://localhost:8080';
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/brew`;
  
  try {
    const authHeaders = await getAuthHeaders(baseUrl);

    const res = await fetch(url, { headers: authHeaders });
    if (!res.ok) {
        throw new Error(`Status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error fetching brew methods", error);
    return NextResponse.json({ error: 'Failed to fetch brew methods' }, { status: 500 });
  }
}