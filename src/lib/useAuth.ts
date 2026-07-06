import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "./api";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authed = isAuthenticated();
      setAuth(authed);
      setLoading(false);
      if (!authed) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return { loading, isAuthenticated: auth };
}
