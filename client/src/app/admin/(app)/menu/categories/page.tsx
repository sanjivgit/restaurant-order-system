"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import Button from "@/components/ui/Button";
import Table, { type Column } from "@/components/ui/Table";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import CategoryFormModal from "@/features/menu/components/CategoryFormModal";
import { useGetCategories, useDeleteCategory } from "@/features/menu/services/menu.service";
import { useAppSelector } from "@/redux/hooks";
import type { MenuCategory } from "@/types";

export default function AdminMenuCategoriesPage() {
  const activeBranch = useAppSelector((s) => s.context.activeBranch);
  const { data: categories, isLoading } = useGetCategories(activeBranch?.id);
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MenuCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<MenuCategory | null>(null);

  const columns: Column<MenuCategory>[] = [
    { header: "Category", accessor: (c) => <span className="font-medium">{c.name}</span> },
    {
      header: "",
      accessor: (c) => (
        <div className="flex justify-end gap-1">
          <button
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => {
              setEditing(c);
              setFormOpen(true);
            }}
            aria-label="Edit category"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            className="btn btn-ghost btn-xs btn-circle text-error"
            onClick={() => setDeletingCategory(c)}
            aria-label="Delete category"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  if (!activeBranch) {
    return <EmptyState title="Select a branch" description="Choose a branch from the top bar to manage its menu." icon={<FolderTree className="size-6" />} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Menu categories</h1>
          <p className="text-sm text-base-content/50">Organize the menu for {activeBranch.name}.</p>
        </div>
        <Button
          size="sm"
          icon={<Plus className="size-4" />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add category
        </Button>
      </div>

      <Table
        columns={columns}
        data={categories ?? []}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        emptyTitle="No categories yet"
        emptyDescription="Create categories like Starters or Main Course to group your menu."
      />

      <CategoryFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} category={editing} branchId={activeBranch.id} />

      <ConfirmDialog
        isOpen={Boolean(deletingCategory)}
        title={`Delete ${deletingCategory?.name}?`}
        description="Items inside this category will also be removed."
        confirmLabel="Delete"
        isDestructive
        isLoading={deleting}
        onCancel={() => setDeletingCategory(null)}
        onConfirm={() =>
          deletingCategory &&
          deleteCategory(deletingCategory.id, {
            onSuccess: () => setDeletingCategory(null),
          })
        }
      />
    </div>
  );
}
