"use client";

import Image from "next/image";
import { Minus, Plus, ImageOff } from "lucide-react";
import type { MenuItem } from "@/types";
import VegBadge from "@/components/ui/VegBadge";
import { PriceTag } from "@/components/common/Logo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addItem, increaseQty, decreaseQty } from "@/redux/cartSlice";

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector((s) => s.cart.items.find((i) => i.itemId === item.id));

  return (
    <div className="rounded-box border border-base-300 bg-base-100 overflow-hidden flex flex-col">
      <div className="relative h-32 w-full bg-base-200">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="200px" className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-base-content/30">
            <ImageOff className="size-6" />
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-neutral/60 flex items-center justify-center">
            <span className="badge badge-neutral text-xs">Sold out</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start gap-1.5">
          <VegBadge isVeg={item.isVeg} className="mt-1" />
          <h3 className="font-display font-semibold text-sm leading-snug line-clamp-1">{item.name}</h3>
        </div>
        <p className="text-xs text-base-content/60 line-clamp-2 flex-1">{item.description}</p>

        <div className="flex items-center justify-between pt-1">
          <PriceTag amount={item.price} className="text-sm font-semibold" />

          {item.isAvailable &&
            (cartItem ? (
              <div className="flex items-center gap-2 bg-primary/10 rounded-field px-1">
                <button
                  onClick={() => dispatch(decreaseQty(item.id))}
                  className="btn btn-ghost btn-xs btn-circle text-primary"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3" />
                </button>
                <span className="text-sm font-mono font-medium w-4 text-center">{cartItem.qty}</span>
                <button
                  onClick={() => dispatch(increaseQty(item.id))}
                  className="btn btn-ghost btn-xs btn-circle text-primary"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  dispatch(
                    addItem({
                      itemId: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      isVeg: item.isVeg,
                    })
                  )
                }
                className="btn btn-primary btn-xs rounded-field"
              >
                Add
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
