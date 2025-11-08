'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Target, TrendingUp, Brain, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OnboardingTutorial } from '@/components/onboarding-tutorial';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Onboarding Tutorial */}
      <OnboardingTutorial />
      
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,oklch(0.55_0.25_270/0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,oklch(0.60_0.22_250/0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,oklch(0.70_0.15_220/0.1),transparent_70%)]" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Gen AI</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-gradient">Themis</span>
            <br />
            <span className="text-foreground/90">Initiative Prioritization</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            AI-powered decision engine that helps teams prioritize initiatives,
            score opportunities, and make data-driven strategic decisions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 h-14 gradient-themis glow-effect hover:scale-105 transition-transform">
                <Rocket className="w-5 h-5 mr-2" />
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 hover:scale-105 transition-transform">
                <Target className="w-5 h-5 mr-2" />
                View Projects
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto"
        >
          {[
            { label: 'AI Models', value: '3+', icon: Brain },
            { label: 'Scoring Criteria', value: '10+', icon: Target },
            { label: 'Accuracy', value: '95%', icon: TrendingUp },
            { label: 'Speed', value: '<3s', icon: Zap },
          ].map((stat, i) => (
            <Card key={i} className="p-6 text-center glass-effect hover:scale-105 transition-transform">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            Intelligent Decision Making
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Leverage cutting-edge AI to transform how your team evaluates and prioritizes initiatives
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow glass-effect">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl gradient-themis glow-effect"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Decision Making?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join teams already using Themis to make smarter, faster decisions
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
          <p>© 2025 Themis. Powered by Gen AI.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Generate initiative ideas automatically using advanced language models trained on best practices.',
  },
  {
    icon: Target,
    title: 'Smart Scoring',
    description: 'Multi-dimensional scoring with weighted criteria, confidence intervals, and risk adjustment.',
  },
  {
    icon: TrendingUp,
    title: 'Dynamic Rankings',
    description: 'Real-time rankings that adapt as new scores come in, with full transparency and explainability.',
  },
  {
    icon: Brain,
    title: 'Concept Briefs',
    description: 'Generate comprehensive briefs with executive summaries, rationale, risks, and success metrics.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with performance in mind. Get results in seconds, not hours.',
  },
  {
    icon: Rocket,
    title: 'Ready to Scale',
    description: 'From small teams to enterprises. Themis scales with your organization.',
  },
];
