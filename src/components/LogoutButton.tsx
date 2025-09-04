'use client';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        logout();
        router.replace('/login');
      }}
    >
      Logout
    </button>
  );
}


