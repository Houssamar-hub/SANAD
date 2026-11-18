import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '../src/store/appStore';
import { SosModal } from '../src/components/SosModal';
import { CamouflageCookingView } from '../src/components/CamouflageCookingView';
import { colors } from '../src/theme/colors';

function AppContent() {
  const { isCamouflaged } = useApp();

  if (isCamouflaged) {
    return (
      <>
        <StatusBar style="dark" />
        <CamouflageCookingView />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.parchment }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="legal/[id]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="quiz/index" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="prevention/index" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="safety/plan" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="evidence/index" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="empowerment/index" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="shelters/index" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="admin/index" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="onboarding/index" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ presentation: 'card', headerShown: false }} />
      </Stack>
      <SosModal />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
