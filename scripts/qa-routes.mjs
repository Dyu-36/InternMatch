const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/jobs',
  '/jobs/1',
];

const protectedRoutes = [
  '/student/profile',
  '/student/dashboard',
  '/company/profile',
  '/company/dashboard',
  '/company/jobs/create',
  '/company/jobs/1',
];

const errorMarkers = [
  'Application error',
  'Unhandled Runtime Error',
  'Internal Server Error',
];

const results = await Promise.all(
  publicRoutes.map(async (route) => {
    const url = `${baseUrl}${route}`;

    try {
      const response = await fetch(url);
      const html = await response.text();
      const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || '(untitled)';
      const hasErrorMarker = errorMarkers.some((marker) => html.includes(marker));

      return {
        route,
        status: response.status,
        title,
        passed: response.ok && !hasErrorMarker,
      };
    } catch (error) {
      return {
        route,
        status: 'ERR',
        title: error instanceof Error ? error.message : String(error),
        passed: false,
      };
    }
  }),
);

const guardResults = await Promise.all(
  protectedRoutes.map(async route => {
    try {
      const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });
      const location = response.headers.get('location');
      const redirectUrl = location ? new URL(location, baseUrl) : null;
      const next = redirectUrl?.searchParams.get('next') ?? null;
      const passed = response.status === 307 && redirectUrl?.pathname === '/login' && next === route;
      return { route, status: response.status, next, passed };
    } catch (error) {
      return {
        route,
        status: 'ERR',
        next: error instanceof Error ? error.message : String(error),
        passed: false,
      };
    }
  }),
);

console.log('InternMatch route smoke test');
console.log(`Base URL: ${baseUrl}`);
console.log('');

for (const result of results) {
  console.log(`${result.passed ? 'PASS' : 'FAIL'} ${String(result.status).padEnd(3)} ${result.route.padEnd(24)} ${result.title}`);
}

for (const result of guardResults) {
  console.log(`${result.passed ? 'PASS' : 'FAIL'} ${String(result.status).padEnd(3)} ${result.route.padEnd(24)} -> /login?next=${result.next}`);
}

const failures = [
  ...results.filter(result => !result.passed),
  ...guardResults.filter(result => !result.passed),
];
console.log('');
console.log(`${results.length + guardResults.length - failures.length}/${results.length + guardResults.length} checks passed`);

if (failures.length > 0) {
  process.exitCode = 1;
}