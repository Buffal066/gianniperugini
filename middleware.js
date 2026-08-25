export const config = {
  matcher: ["/ember-cathedral", "/ember-cathedral.html"],
};

function unauthorized() {
  return new Response("Private page", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Ember Cathedral"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function secretsMatch(left, right) {
  const a = String(left ?? "");
  const b = String(right ?? "");
  const size = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let index = 0; index < size; index += 1) {
    diff |= (a.charCodeAt(index) || 0) ^ (b.charCodeAt(index) || 0);
  }
  return diff === 0;
}

export default function middleware(request) {
  const expectedUser = process.env.EMBER_CATHEDRAL_USER || "gianni";
  const expectedPassword = process.env.EMBER_CATHEDRAL_PASSWORD || "";
  if (!expectedPassword) return unauthorized();

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return unauthorized();

  let decoded = "";
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorized();
  }

  const separator = decoded.indexOf(":");
  if (separator < 0) return unauthorized();

  const user = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  if (!secretsMatch(user, expectedUser) || !secretsMatch(password, expectedPassword)) {
    return unauthorized();
  }
}
