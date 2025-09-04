'use client';

export type LoginInput = { email: string; password: string };

const TOKEN_KEY = 'nest_jwt';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(input: LoginInput) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json(); // { access_token, user }
  setToken(data.access_token);
  return data.user;
}

export async function logout() {
  clearToken();
}

// NextAuth logic removed; using Nest JWT instead
