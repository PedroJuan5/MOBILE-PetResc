import React from 'react';
import { Slot } from 'expo-router';

export default function OngLayout() {
  // Slot é um buraco invisível. Ele não desenha barras, 
  // só deixa passar o que vem da pasta (tabs).
  return <Slot />;
}