"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import { MenuCardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/Spinner";
import { PriceTag } from "@/components/common/Logo";
import CategoryTabs from "@/features/menu/components/CategoryTabs";
import MenuItemCard from "@/features/menu/components/MenuItemCard";
import { useGetCategories, useGetItems } from "@/features/menu/services/menu.service";
import { useAppSelector } from "@/redux/hooks";

export default function MenuPage({
  params,
}: {
  params: Promise<{ branchId: string; tableId: string }>;
}) {
  const { branchId, tableId } = use(params);
  const dining = useAppSelector((s) => s.context.dining);
  const cartItems = useAppSelector((s) => s.cart.items);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: categories } = useGetCategories(dining?.branchId);
  const {
    data: items,
    isLoading,
    isError,
    refetch,
  } = useGetItems({ branchId: dining?.branchId, categoryId: activeCategory ?? undefined, search: search || undefined });

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-28">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-semibold">Menu</h1>
        <p className="text-sm text-base-content/50">Fresh off the tandoor, made to order.</p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search dishes…" className="mb-4" />

      <CategoryTabs categories={categories ?? []} activeId={activeCategory} onChange={setActiveCategory} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <MenuCardSkeleton key={i} />)}

        {!isLoading && items?.map((item) => <MenuItemCard key={item.id} item={item} />)}
      </div>

      {isError && (
        <ErrorState
          title="Menu didn't load"
          description="Something went wrong fetching today's menu."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && items?.length === 0 && (
        <EmptyState
          title="No dishes found"
          description="Try a different search or category."
          icon={<ShoppingBag className="size-6" />}
        />
      )}

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 no-print">
          <div className="max-w-3xl mx-auto px-4 pb-4">
            <Link
              href={`/r/${branchId}/${tableId}/cart`}
              className="btn btn-primary w-full rounded-field h-14 shadow-lg flex items-center justify-between px-5"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <ShoppingBag className="size-4" />
                {cartCount} item{cartCount > 1 ? "s" : ""} added
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                View cart <PriceTag amount={cartTotal} className="font-semibold" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
