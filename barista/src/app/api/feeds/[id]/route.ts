import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '../../../../utils/gcpAuth';

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_PRESS_SERVICE_URL || process.env.PRESS_SERVICE_URL || 'https://press-service-412558227984.us-central1.run.app';
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/feeds/${id}`;

  try {
    const authHeaders = await getAuthHeaders('https://press-service-412558227984.us-central1.run.app');

    const res = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders
    });
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error deleting feed", error);
    return NextResponse.json({ error: 'Failed to delete feed' }, { status: 500 });
  }
}