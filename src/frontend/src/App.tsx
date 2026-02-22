import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';
import { I18nProvider } from './lib/i18n';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppHeader from './components/AppHeader';
import PlannerForm from './components/PlannerForm';
import DiscoveryPanel from './components/DiscoveryPanel';
import RecommendationsPanel from './components/RecommendationsPanel';
import ExportPanel from './components/ExportPanel';
import PastSchedulesDrawer from './components/PastSchedulesDrawer';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import type { Item, Shop } from './backend';
import type { ShopResult } from './lib/providers/placesProviders';

export interface PlannerState {
  location: string;
  latitude?: number;
  longitude?: number;
  preferredDateTime: Date;
  budget: number;
  items: Item[];
  itemPriceOverrides: Record<string, number>;
  notes: string;
}

function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const [plannerState, setPlannerState] = useState<PlannerState>({
    location: '',
    preferredDateTime: new Date(Date.now() + 3600000),
    budget: 1000,
    items: [],
    itemPriceOverrides: {},
    notes: '',
  });

  const [discoveredShops, setDiscoveredShops] = useState<ShopResult[]>([]);
  const [selectedShop, setSelectedShop] = useState<ShopResult | null>(null);
  const [showPastSchedules, setShowPastSchedules] = useState(false);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        <div className="min-h-screen bg-background">
          <AppHeader />
          
          <main className="container mx-auto px-4 py-6 max-w-6xl">
            {!isAuthenticated ? (
              <div className="text-center py-16">
                <div className="mb-8">
                  <img 
                    src="/assets/generated/hero-grocery-run.dim_1600x600.png" 
                    alt="Grocery Shopping" 
                    className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
                  />
                </div>
                <h1 className="text-4xl font-bold mb-4">Welcome to Smart Shopping Planner</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Plan your grocery shopping with nearby store discovery, smart scheduling, and budget tracking
                </p>
                <p className="text-lg text-muted-foreground">
                  Please log in to start planning your shopping trips
                </p>
              </div>
            ) : isInitializing || profileLoading ? (
              <div className="text-center py-16">
                <p className="text-lg">Loading...</p>
              </div>
            ) : (
              <>
                <ProfileSetupDialog open={showProfileSetup} />
                
                <div className="space-y-6">
                  <PlannerForm 
                    state={plannerState}
                    onChange={setPlannerState}
                    onShowPastSchedules={() => setShowPastSchedules(true)}
                  />

                  <DiscoveryPanel
                    plannerState={plannerState}
                    onShopsDiscovered={setDiscoveredShops}
                    discoveredShops={discoveredShops}
                    selectedShop={selectedShop}
                    onSelectShop={setSelectedShop}
                  />

                  {discoveredShops.length > 0 && (
                    <RecommendationsPanel
                      shops={discoveredShops}
                      preferredDateTime={plannerState.preferredDateTime}
                      onSelectShop={setSelectedShop}
                      selectedShop={selectedShop}
                    />
                  )}

                  {selectedShop && (
                    <ExportPanel
                      plannerState={plannerState}
                      selectedShop={selectedShop}
                      onNotesChange={(notes) => setPlannerState(prev => ({ ...prev, notes }))}
                      onPriceOverridesChange={(overrides) => 
                        setPlannerState(prev => ({ ...prev, itemPriceOverrides: overrides }))
                      }
                    />
                  )}
                </div>

                <PastSchedulesDrawer
                  open={showPastSchedules}
                  onClose={() => setShowPastSchedules(false)}
                  onCloneSchedule={(schedule) => {
                    setPlannerState({
                      location: schedule.location,
                      preferredDateTime: new Date(Number(schedule.preferredDateTime) / 1000000),
                      budget: Number(schedule.budget),
                      items: schedule.items,
                      itemPriceOverrides: {},
                      notes: '',
                    });
                    setDiscoveredShops([]);
                    setSelectedShop(null);
                    setShowPastSchedules(false);
                  }}
                />
              </>
            )}
          </main>

          <footer className="border-t mt-16 py-8">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>© 2026. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">caffeine.ai</a></p>
            </div>
          </footer>

          <Toaster />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
