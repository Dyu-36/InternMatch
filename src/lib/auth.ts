const AUTH_EMAIL_DOMAIN =
  process.env.NEXT_PUBLIC_AUTH_EMAIL_DOMAIN ??
  process.env.AUTH_EMAIL_DOMAIN ??
  'internmatch.vercel.app';

export function authEmail(username: string) {
  return `${username}@${AUTH_EMAIL_DOMAIN}`;
}
