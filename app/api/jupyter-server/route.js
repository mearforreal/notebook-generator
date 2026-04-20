import { NextResponse } from 'next/server';
import { getStatus, startServer, stopServer } from '@/lib/jupyter-server';

export async function GET() {
  return NextResponse.json(getStatus());
}

export async function POST() {
  try {
    const result = await startServer();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  stopServer();
  return NextResponse.json({ success: true, message: 'Jupyter Server stopped' });
}
