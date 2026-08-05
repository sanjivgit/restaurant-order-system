"use client";

import AuthHydrator from "@/components/common/AuthHydrator";
import RoleGuard from "@/components/common/RoleGuard";
import AdminShell from "@/components/layout/AdminShell";

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthHydrator>
      <RoleGuard role="ADMIN" loginPath="/admin/login">
        <AdminShell>{children}</AdminShell>
      </RoleGuard>
    </AuthHydrator>
  );
}
