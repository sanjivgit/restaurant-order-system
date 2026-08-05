"use client";

import { LogOut } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import Avatar from "@/components/ui/Avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/authSlice";
import { useRouter } from "next/navigation";

const EmployeeShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/employee/login");
  };

  return (
    <div className="min-h-screen bg-base-200">
      <header className="sticky top-0 z-40 bg-base-100 border-b border-base-300">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-base-content/50 leading-none">Waitstaff</p>
            </div>
            <Avatar name={user?.name || ""} size="sm" />
            <button onClick={handleLogout} className="btn btn-ghost btn-sm btn-circle" aria-label="Log out">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default EmployeeShell;
