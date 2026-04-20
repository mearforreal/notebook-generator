import { NextResponse } from 'next/server';
import { JUPYTER_HTTP } from '@/lib/jupyter-server';

// List all running kernels
export async function GET() {
  try {
    const res = await fetch(`${JUPYTER_HTTP}/api/kernels`);
    if (!res.ok) throw new Error(`Jupyter returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Start a new kernel
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const kernelName = body.kernelName || 'python3';

    const res = await fetch(`${JUPYTER_HTTP}/api/kernels`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ name: kernelName })
    });
    if (!res.ok) throw new Error(`Jupyter returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Shut down a kernel
export async function DELETE(request) {
  try {
    const { kernelId } = await request.json();
    if (!kernelId) return NextResponse.json({ error: 'Missing kernelId' }, { status: 400 });

    const res = await fetch(`${JUPYTER_HTTP}/api/kernels/${kernelId}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 404) throw new Error(`Jupyter returned ${res.status}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
