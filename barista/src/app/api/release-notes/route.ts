export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getAuthHeaders } from '../../../utils/gcpAuth';

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_PRESS_SERVICE_URL || process.env.PRESS_SERVICE_URL || 'https://press-service-412558227984.us-central1.run.app';
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/release-notes`;
  
  try {
    const authHeaders = await getAuthHeaders(baseUrl);

    const res = await fetch(url, { headers: authHeaders });
    if (!res.ok) {
        throw new Error(`Status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error fetching release notes:", error.message);
    return NextResponse.json({ error: 'Failed to fetch release notes' }, { status: 500 });
  }
}
