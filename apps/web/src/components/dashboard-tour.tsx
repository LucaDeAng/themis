'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TooltipStep {
  id: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  highlightElement?: string;
}

const dashboardSteps: TooltipStep[] = [
  {
    id: 'projects',
    title: '📁 Progetti',
    description: 'Qui puoi creare e gestire i tuoi progetti. Clicca su "Nuovo Progetto" per iniziare.',
    position: 'bottom'
  },
  {
    id: 'initiatives',
    title: '💡 Iniziative',
    description: 'Aggiungi iniziative al tuo progetto o falle generare dall\'AI.',
    position: 'bottom'
  },
  {
    id: 'rankings',
    title: '📊 Rankings',
    description: 'Visualizza il ranking automatico delle iniziative con insights AI.',
    position: 'bottom'
  },
  {
    id: 'briefs',
    title: '📄 Brief',
    description: 'Genera brief esecutivi completi per le tue iniziative prioritarie.',
    position: 'bottom'
  }
];

export function DashboardTour() {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenDashboardTour = localStorage.getItem('themis_dashboard_tour_completed');
    if (!hasSeenDashboardTour) {
      const timer = setTimeout(() => setShowTour(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < dashboardSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('themis_dashboard_tour_completed', 'true');
    setShowTour(false);
  };

  const handleSkip = () => {
    localStorage.setItem('themis_dashboard_tour_completed', 'true');
    setShowTour(false);
  };

  return (
    <AnimatePresence>
      {showTour && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 w-80"
        >
          <Card className="p-4 glass-effect border-2 border-primary/20 shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{dashboardSteps[currentStep].title}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSkip} className="h-6 w-6">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {dashboardSteps[currentStep].description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} di {dashboardSteps.length}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleSkip}>
                  Salta
                </Button>
                <Button size="sm" onClick={handleNext} className="gradient-themis">
                  {currentStep === dashboardSteps.length - 1 ? 'Fine' : 'Avanti'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
