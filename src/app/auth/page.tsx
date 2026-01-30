'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlowButton from '@/components/ui/GlowButton';
import GlowCard from '@/components/ui/GlowCard';
import { DEV_BYPASS_AUTH, login, register } from '@/lib/storage';

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    const res = mode === 'login' ? login(email, password) : register(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push('/');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {DEV_BYPASS_AUTH
            ? 'Dev bypass is enabled: any email + password will sign you in.'
            : "Dev-only auth: credentials are stored in localStorage. Don’t use a real password."}
        </p>
      </div>

      <GlowCard className="p-6">
        <div className="space-y-3">
          <label className="block">
            <div className="text-xs font-medium text-zinc-400">Email</div>
            <input
              className="mt-1 h-10 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm text-zinc-100 outline-none ring-orange-400/30 focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rider@example.com"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>

          <label className="block">
            <div className="text-xs font-medium text-zinc-400">Password</div>
            <input
              className="mt-1 h-10 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-sm text-zinc-100 outline-none ring-orange-400/30 focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={DEV_BYPASS_AUTH ? '(anything)' : '(dev only)'}
            />
          </label>

          {error ? <div className="text-sm text-red-400">{error}</div> : null}

          <GlowButton className="w-full" onClick={submit}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </GlowButton>

          <GlowButton
            variant="secondary"
            className="w-full"
            onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
          >
            {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}
          </GlowButton>
        </div>
      </GlowCard>
    </div>
  );
}
