// Minimal password gate for the admin API.
// The password lives in an environment variable so it is never committed to
// the repo. For an MVP this is sufficient; swap for a real auth provider
// (e.g. Auth.js) when you outgrow it.

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "changeme";
}

export function isAuthorized(request) {
  const header = request.headers.get("x-admin-password");
  return header && header === getAdminPassword();
}
