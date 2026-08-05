import Link from "next/link";
import { QrCode, UserRound, ShieldCheck, ArrowRight } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { db } from "@/utils/mock/db";

const DEMO_TABLES = ["T-01", "T-04", "T-07"];

export default function Home() {
  const branch = db.branches[0];

  return (
    <div className="min-h-screen bg-base-100">
      <header className="max-w-4xl mx-auto px-5 py-6 flex items-center justify-between">
        <Logo />
        <span className="font-mono text-xs text-base-content/40">MVP demo</span>
      </header>

      <main className="max-w-4xl mx-auto px-5 pb-20">
        <section className="pt-8 pb-12 border-b border-base-300">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
            {db.restaurant.name}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-tight max-w-xl">
            Order from the table. Track it to the kitchen. Close the bill.
          </h1>
          <p className="mt-4 text-base-content/60 max-w-md">
            This is the demo entry point — in production, each of these cards is what a
            diner's QR code, a waiter's login, and an owner's dashboard resolve to.
          </p>
        </section>

        <section className="py-10">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="size-4 text-primary" />
            <h2 className="font-display font-semibold">Scan a table — customer</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {DEMO_TABLES.map((table) => (
              <Link
                key={table}
                href={`/r/${branch.id}/${table}/menu`}
                className="group rounded-box border border-base-300 p-5 hover:border-primary transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-base-content/50">{branch.name}</p>
                  <p className="font-mono text-xl font-semibold">{table}</p>
                </div>
                <ArrowRight className="size-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        <section className="py-10 border-t border-base-300 grid sm:grid-cols-2 gap-4">
          <Link
            href="/employee/login"
            className="group rounded-box border border-base-300 p-6 hover:border-primary transition-colors"
          >
            <UserRound className="size-5 text-primary mb-3" />
            <h3 className="font-display font-semibold mb-1">Employee</h3>
            <p className="text-sm text-base-content/60 mb-3">
              View live orders and move them through the kitchen.
            </p>
            <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
              Log in <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            href="/admin/login"
            className="group rounded-box border border-base-300 p-6 hover:border-primary transition-colors"
          >
            <ShieldCheck className="size-5 text-primary mb-3" />
            <h3 className="font-display font-semibold mb-1">Admin</h3>
            <p className="text-sm text-base-content/60 mb-3">
              Manage branches, staff, menu, and every order.
            </p>
            <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
              Log in <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
