"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, ImageOff, UtensilsCrossed } from "lucide-react";
import Button from "@/components/ui/Button";
import Table, { type Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import SearchBar from "@/components/ui/SearchBar";
import Select from "@/components/ui/Select";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import VegBadge from "@/components/ui/VegBadge";
import { PriceTag } from "@/components/common/Logo";
import ItemFormModal from "@/features/menu/components/ItemFormModal";
import {
  useGetCategories,
  useGetItems,
  useDeleteItem,
  useToggleItemAvailability,
} from "@/features/menu/services/menu.service";
import { useAppSelector } from "@/redux/hooks";
import type { MenuItem } from "@/types";

export default function AdminMenuItemsPage() {
  const activeBranch = useAppSelector((s) => s.context.activeBranch);
  const { data: categories } = useGetCategories(activeBranch?.id);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const {
    data: items,
    isLoading,
  } = useGetItems({ branchId: activeBranch?.id, categoryId: categoryId || undefined, search: search || undefined });
  const { mutate: deleteItem, isPending: deleting } = useDeleteItem();
  const { mutate: toggleAvailability } = useToggleItemAvailability();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  const categoryName = (id: string) => categories?.find((c) => c.id === id)?.name ?? "—";

  const columns: Column<MenuItem>[] = [
    {
      header: "Item",
      accessor: (i) => (
        <div className="flex items-center gap-2.5">
          <div className="relative size-10 rounded-field bg-base-200 overflow-hidden shrink-0">
            {i.image ? (
              <Image src={i.image} alt={i.name} fill sizes="40px" className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-base-content/30">
                <ImageOff className="size-4" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <VegBadge isVeg={i.isVeg} />
              <p className="font-medium leading-tight truncate max-w-[160px]">{i.name}</p>
            </div>
            <p className="text-xs text-base-content/50">{categoryName(i.categoryId)}</p>
          </div>
        </div>
      ),
    },
    { header: "Price", accessor: (i) => <PriceTag amount={i.price} /> },
    {
      header: "Availability",
      accessor: (i) => (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-primary"
            checked={i.isAvailable}
            onChange={(e) => toggleAvailability({ id: i.id, isAvailable: e.target.checked })}
          />
          <Badge variant={i.isAvailable ? "success" : "neutral"}>{i.isAvailable ? "Available" : "Sold out"}</Badge>
        </label>
      ),
    },
    {
      header: "",
      accessor: (i) => (
        <div className="flex justify-end gap-1">
          <button
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => {
              setEditing(i);
              setFormOpen(true);
            }}
            aria-label="Edit item"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            className="btn btn-ghost btn-xs btn-circle text-error"
            onClick={() => setDeletingItem(i)}
            aria-label="Delete item"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  if (!activeBranch) {
    return <EmptyState title="Select a branch" description="Choose a branch from the top bar to manage its menu." icon={<UtensilsCrossed className="size-6" />} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Menu items</h1>
          <p className="text-sm text-base-content/50">Dishes available at {activeBranch.name}.</p>
        </div>
        <Button
          size="sm"
          icon={<Plus className="size-4" />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          disabled={!categories?.length}
        >
          Add item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search items…" className="sm:max-w-xs" />
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={(categories ?? []).map((c) => ({ label: c.name, value: c.id }))}
          placeholder="All categories"
          className="sm:max-w-[200px]"
        />
      </div>

      {!categories?.length && !isLoading ? (
        <EmptyState
          title="Add a category first"
          description="Create a menu category before adding items to it."
          icon={<UtensilsCrossed className="size-6" />}
        />
      ) : (
        <Table
          columns={columns}
          data={items ?? []}
          keyExtractor={(i) => i.id}
          isLoading={isLoading}
          emptyTitle="No items found"
          emptyDescription="Try a different search, or add your first dish."
        />
      )}

      <ItemFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        item={editing}
        categories={categories ?? []}
        branchId={activeBranch.id}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingItem)}
        title={`Delete ${deletingItem?.name}?`}
        description="This dish will be removed from the customer menu immediately."
        confirmLabel="Delete"
        isDestructive
        isLoading={deleting}
        onCancel={() => setDeletingItem(null)}
        onConfirm={() =>
          deletingItem &&
          deleteItem(deletingItem.id, {
            onSuccess: () => setDeletingItem(null),
          })
        }
      />
    </div>
  );
}
