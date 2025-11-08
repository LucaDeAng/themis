'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Rocket, 
  FolderKanban, 
  Lightbulb, 
  BarChart3, 
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const steps = [
  {
    number: 1,
    title: 'Crea un Progetto',
    description: 'Definisci obiettivi strategici, criteri di valutazione e pesi. Ogni progetto è un contenitore per le tue iniziative.',
    icon: FolderKanban,
    href: '/dashboard/projects',
    action: 'Vai ai Progetti',
    color: 'from-blue-500 to-cyan-500',
    estimatedTime: '5 min'
  },
  {
    number: 2,
    title: 'Aggiungi Iniziative',
    description: 'Inserisci iniziative manualmente, importale da file, o lascia che l\'AI le generi automaticamente dal contesto.',
    icon: Lightbulb,
    href: '/dashboard/initiatives',
    action: 'Gestisci Iniziative',
    color: 'from-purple-500 to-pink-500',
    estimatedTime: '10 min'
  },
  {
    number: 3,
    title: 'Valuta e Classifica',
    description: 'Assegna punteggi su ogni criterio. Il sistema calcola automaticamente il ranking pesato con insights AI.',
    icon: BarChart3,
    href: '/dashboard/rankings',
    action: 'Vedi Rankings',
    color: 'from-orange-500 to-red-500',
    estimatedTime: '15 min'
  },
  {
    number: 4,
    title: 'Genera Brief',
    description: 'L\'AI crea brief esecutivi completi per le iniziative top-ranked con rationale, impatti e metriche di successo.',
    icon: FileText,
    href: '/dashboard/briefs',
    action: 'Crea Brief',
    color: 'from-green-500 to-emerald-500',
    estimatedTime: '30 sec'
  }
];

const features = [
  'AI generativa per ideazione iniziative',
  'Scoring multi-criterio pesato',
  'Ranking automatico real-time',
  'Insights e raccomandazioni AI',
  'Export Excel/PDF',
  'Audit trail completo'
];

export default function QuickStartPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Inizia in 4 semplici passi</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold">
          Quick Start Guide
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Segui questa guida per creare il tuo primo progetto di prioritizzazione
          e scoprire il potere dell'AI decisionale
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="gradient-themis glow-effect">
              <PlayCircle className="w-5 h-5 mr-2" />
              Inizia Ora
            </Button>
          </Link>
          <Button size="lg" variant="outline" asChild>
            <a href="#steps">Vedi i Passi</a>
          </Button>
        </div>
      </motion.div>

      {/* Steps */}
      <div id="steps" className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-xl transition-all glass-effect border-l-4 border-l-primary">
              <div className="flex items-start gap-6">
                {/* Number Badge */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold">{step.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {step.estimatedTime}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    <step.icon className="w-8 h-8 text-primary flex-shrink-0" />
                  </div>

                  <Link href={step.href}>
                    <Button className="gradient-themis group">
                      {step.action}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-8"
      >
        <Card className="p-8 glass-effect">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Cosa puoi fare con Themis
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Video Tutorial Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-8 glass-effect border-2 border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-2xl font-bold">Video Tutorial (Coming Soon)</h3>
              <p className="text-muted-foreground">
                Guarda il video tutorial completo per vedere Themis in azione.
                Imparerai come creare progetti, generare iniziative con AI,
                assegnare punteggi e ottenere insights actionable.
              </p>
              <Button variant="outline" disabled>
                <PlayCircle className="w-4 h-4 mr-2" />
                Guarda Tutorial (Prossimamente)
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <Card className="p-8 gradient-themis glow-effect text-white">
          <Rocket className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">
            Pronto a Trasformare le Tue Decisioni?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Inizia ora a usare Themis per prioritizzare le tue iniziative
            in modo oggettivo, veloce e data-driven.
          </p>
          <Link href="/dashboard/projects">
            <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
              <FolderKanban className="w-5 h-5 mr-2" />
              Crea il Tuo Primo Progetto
            </Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}
