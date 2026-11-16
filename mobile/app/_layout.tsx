import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/store/appStore';
import { SosModal } from '../src/components/SosModal';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
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
          <Stack.Screen name="onboarding/index" options={{ presentation: 'card', headerShown: false }} />
          <Stack.Screen name="profile/index" options={{ presentation: 'card', headerShown: false }} />
        </Stack>
        <SosModal />
      </AppProvider>
    </SafeAreaProvider>
  );
}
