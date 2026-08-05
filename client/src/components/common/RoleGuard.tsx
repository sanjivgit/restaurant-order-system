"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import type { UserRole } from "@/redux/authSlice";
import Spinner from "@/components/ui/Spinner";

const RoleGuard: React.FC<{ role: UserRole; loginPath: string; children: React.ReactNode }> = ({
  role,
  loginPath,
  children,
}) => {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== role) {
      router.replace(loginPath);
    }
  }, [user, role, loginPath, router]);

  if (!user || user.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <Spinner label="Checking your session…" />
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
