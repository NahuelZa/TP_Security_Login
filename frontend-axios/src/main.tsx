import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App.tsx'
import '@/shared/api/setupInterceptors'
import { useThemeStore } from '@/store/themeStore'
import { queryClient } from "@/shared/api/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

const applyTheme = (dark: boolean) =>
  document.documentElement.classList.toggle("dark", dark);

applyTheme(useThemeStore.getState().darkMode);
useThemeStore.subscribe((state) => applyTheme(state.darkMode));
//Quédate vigilando useThemeStore. Cada vez que cambie algo adentro, 
// toma el nuevo valor de darkMode y úsalo para pintar o despintar la 
// página de oscuro

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
