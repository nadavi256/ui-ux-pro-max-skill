// Reduce a callbackUrl (relative, or absolute as set by the auth proxy) to a
// same-site path so it can never redirect off-site.
export function safeRedirectPath(value: unknown) {
  if (typeof value !== "string" || !value) return "/";
  try {
    const url = new URL(value, "http://local");
    const path = url.pathname + url.search;
    return path.startsWith("//") ? "/" : path;
  } catch {
    return "/";
  }
}
