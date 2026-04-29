import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // In development, we can try to read the .env file
    // Note: This is purely for local dev convenience as requested
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      return NextResponse.json({ rpcUrl: '', privateKey: '' });
    }
    const content = fs.readFileSync(envPath, 'utf8');
    const rpcMatch = content.match(/NEXT_PUBLIC_SEPOLIA_RPC_URL="([^"]+)"/);
    const pkMatch = content.match(/PRIVATE_KEY="([^"]+)"/);
    
    return NextResponse.json({
      rpcUrl: rpcMatch ? rpcMatch[1] : '',
      privateKey: pkMatch ? pkMatch[1] : '********' // Mask PK for UI safety
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const { rpcUrl, privateKey } = await request.json();
    const envPath = path.join(process.cwd(), '.env.local');
    
    let content = `NEXT_PUBLIC_SEPOLIA_RPC_URL="${rpcUrl}"\n`;
    if (privateKey) {
      content += `PRIVATE_KEY="${privateKey}"\n`;
    }

    fs.writeFileSync(envPath, content);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
