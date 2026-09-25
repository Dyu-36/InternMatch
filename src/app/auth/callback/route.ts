import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getSiteUrl } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const codeSchema = z.string().min(1).max(2048);
const flowIdSchema = z.uuid();

export async function GET(request: NextRequest) {
  const code = codeSchema.safeParse(request.nextUrl.searchParams.get('code'));
  const flowId = flowIdSchema.safeParse(request.nextUrl.searchParams.get('sb_flow_id'));
  let redirectPath = '/reset-password';

  if (code.success) {
    try {
      const client = await createClient();
      const { error } = await client.auth.exchangeCodeForSession(code.data, flowId.success ? { flowId: flowId.data } : undefined);
      if (error) redirectPath = '/reset-password?error=invalid';
    } catch {
      redirectPath = '/reset-password?error=invalid';
    }
  } else {
    redirectPath = '/reset-password?error=invalid';
  }

  return NextResponse.redirect(new URL(redirectPath, getSiteUrl()), {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
