"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { PriceTag } from "@/components/common/Logo";
import CartItemRow from "@/features/cart/components/CartItemRow";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCart } from "@/redux/cartSlice";
import { useCreateOrder } from "@/features/order/services/order.service";
import { TAX_RATE } from "@/utils/constants";

export default function CartPage({
  params,
}: {
  params: Promise<{ branchId: string; tableId: string }>;
}) {
  const { branchId, tableId } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const dining = useAppSelector((s) => s.context.dining);
  const { mutate: createOrder, isPending } = useCreateOrder();

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const handlePlaceOrder = () => {
    if (!dining || items.length === 0) return;

    createOrder(
      {
        branchId: dining.branchId,
        tableNumber: dining.tableNumber,
        tableId,
        items: items.map((i) => ({ itemId: i.itemId, name: i.name, price: i.price, qty: i.qty })),
      },
      {
        onSuccess: (order) => {
          dispatch(clearCart());
          router.replace(`/r/${branchId}/${tableId}/order/${order.id}`);
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-28">
      <Link href={`/r/${branchId}/${tableId}/menu`} className="inline-flex items-center gap-1.5 text-sm text-base-content/60 mb-4">
        <ArrowLeft className="size-3.5" /> Back to menu
      </Link>

      <h1 className="font-display text-2xl font-semibold mb-4">Your cart</h1>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add a few dishes from the menu to get started."
          icon={<ShoppingCart className="size-6" />}
          action={
            <Link href={`/r/${branchId}/${tableId}/menu`} className="btn btn-primary btn-sm rounded-field">
              Browse menu
            </Link>
          }
        />
      ) : (
        <>
          <div className="rounded-box border border-base-300 divide-y divide-base-300 px-4">
            {items.map((item) => (
              <CartItemRow key={item.itemId} item={item} />
            ))}
          </div>

          <div className="rounded-box border border-base-300 p-4 mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-base-content/60">Subtotal</span>
              <PriceTag amount={subtotal} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-base-content/60">Tax (5%)</span>
              <PriceTag amount={tax} />
            </div>
            <div className="dashed-divider pt-2 flex items-center justify-between">
              <span className="font-medium">Grand total</span>
              <PriceTag amount={total} className="text-lg font-semibold" />
            </div>
          </div>

          <p className="text-xs text-base-content/50 mt-3">
            No online payment needed — settle your bill at the counter or with your server after the meal.
          </p>

          <div className="fixed bottom-0 left-0 right-0 no-print">
            <div className="max-w-3xl mx-auto px-4 pb-4">
              <Button fullWidth size="lg" isLoading={isPending} onClick={handlePlaceOrder}>
                Place order
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
