import { createClient, Session } from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export const supabase = createClient(
  "https://tvebpombyrycqnatueeq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWJwb21ieXJ5Y3FuYXR1ZWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTczMDEsImV4cCI6MjA2NjA5MzMwMX0.jaHzfMQwZAjvkotbQBzrU6lgwCAqHVU0hnLguISb22k"
);

const AuthContext = createContext({
  session: null as Session | null,
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};

const useAuthCtx = () => useContext(AuthContext);

export { AuthProvider, useAuthCtx };
