import React, { useEffect, useState } from 'react';
import { Modal, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { PawProvider, usePaw } from './store/app';
import { t } from './lib/i18n';
import { PawText } from './components/PawText';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { PetsScreen } from './screens/PetsScreen';
import { DosesScreen } from './screens/DosesScreen';
import { RecordsScreen } from './screens/RecordsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import { AddPetModal } from './screens/AddPetModal';
import { PetDetailModal } from './screens/PetDetailModal';
import { AddMedicationModal } from './screens/AddMedicationModal';
import { AddWeightModal } from './screens/AddWeightModal';
import { AddVisitModal } from './screens/AddVisitModal';
import { AddVaccineModal } from './screens/AddVaccineModal';
import { PrepSheetModal } from './screens/PrepSheetModal';
import { initBilling, closeBilling } from './lib/billing';
import { rescheduleDoseReminders } from './lib/notifications';
import type { RootTabParamList } from './navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Pets: '🐾',
  Doses: '💊',
  Records: '🩺',
  Stats: '📊',
  Profile: '👤',
};

type ModalKind =
  | { kind: 'none' }
  | { kind: 'paywall' }
  | { kind: 'addPet' }
  | { kind: 'petDetail'; petId: string }
  | { kind: 'addMedication'; petId: string }
  | { kind: 'addWeight'; petId: string }
  | { kind: 'addVisit'; petId: string }
  | { kind: 'addVaccine'; petId: string }
  | { kind: 'prepSheet'; petId: string };

function Tabs() {
  const { colors } = useTheme();
  const { pets, isPro } = usePaw();
  const [modal, setModal] = useState<ModalKind>({ kind: 'none' });
  const strings = t();
  const close = () => setModal({ kind: 'none' });

  const addMedicationFor = (petId?: string) => {
    const target = petId ?? pets[0]?.id;
    if (!target) {
      setModal({ kind: 'addPet' });
      return;
    }
    setModal({ kind: 'addMedication', petId: target });
  };

  const openPrepSheet = (petId: string) =>
    setModal(isPro ? { kind: 'prepSheet', petId } : { kind: 'paywall' });

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
          // Emoji tab glyphs keep v1 dependency-free (no icon font).
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <PawText style={{ fontSize: 22, color }}>{TAB_ICONS[route.name]}</PawText>
          ),
        })}
      >
        <Tab.Screen name="Pets" options={{ tabBarLabel: strings.tabPets }}>
          {() => (
            <PetsScreen
              onAddPet={() => setModal({ kind: 'addPet' })}
              onOpenPet={(petId) => setModal({ kind: 'petDetail', petId })}
              onOpenPaywall={() => setModal({ kind: 'paywall' })}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Doses" options={{ tabBarLabel: strings.tabDoses }}>
          {() => <DosesScreen onAddMedication={() => addMedicationFor()} />}
        </Tab.Screen>
        <Tab.Screen name="Records" options={{ tabBarLabel: strings.tabRecords }}>
          {() => (
            <RecordsScreen
              onAddPet={() => setModal({ kind: 'addPet' })}
              onAddVaccine={(petId) => setModal({ kind: 'addVaccine', petId })}
              onAddVisit={(petId) => setModal({ kind: 'addVisit', petId })}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Stats" options={{ tabBarLabel: strings.tabStats }}>
          {() => <StatsScreen onAddMedication={() => addMedicationFor()} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" options={{ tabBarLabel: strings.tabProfile }}>
          {() => <ProfileScreen onOpenPaywall={() => setModal({ kind: 'paywall' })} />}
        </Tab.Screen>
      </Tab.Navigator>

      <Modal visible={modal.kind !== 'none'} animationType="slide" onRequestClose={close}>
        {modal.kind === 'paywall' && <PaywallScreen onClose={close} />}
        {modal.kind === 'addPet' && <AddPetModal onClose={close} onDone={(petId) => setModal({ kind: 'petDetail', petId })} />}
        {modal.kind === 'petDetail' && (
          <PetDetailModal
            petId={modal.petId}
            onClose={close}
            onAddMedication={(petId) => setModal({ kind: 'addMedication', petId })}
            onAddWeight={(petId) => setModal({ kind: 'addWeight', petId })}
            onPrepSheet={openPrepSheet}
          />
        )}
        {modal.kind === 'addMedication' && <AddMedicationModal petId={modal.petId} onClose={close} />}
        {modal.kind === 'addWeight' && <AddWeightModal petId={modal.petId} onClose={close} />}
        {modal.kind === 'addVisit' && <AddVisitModal petId={modal.petId} onClose={close} />}
        {modal.kind === 'addVaccine' && <AddVaccineModal petId={modal.petId} onClose={close} />}
        {modal.kind === 'prepSheet' && <PrepSheetModal petId={modal.petId} onClose={close} />}
      </Modal>
    </>
  );
}

// Keeps local dose reminders in sync with the med list and language.
function ReminderSync() {
  const { meds, pets, lang, hydrated } = usePaw();
  useEffect(() => {
    if (!hydrated) return;
    const strings = t();
    void rescheduleDoseReminders(meds, pets, {
      title: strings.appName,
      body: (petName, medName, dose) => `${medName}${dose ? ` (${dose})` : ''} — ${petName}`,
    });
  }, [meds, pets, lang, hydrated]);
  return null;
}

function Shell() {
  const { isDark } = useTheme();
  const { onboarded, setPro, hydrated } = usePaw();

  useEffect(() => {
    if (!hydrated) return;
    void initBilling(() => setPro(true));
    return () => closeBilling();
  }, [hydrated, setPro]);

  if (!hydrated || !onboarded) {
    // ponytail: onboarding doubles as the splash — no separate loading screen.
    return hydrated && !onboarded ? <OnboardingScreen /> : null;
  }

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ReminderSync />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Tabs />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PawProvider>
          <Shell />
        </PawProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
