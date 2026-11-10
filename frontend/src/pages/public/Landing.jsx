import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import  Button  from '../../components/ui/Button';

import {
  BoltIcon,
  ChartBarSquareIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black grid-bg text-text-primary overflow-x-hidden">

      <nav className="relative z-20 border-b border-black-border/50 backdrop-blur-sm bg-black/60 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-crimson-500 to-accent flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all">
              <BoltIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              FitTrack
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 radial-glow pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-crimson-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crimson-600/30 bg-crimson-600/10 mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-crimson-500" />
            <span className="text-xs font-medium text-crimson-400">
              Built for people who actually track
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-hero mb-6 animate-fade-up">
            Stop guessing.<br />
            <span className="text-gradient-crimson">Start tracking.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up">
            The all-in-one fitness tracker for people who are serious about progress.
            Log workouts, meals, and measurements — then watch the numbers move.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16 animate-fade-up">
            <Link to="/register">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                Start Free
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                I have an account
              </Button>
            </Link>
          </div>

          {/* Live stat preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-up">
            {[
              { value: '50+', label: 'Exercises tracked' },
              { value: '1.2M', label: 'Calories logged' },
              { value: '10K+', label: 'Active users' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4">
                <p className="text-2xl md:text-3xl font-display font-bold text-gradient-crimson">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STORY / PROBLEM ==================== */}
      <section className="py-24 border-t border-black-border/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-medium text-crimson-400 uppercase tracking-wider">
              The problem
            </span>
            <h2 className="mt-3 mb-4">
              Most people quit fitness in 3 weeks.<br />
              <span className="text-text-secondary">Here's why.</span>
            </h2>
            <p className="text-text-secondary">
              You start strong. You download an app. You log for a week.
              Then life gets busy — and you stop. Not because you're lazy,
              but because tracking is <em>too much work</em>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                number: '01',
                title: 'Too many apps',
                desc: 'One for workouts. One for calories. One for weight. Nothing talks to each other.',
              },
              {
                number: '02',
                title: 'Too much friction',
                desc: 'Every entry takes 30 seconds of tapping. You do the math in your head instead.',
              },
              {
                number: '03',
                title: 'No real feedback',
                desc: 'Numbers sit in a spreadsheet you never look at. No patterns. No progress.',
              },
            ].map((pain) => (
              <div key={pain.number} className="glass-card p-6 border-l-2 border-l-crimson-600/40">
                <p className="text-4xl font-display font-bold text-crimson-600/30 mb-3">
                  {pain.number}
                </p>
                <h3 className="text-base font-semibold mb-2">{pain.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{pain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SOLUTION / FEATURES ==================== */}
      <section className="py-24 border-t border-black-border/30 relative">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-50 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-medium text-crimson-400 uppercase tracking-wider">
              The solution
            </span>
            <h2 className="mt-3 mb-4">
              One app. Everything you need.
            </h2>
            <p className="text-text-secondary">
              Fitness Tracker brings workouts, nutrition, and progress into one
              clean interface — so you can focus on doing the work, not logging it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: BoltIcon,
                title: 'Log in seconds',
                desc: 'Quick-add workouts, meals, and measurements. Auto-calculated totals. Templates for repeat routines.',
              },
              {
                icon: ChartBarSquareIcon,
                title: 'See real trends',
                desc: 'Weight over time. Calories in vs. out. Strength progress. Beautiful charts that actually make sense.',
              },
              {
                icon: SparklesIcon,
                title: 'Smart insights',
                desc: 'Weekly summaries. Streak tracking. Reminders that adapt to your schedule — not the other way around.',
              },
              {
                icon: ShieldCheckIcon,
                title: 'Your data, your rules',
                desc: 'Export anytime. No lock-in. End-to-end encrypted. Your progress belongs to you.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="glass-card-hover p-6 group"
              >
                <div className="w-10 h-10 rounded-lg bg-crimson-600/10 border border-crimson-600/20 flex items-center justify-center mb-4 group-hover:bg-crimson-600/20 group-hover:shadow-glow-sm transition-all">
                  <feature.icon className="w-5 h-5 text-crimson-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-24 border-t border-black-border/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-medium text-crimson-400 uppercase tracking-wider">
              How it works
            </span>
            <h2 className="mt-3 mb-4">Three steps. That's it.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-crimson-600/30 to-transparent" />

            {[
              {
                step: '1',
                title: 'Create your account',
                desc: 'Sign up with your email. Tell us your fitness goal.',
              },
              {
                step: '2',
                title: 'Start logging',
                desc: 'Add workouts, meals, and measurements as you go. Takes seconds.',
              },
              {
                step: '3',
                title: 'Watch progress',
                desc: 'See your numbers move. Stay motivated. Hit your goals.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson-600 to-accent flex items-center justify-center mx-auto mb-4 shadow-glow-sm text-2xl font-display font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIAL ==================== */}
      <section className="py-24 border-t border-black-border/30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card p-10 md:p-14 text-center relative">
            <div className="absolute top-6 left-6 text-6xl font-display text-crimson-600/20 leading-none">"</div>
            <p className="text-xl md:text-2xl font-display font-medium leading-relaxed mb-8">
              I've tried six fitness apps. This is the first one I've used
              for more than a month. It just… makes sense.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crimson-500 to-accent flex items-center justify-center font-display font-bold text-white">
                A
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Ahmed K.</p>
                <p className="text-xs text-text-muted">Using FitTrack for 4 months</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-24 border-t border-black-border/30 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="mb-6">
            Ready to actually<br />
            <span className="text-gradient-crimson">see progress?</span>
          </h2>
          <p className="text-text-secondary mb-10 max-w-xl mx-auto">
            Free to start. No credit card. Takes 30 seconds to set up.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                Create Free Account
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted">
            {['No credit card', 'Free forever plan', 'Export anytime'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4 text-crimson-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-black-border/30 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-crimson-500 to-accent flex items-center justify-center">
                <BoltIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold">FitTrack</span>
            </div>
            <p className="text-xs text-text-muted text-center md:text-right">
              © {new Date().getFullYear()} FitTrack. Built by Team CodeSlayers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}