"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, ImageOff } from "lucide-react";
import type { CartItem } from "@/redux/cartSlice";
import VegBadge from "@/components/ui/VegBadge";
import { PriceTag } from "@/components/common/Logo";
import { useAppDispatch } from "@/redux/hooks";
import { increaseQty, decreaseQty, removeItem } from "@/redux/cartSlice";

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="relative size-14 rounded-field bg-base-200 overflow-hidden shrink-0">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-base-content/30">
            <ImageOff className="size-4" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <VegBadge isVeg={item.isVeg} />
          <p className="text-sm font-medium truncate">{item.name}</p>
        </div>
        <PriceTag amount={item.price} className="text-xs text-base-content/60" />
      </div>

      <div className="flex items-center gap-2 bg-base-200 rounded-field px-1">
        <button
          onClick={() => dispatch(decreaseQty(item.itemId))}
          className="btn btn-ghost btn-xs btn-circle"
          aria-label="Decrease quantity"
        >
          <Minus className="size-3" />
        </button>
        <span className="text-sm font-mono font-medium w-4 text-center">{item.qty}</span>
        <button
          onClick={() => dispatch(increaseQty(item.itemId))}
          className="btn btn-ghost btn-xs btn-circle"
          aria-label="Increase quantity"
        >
          <Plus className="size-3" />
        </button>
      </div>

      <button
        onClick={() => dispatch(removeItem(item.itemId))}
        className="btn btn-ghost btn-xs btn-circle text-error"
        aria-label="Remove item"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
};

export default CartItemRow;
