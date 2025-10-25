'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  const fetchWaitlistCount = async () => {
    try {
      const response = await fetch('/api/waitlist');
      const data = await response.json();
      setWaitlistCount(data.count);
    } catch (err) {
      console.error('Failed to fetch waitlist count:', err);
    }
  };

  useEffect(() => {
    fetchWaitlistCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setSubmitted(true);
      setEmail(''); // Clear the input
      setTimeout(() => setSubmitted(false), 5000);
      
      // Refresh the waitlist count
      fetchWaitlistCount();

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-4xl w-full text-center">
          <div className="space-y-8 md:space-y-12">
            {/* Logo and Brand */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg">
                <Image
                  src="/LADS-LOGO.jpeg"
                  alt="LADS Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-widest uppercase">LADS</h2>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
                The DevOps copilot
                <br />
                <span className="text-black/60">that reads your cloud</span>
          </h1>
              <p className="text-base md:text-xl lg:text-2xl text-black/70 max-w-3xl mx-auto font-light leading-relaxed">
                Returns a visual, step-by-step plan to deploy, configure, or fix anything.
              </p>
            </div>
            
            {/* Glassmorphic Waitlist Form */}
            <div className="pt-2 md:pt-4">
              <div className="max-w-2xl mx-auto relative backdrop-blur-xl bg-white/50 border border-black/10 shadow-2xl p-4 md:p-8 rounded-3xl float-animation glassmorphic-card">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 rounded-3xl pointer-events-none"></div>
                
                {/* Decorative circle element matching logo */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-black/20 to-black/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-black/15 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="relative">
                  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 md:gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={loading}
                      className="flex-1 bg-white/70 backdrop-blur-sm text-black px-5 md:px-8 py-3 md:py-5 text-base md:text-lg focus:outline-none focus:bg-white/90 transition-colors border border-black/10 placeholder:text-black/40 focus:border-black/30 rounded-full shadow-sm hover:shadow-md glassmorphic-input disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={loading || submitted}
                      className="bg-gradient-to-r from-black to-black/90 text-white px-6 md:px-8 py-3 md:py-5 text-base md:text-lg font-medium hover:from-black/90 hover:to-black/80 transition-all duration-200 disabled:from-black/50 disabled:to-black/40 border border-black/20 hover:scale-[1.02] rounded-full shadow-lg hover:shadow-2xl whitespace-nowrap disabled:cursor-not-allowed"
                    >
                      {loading ? 'Joining...' : submitted ? '✓ Joined' : 'Join Waitlist'}
                    </button>
                  </form>
                  
                  {error && (
                    <p className="text-sm text-red-600 mt-3 text-center font-medium">
                      {error}
                    </p>
                  )}
                  
                  {submitted && !error && (
                    <p className="text-sm text-green-600 mt-3 text-center font-medium">
                      🎉 Successfully joined the waitlist!
                    </p>
                  )}
                  
                  {!error && !submitted && (
                    <p className="text-xs text-black/40 mt-3 md:mt-4 text-center">
                      No spam. Launch updates only.
                    </p>
                  )}
                  
                  {/* Waitlist Counter */}
                  {waitlistCount !== null && (
                    <div className="mt-4 pt-4 border-t border-emerald-200/30">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-2.5 bg-emerald-50/80 px-4 py-2.5 rounded-full border border-emerald-200/50">
                          <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span className="text-sm font-medium text-emerald-700">
                            <span className="text-emerald-800 font-semibold">{waitlistCount.toLocaleString()}</span> {waitlistCount === 1 ? 'person' : 'people'} on the waitlist
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="mt-12 md:mt-16 flex justify-center">
              <a
                href="#roadmap"
                className="flex flex-col items-center gap-2 md:gap-3 cursor-pointer group"
                aria-label="Scroll to roadmap"
              >
                <div className="mouse-container">
                  <div className="w-6 h-10 md:w-7 md:h-11 border-2 border-black/30 rounded-full p-1.5 group-hover:border-black/50 transition-colors">
                    <div className="scroll-indicator w-1.5 h-2 bg-black/40 rounded-full mx-auto"></div>
                  </div>
                </div>
                <span className="text-xs text-black/40 font-medium uppercase tracking-wider group-hover:text-black/60 transition-colors">
                  Scroll
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="pt-12 md:pt-16 pb-16 md:pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 md:mb-10 text-center tracking-tight">
            Roadmap
          </h2>
          
          <div className="space-y-5">
            <RoadmapItem
              phase="Phase 1"
              title="MVP"
              features={[
                "Build general LADS capabilities",
                "Natural language → visual step-by-step plans",
                "Preflight checks and interactive visuals",
                "AWS support"
              ]}
              status="In Development"
              isCurrent={true}
              color="blue"
            />
            
            <RoadmapItem
              phase="Phase 2"
              title="Multi-Cloud Expansion"
              features={[
                "Extend LADS to work for Azure and GCP",
                "Cross-cloud compatibility",
                "Unified management interface"
              ]}
              status="Q1 2026"
              isCurrent={false}
              color="red"
            />
            
            <RoadmapItem
              phase="Phase 3"
              title="Advanced Operations"
              features={[
                "Approvals-based Terraform/CloudFormation applies",
                "Drift hygiene management",
                "FinOps: rightsizing, idle resources, RI-SP optimization",
                "Resilience simulations",
                "RBAC, audit logs, Slack/Teams integration"
              ]}
              status="Q2 2026"
              isCurrent={false}
              color="yellow"
            />
            
            <RoadmapItem
              phase="Phase 4"
              title="Simulation Environment"
              features={[
                "Build simulation environment for pre-deployment testing",
                "Simulate any change before applying to cloud",
                "Risk-free experimentation",
                "Impact analysis and predictions"
              ]}
              status="Q3 2026"
              isCurrent={false}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-black/10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-black/50 text-sm">
            © 2025 DevOps Copilot. Building the future of cloud operations.
          </p>
        </div>
      </footer>
    </div>
  );
}

function RoadmapItem({ 
  phase, 
  title, 
  features, 
  status,
  isCurrent,
  color
}: { 
  phase: string; 
  title: string; 
  features: string[]; 
  status: string;
  isCurrent: boolean;
  color: 'blue' | 'red' | 'yellow' | 'green';
}) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      circle: 'bg-blue-600'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      dot: 'bg-red-500',
      circle: 'bg-red-600'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      dot: 'bg-yellow-500',
      circle: 'bg-yellow-600'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500',
      circle: 'bg-green-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div 
      ref={itemRef}
      className={`relative backdrop-blur-lg bg-white/40 border ${isCurrent ? 'border-black/20' : 'border-black/10'} shadow-lg hover:shadow-xl transition-all duration-500 p-6 rounded-2xl group hover:bg-white/50 glassmorphic-card ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
      {/* Status indicator circle */}
      <div className="absolute -left-3 top-8">
        <div className={`w-6 h-6 rounded-full border-4 border-white shadow-md ${isCurrent ? `${colors.circle} blink-bar` : 'bg-black/20'}`}></div>
      </div>
      
      {/* Decorative gradient blur for current item */}
      {isCurrent && (
        <div className="absolute -inset-2 bg-gradient-to-br from-black/5 to-transparent rounded-2xl blur-xl -z-10 pointer-events-none"></div>
      )}
      
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-black/40 mb-2 uppercase tracking-wider">{phase}</p>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          <span className={`inline-block mt-2 md:mt-0 px-3 py-1.5 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
            {status}
          </span>
        </div>
        
        <ul className="space-y-2.5">
          {features.map((feature, idx) => (
            <li key={idx} className="text-sm text-black/70 flex items-start transition-colors">
              <span className={`mr-3 mt-1.5 w-1.5 h-1.5 rounded-full ${colors.dot} flex-shrink-0`}></span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
