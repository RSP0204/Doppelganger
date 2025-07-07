import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const role = formData.get('role') as string;

  if (!file || !role) {
    return NextResponse.json({ message: 'File and role are required' }, { status: 400 });
  }

  console.log('Received file:', file.name);
  console.log('Selected role:', role);
  console.log('Starting chunking process...');

  // In a real application, you would now proceed with chunking the file
  // and then calling the AI service to generate questions.

  return NextResponse.json({ message: 'File uploaded successfully. Chunking process started.' });
}
