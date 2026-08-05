"use client";

import Link from "next/link";
import { ReceiptText, ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { Logo } from "@/components/common/Logo";

const CustomerHeader: React.FC<{ baseHref: string; branchName: string; tableNumber: string }> = ({
  baseHref,
  branchName,
  tableNumber,
}) => {
  const items = useAppSelector((s) => s.cart.items);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 bg-base-100/90 backdrop-blur border-b border-base-300">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`${baseHref}/menu`}>
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-base-content/50 leading-none">{branchName}</p>
            <p className="text-sm font-medium font-mono leading-tight">Table {tableNumber}</p>
          </div>
          <Link
            href={`${baseHref}/orders`}
            className="btn btn-ghost btn-circle"
            aria-label="My orders"
            title="My orders"
          >
            <ReceiptText className="size-5" />
          </Link>
          <Link href={`${baseHref}/cart`} className="btn btn-primary btn-circle relative" aria-label="View cart">
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 size-5 rounded-full bg-secondary text-secondary-content text-[11px] font-semibold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
