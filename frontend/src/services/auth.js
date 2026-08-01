export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

export function parseJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(payload)));
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token) {
  const data = parseJwt(token);
  if (!data || !data.exp) return true;
  // exp is in seconds
  return Date.now() >= data.exp * 1000;
}
