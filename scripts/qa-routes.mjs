const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

const routes = [
  '/',
  '/login',
  '/register',
  '/jobs',
  '/jobs/1',
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
  routes.map(async (route) => {
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

console.log('InternMatch route smoke test');
console.log(`Base URL: ${baseUrl}`);
console.log('');

for (const result of results) {
  console.log(`${result.passed ? 'PASS' : 'FAIL'} ${String(result.status).padEnd(3)} ${result.route.padEnd(24)} ${result.title}`);
}

const failures = results.filter((result) => !result.passed);
console.log('');
console.log(`${results.length - failures.length}/${results.length} routes passed`);

if (failures.length > 0) {
  process.exitCode = 1;
}