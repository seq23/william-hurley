/**
 * Pages Functions middleware: keep the bare *.pages.dev preview host out of
 * search indexes so it cannot compete with the production custom domain.
 *
 * Scope is deliberately narrow -- the header is only ever set when the request
 * Host ends in ".pages.dev". Requests to the production custom domain are
 * passed through untouched, so no noindex can leak onto the real site.
 */
export async function onRequest(context) {
  const res = await context.next();
  let host = "";
  try {
    host = new URL(context.request.url).hostname;
  } catch (err) {
    return res;
  }
  if (!host.endsWith(".pages.dev")) return res;
  const out = new Response(res.body, res);
  out.headers.set("X-Robots-Tag", "noindex, nofollow");
  return out;
}
