import { useEffect,useState } from "react";
import { useAuthStore } from "@/features/auth";
import { AppRouter } from "@/routes/AppRouter";
import { Toast } from "@/shared/components/Toast";

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [contador, setContador] = useState<number>(0);  

  useEffect(() => {
    void checkAuth();        
  }, [checkAuth]);
  
  useEffect(() => {
    setContador((c) => c + 1);    
  }, [checkAuth]);

  console.log(contador);
   return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}