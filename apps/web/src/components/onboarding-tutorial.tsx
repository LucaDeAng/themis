'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  FolderKanban,
  Lightbulb,
  BarChart3,
  FileText,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ElementType;
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Benvenuto in Themis! 🎉',
    description: 'Themis è il tuo assistente AI per la prioritizzazione delle iniziative. Ti guideremo attraverso le funzionalità principali in 5 semplici passaggi.',
    icon: Sparkles,
    action: 'Iniziamo!'
  },
  {
    title: '1. Progetti',
    description: 'Crea un nuovo progetto per definire i tuoi obiettivi strategici, criteri di valutazione e soglie minime. Ogni progetto può contenere multiple iniziative da valutare.',
    icon: FolderKanban,
    action: 'Vai ai Progetti'
  },
  {
    title: '2. Iniziative',
    description: 'Aggiungi iniziative manualmente, importale da Excel, oppure lascia che l\'AI le generi automaticamente basandosi sul contesto del tuo progetto. L\'AI può suggerirti 10-15 idee in pochi secondi!',
    icon: Lightbulb,
    action: 'Esplora Iniziative'
  },
  {
    title: '3. Ranking Intelligente',
    description: 'Visualizza il ranking automatico delle iniziative basato sui punteggi pesati. L\'AI analizza i dati e fornisce insights come correlazioni, sinergie e bilanciamento del portfolio.',
    icon: BarChart3,
    action: 'Vedi Rankings'
  },
  {
    title: '4. Brief Automatici',
    description: 'Per ogni iniziativa prioritaria, l\'AI genera un brief esecutivo completo con executive summary, rationale strategico, impatti business, piano implementazione e KPI di successo.',
    icon: FileText,
    action: 'Genera Brief'
  },
  {
    title: 'Pronto a Iniziare! 🚀',
    description: 'Hai completato il tutorial! Ora sei pronto a trasformare il tuo processo decisionale. Inizia creando il tuo primo progetto o esplora i progetti demo.',
    icon: Zap,
    action: 'Vai alla Dashboard'
  }
];

export function OnboardingTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial
    const seen = localStorage.getItem('themis_tutorial_completed');
    setHasSeenTutorial(seen === 'true');
    
    // Auto-open tutorial after 1 second if not seen
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('themis_tutorial_completed', 'true');
    setIsOpen(false);
    setHasSeenTutorial(true);
  };

  const handleSkip = () => {
    localStorage.setItem('themis_tutorial_completed', 'true');
    setIsOpen(false);
    setHasSeenTutorial(true);
  };

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  const currentStepData = tutorialSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <>
      {/* Floating help button to reopen tutorial */}
      {hasSeenTutorial && !isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg gradient-themis glow-effect"
          >
            <Sparkles className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {/* Tutorial overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleSkip()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl"
            >
              <Card className="p-8 glass-effect border-2 border-primary/20">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        Passo {currentStep + 1} di {tutorialSteps.length}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSkip}
                    className="hover:bg-muted"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Content */}
                <div className="mb-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Visual indicator */}
                <div className="flex justify-center mb-8">
                  <div className="flex gap-2">
                    {tutorialSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'bg-primary w-8'
                            : index < currentStep
                            ? 'bg-primary/50'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="min-w-[100px]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Indietro
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Salta Tutorial
                  </Button>

                  <Button
                    onClick={handleNext}
                    className="min-w-[100px] gradient-themis glow-effect"
                  >
                    {currentStep === tutorialSteps.length - 1 ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Completa
                      </>
                    ) : (
                      <>
                        Avanti
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Skip all hint */}
                {currentStep === 0 && (
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Puoi cliccare fuori dalla finestra per chiudere il tutorial
                  </p>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
