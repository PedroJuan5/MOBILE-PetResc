import React from "react";
import { Stack } from 'expo-router/stack';
import { useAuth } from '../context/AuthContext'; 
import CustomHeaderLeft from "../components/elementosEsquerda";
import CustomHeaderRight from "../components/elementosDireita";

export default function AppLayout() {
  const { session } = useAuth();
  if (!session) return null;
  return ( <Stack> ... </Stack> ); // O resto do seu código aqui
}