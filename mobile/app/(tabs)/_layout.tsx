import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Scale, Sparkles, LifeBuoy } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useApp } from '../../src/store/appStore';
import { Platform, View, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mist,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.chalk,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 64,
          paddingBottom: Platform.OS === 'ios' ? 26 : 8,
          paddingTop: 8,
          elevation: 6,
          shadowColor: colors.shadowColor,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              <Home size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="legal"
        options={{
          title: t.tabs.legal,
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              <Scale size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: t.tabs.assistant,
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              <Sparkles size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: t.tabs.help,
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              <LifeBuoy size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  inactiveTab: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
