import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
  }

  try {
    console.log('Login attempt with:', { username, password });
    const filePath = path.resolve(process.cwd(), '..', 'backend', 'userdata.json');
    console.log('Attempting to read userdata.json from:', filePath);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(fileContent);
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (user) {
      console.log('Login successful for user:', username);
      
return NextResponse.json({ message: 'Login successful' });
    } else {
      console.log('Invalid credentials for user:', username);
      
return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    
return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
