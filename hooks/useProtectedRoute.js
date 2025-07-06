import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../app/context/authcontext";

export const useProtectedRoute = () => {
  const { token, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/login");
    }
  }, [authLoading, token]);

  return { authLoading };
};
