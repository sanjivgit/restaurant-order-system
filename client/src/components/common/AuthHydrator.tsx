"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { hydrateAuth, type AuthUser } from "@/redux/authSlice";
import { Storage } from "@/utils/storage";

const AuthHydrator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await Storage.get<AuthUser>("auth_user");
      dispatch(hydrateAuth(user));
      setReady(true);
    })();
  }, [dispatch]);

  if (!ready) return null;

  return <>{children}</>;
};

export default AuthHydrator;
