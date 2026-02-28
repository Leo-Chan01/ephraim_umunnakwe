import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authenticateAdmin, isAuthenticated } from '../../lib/auth';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (await isAuthenticated()) {
        router.push('/admin');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await authenticateAdmin(password);
    if (success) {
      router.push('/admin');
    } else {
      setError('AUTHENTICATION FAILED: INVALID CREDENTIALS');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-primary border-8 border-neutral-900 dark:border-neutral-800 p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,0.1)]">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-accent flex items-center justify-center mx-auto mb-8 border-4 border-neutral-900">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-2 uppercase tracking-tighter">Secure Access</h1>
            <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Administrative Protocol Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-tightest text-neutral-500">
                ACCESS KEY / PASSWORD
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all text-center tracking-widest"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500 text-white px-6 py-4 font-black uppercase tracking-widest text-xs text-center border-4 border-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 dark:bg-accent text-white py-5 border-4 border-neutral-900 dark:border-accent font-black text-xl uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all disabled:opacity-50"
            >
              {isLoading ? 'VERIFYING...' : 'INITIATE LOGIN'}
            </button>
          </form>

          <div className="mt-12 text-center border-t-2 border-neutral-100 dark:border-neutral-800 pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-accent font-black uppercase tracking-widest text-xs transition-colors"
            >
              <ArrowLeft size={16} />
              Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}