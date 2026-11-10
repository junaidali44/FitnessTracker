import React from 'react'

const oldcomponents = () => {
  return (
<>
 {/* <section className="relative pt-20 pb-32 overflow-hidden">
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
      {/* </section> */} 
</>    
)
}

<>
 {/* <section className="relative pt-20 pb-32 overflow-hidden">
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
      {/* </section> */} 
</>export default oldcompon

