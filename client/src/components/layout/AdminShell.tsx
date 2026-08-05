"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  FolderTree,
  UtensilsCrossed,
  ClipboardList,
  LogOut,
  Menu as MenuIcon,
  ChevronDown,
  Grid2x2,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import Avatar from "@/components/ui/Avatar";
import Drawer from "@/components/ui/Drawer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/authSlice";
import { setActiveBranch } from "@/redux/contextSlice";
import { useGetBranches } from "@/features/branch/services/branch.service";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/menu/categories", label: "Menu Categories", icon: FolderTree },
  { href: "/admin/menu/items", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/tables", label: "Tables", icon: Grid2x2 },
  { href: "/admin/branches", label: "Branches", icon: Building2 },
];

const SidebarContent: React.FC<{ pathname: string; onNavigate?: () => void }> = ({ pathname, onNavigate }) => (
  <nav className="flex flex-col gap-1 p-3">
    {NAV_ITEMS.map((item) => {
      const active = pathname.startsWith(item.href);
      const Icon = item.icon;
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-field text-sm font-medium transition-colors",
            active ? "bg-primary text-primary-content" : "text-base-content/70 hover:bg-base-200"
          )}
        >
          <Icon className="size-4" />
          {item.label}
        </Link>
      );
    })}
  </nav>
);

const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector((s) => s.auth.user);
  const activeBranch = useAppSelector((s) => s.context.activeBranch);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const { data: branches } = useGetBranches();

  useEffect(() => {
    if (!activeBranch && branches?.length) {
      dispatch(setActiveBranch({ id: branches[0].id, name: branches[0].name }));
    }
  }, [branches, activeBranch, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-base-300 bg-base-100 min-h-screen sticky top-0">
        <div className="px-4 py-4 border-b border-base-300">
          <Logo />
        </div>
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      <Drawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} title="Menu" side="left">
        <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-base-100 border-b border-base-300">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost btn-sm btn-circle lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="size-5" />
              </button>

              <div className="relative">
                <button
                  className="btn btn-outline btn-sm rounded-field gap-1.5"
                  onClick={() => setBranchMenuOpen((v) => !v)}
                >
                  <Building2 className="size-3.5" />
                  {activeBranch?.name || "Select branch"}
                  <ChevronDown className="size-3.5" />
                </button>
                {branchMenuOpen && (
                  <div className="absolute left-0 mt-1 w-48 rounded-field border border-base-300 bg-base-100 shadow-lg z-20 overflow-hidden">
                    {branches?.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          dispatch(setActiveBranch({ id: b.id, name: b.name }));
                          setBranchMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-base-200",
                          activeBranch?.id === b.id && "bg-base-200 font-medium"
                        )}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-tight">{user?.name}</p>
                <p className="text-xs text-base-content/50 leading-none">Administrator</p>
              </div>
              <Avatar name={user?.name || ""} size="sm" />
              <button onClick={handleLogout} className="btn btn-ghost btn-sm btn-circle" aria-label="Log out">
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminShell;
