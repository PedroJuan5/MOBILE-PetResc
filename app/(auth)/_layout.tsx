// Arquivo: app/(auth)/_layout.tsx (ESTÁ PERFEITO)
import React from 'react';
import { Stack } from 'expo-router/stack';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}