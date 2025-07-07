import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const role = formData.get('role') as string;

  if (!file || !role) {
    
    return NextResponse.json(
      { message: 'File and role are required' },
      { status: 400 }
    );
  }

  const transcript = await file.text();

  try {
    const backendResponse = await fetch('http://127.0.0.1:8000/process-transcript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript, role }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { message: errorData.detail || 'Backend server error' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to connect to the backend service' },
      { status: 500 }
    );
  }
}
