'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Database,
  Shield,
  Sparkles,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const handleResetTutorial = () => {
    localStorage.removeItem('themis_tutorial_completed');
    localStorage.removeItem('themis_dashboard_tour_completed');
    window.location.href = '/';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" />
            Impostazioni
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestisci le tue preferenze e configurazioni
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profilo
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifiche
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aspetto
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Dati
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informazioni Profilo
            </h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Mario Rossi" defaultValue="User" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="mario.rossi@example.com" defaultValue="user@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Azienda</Label>
                <Input id="company" placeholder="Accenture" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Ruolo</Label>
                <Input id="role" placeholder="Product Manager" />
              </div>
              <Button className="gradient-themis">Salva Modifiche</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Sicurezza
            </h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Nuova Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm">Conferma Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline">Aggiorna Password</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Preferenze Notifiche
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifiche Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Ricevi email per aggiornamenti importanti
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nuove Iniziative</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifica quando vengono create nuove iniziative
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ranking Aggiornato</Label>
                  <p className="text-sm text-muted-foreground">
                    Avviso quando il ranking viene ricalcolato
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Brief Generati</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifica quando un brief AI viene completato
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Report Settimanale</Label>
                  <p className="text-sm text-muted-foreground">
                    Ricevi un riepilogo delle attività ogni settimana
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Aspetto Interfaccia
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema Scuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Usa tema scuro per ridurre l&apos;affaticamento visivo
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animazioni</Label>
                  <p className="text-sm text-muted-foreground">
                    Abilita animazioni e transizioni fluide
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modalità Compatta</Label>
                  <p className="text-sm text-muted-foreground">
                    Riduci spaziature per mostrare più contenuti
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Tutorial e Guide</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Ripristina i tutorial per rivederli dall&apos;inizio
                </p>
                <Button variant="outline" onClick={handleResetTutorial}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ripristina Tutorial
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Configurazione AI
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Provider AI</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Seleziona il provider per la generazione AI
                </p>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start">
                    OpenAI GPT-4 (Consigliato)
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Anthropic Claude 3
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Ollama (Locale)
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-generazione Suggerimenti</Label>
                  <p className="text-sm text-muted-foreground">
                    L&apos;AI suggerisce automaticamente iniziative
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Insights AI nel Ranking</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostra analisi e raccomandazioni AI
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Generazione Brief Automatica</Label>
                  <p className="text-sm text-muted-foreground">
                    Genera brief quando un&apos;iniziativa è classificata
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">AI Premium</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Sblocca modelli AI avanzati, fine-tuning personalizzato e generazione batch.
                </p>
                <Button size="sm" className="gradient-themis">
                  Upgrade a Premium
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Data Settings */}
        <TabsContent value="data" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Gestione Dati
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Esporta i Tuoi Dati</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Scarica tutti i tuoi progetti, iniziative e ranking in formato JSON
                </p>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Esporta Dati
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Importa Dati</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Carica dati da file Excel, CSV o JSON
                </p>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importa Dati
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-destructive">Zona Pericolosa</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Elimina tutti i tuoi dati in modo permanente
                </p>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Elimina Tutti i Dati
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & GDPR
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics Anonimi</Label>
                    <p className="text-sm text-muted-foreground">
                      Aiutaci a migliorare Themis condividendo dati anonimi d&apos;uso
                    </p>
                  </div>
                  <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Conformità GDPR</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  I tuoi dati sono protetti secondo le normative GDPR europee
                </p>
                <Button variant="outline" size="sm">
                  Leggi Privacy Policy
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
