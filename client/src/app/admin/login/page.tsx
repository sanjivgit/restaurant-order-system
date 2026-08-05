import { Logo } from "@/components/common/Logo";
import LoginForm from "@/features/auth/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-sm rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo showName={false} className="mb-3" />
          <h1 className="font-display text-xl font-semibold">Admin login</h1>
          <p className="text-sm text-base-content/50 mt-1">Manage branches, staff, menu and orders.</p>
        </div>
        <LoginForm role="ADMIN" redirectTo="/admin/dashboard" demoHint="Demo: admin@demo-restaurant.com / Admin@123" />
      </div>
    </div>
  );
}
