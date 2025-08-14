import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import UserAccountButton from '@/components/basejump/user-account-button';

export default async function Index() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 px-2 md:px-0">
        <div className="w-full max-w-screen-lg flex justify-between items-center p-3 text-sm">
          <div className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">K</span><span className="text-orange-500">⚡</span>
            </span>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserAccountButton />
            </div>
          ) : (
            <Button asChild variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-6 max-w-4xl px-3 w-full">
        <main className="flex-1 flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="font-bold text-5xl mb-4 flex items-center justify-center gap-2">
              <span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kudo</span><span className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] -ml-0.5">Sats</span>
              </span>
              <span className="text-yellow-400 text-4xl">⚡</span>
            </h1>
            <p className="text-lg text-gray-500 mb-2 italic">Where kudos meet sats</p>
            <p className="text-xl text-gray-600 mb-2">Employee Rewards & Micro-Bonuses Platform</p>
            <p className="text-lg text-gray-500">Instant recognition with Lightning Network micropayments <a href="https://lightning.network/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">(Learn more about Lightning)</a></p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="font-semibold text-xl mb-3 text-blue-900">💡 The Problem</h3>
              <p className="text-gray-700">Employee recognition is often sporadic, verbal, or tied to quarterly bonuses. No immediate reinforcement, and reward programs are clunky with gift cards and expense approvals.</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <h3 className="font-semibold text-xl mb-3 text-green-900">⚡ Our Solution</h3>
              <p className="text-gray-700">Managers send instant kudos backed by real sats (e.g., 100 sats ≈ $0.10) at the moment of achievement. Recognition with real value, delivered with a personal message.</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-bold text-3xl mb-6 text-center">Why KudoSats?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold mb-2">Instant Recognition</h4>
                <p className="text-sm text-gray-600">Reward achievements the moment they happen with Lightning Network micropayments</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎮</span>
                </div>
                <h4 className="font-semibold mb-2">Gamification</h4>
                <p className="text-sm text-gray-600">Leaderboards, streaks, badges, and achievements make rewards fun and engaging</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="font-semibold mb-2">Simple Pricing</h4>
                <p className="text-sm text-gray-600">$39/month per team • Free internal rewards • &lt; $0.01 withdrawals</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-bold text-3xl mb-6 text-center">Perfect For</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 border rounded-lg">
                <span className="text-2xl mr-3">💻</span>
                <div>
                  <h4 className="font-semibold">Tech Companies & Startups</h4>
                  <p className="text-sm text-gray-600">Crypto-savvy teams and remote workers</p>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <span className="text-2xl mr-3">📈</span>
                <div>
                  <h4 className="font-semibold">Sales Teams</h4>
                  <p className="text-sm text-gray-600">Gamification drives motivation</p>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <span className="text-2xl mr-3">🎧</span>
                <div>
                  <h4 className="font-semibold">Customer Service</h4>
                  <p className="text-sm text-gray-600">Instant rewards for upsells and satisfaction scores</p>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <span className="text-2xl mr-3">🌐</span>
                <div>
                  <h4 className="font-semibold">Open Source Projects</h4>
                  <p className="text-sm text-gray-600">Reward contributors in real time</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-lg">
            <h2 className="font-bold text-2xl mb-4">Ready to transform employee recognition?</h2>
            <p className="mb-6 text-orange-100">Join companies using frictionless, instant rewards to boost team morale and engagement.</p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/login">Get Started Today</Link>
            </Button>
          </div>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center gap-x-2 items-center text-sm">
          <p className="text-3xl">⚡🧡</p>
        <p>
            Powered by Lightning, fueled by recognition
        </p>
      </footer>
    </div>
  )
}
