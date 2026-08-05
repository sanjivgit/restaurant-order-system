"use client";

import AuthHydrator from "@/components/common/AuthHydrator";
import RoleGuard from "@/components/common/RoleGuard";
import EmployeeShell from "@/components/layout/EmployeeShell";

export default function EmployeeAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthHydrator>
      <RoleGuard role="EMPLOYEE" loginPath="/employee/login">
        <EmployeeShell>{children}</EmployeeShell>
      </RoleGuard>
    </AuthHydrator>
  );
}
