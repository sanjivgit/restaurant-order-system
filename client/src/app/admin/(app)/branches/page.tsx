"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Table, { type Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BranchFormModal from "@/features/branch/components/BranchFormModal";
import { useGetBranches, useDeleteBranch } from "@/features/branch/services/branch.service";
import type { Branch } from "@/types";

export default function AdminBranchesPage() {
  const { data: branches, isLoading } = useGetBranches();
  const { mutate: deleteBranch, isPending: deleting } = useDeleteBranch();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);

  const columns: Column<Branch>[] = [
    { header: "Branch", accessor: (b) => <span className="font-medium">{b.name}</span> },
    { header: "Address", accessor: (b) => <span className="text-base-content/60">{b.address}</span> },
    {
      header: "Status",
      accessor: (b) => <Badge variant={b.isActive ? "success" : "neutral"}>{b.isActive ? "Active" : "Inactive"}</Badge>,
    },
    {
      header: "",
      accessor: (b) => (
        <div className="flex justify-end gap-1">
          <button
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => {
              setEditing(b);
              setFormOpen(true);
            }}
            aria-label="Edit branch"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            className="btn btn-ghost btn-xs btn-circle text-error"
            onClick={() => setDeletingBranch(b)}
            aria-label="Delete branch"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Branches</h1>
          <p className="text-sm text-base-content/50">Every location your restaurant operates from.</p>
        </div>
        <Button
          size="sm"
          icon={<Plus className="size-4" />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add branch
        </Button>
      </div>

      <Table
        columns={columns}
        data={branches ?? []}
        keyExtractor={(b) => b.id}
        isLoading={isLoading}
        emptyTitle="No branches yet"
        emptyDescription="Add your first branch to start taking orders."
      />

      <BranchFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} branch={editing} />

      <ConfirmDialog
        isOpen={Boolean(deletingBranch)}
        title={`Delete ${deletingBranch?.name}?`}
        description="This will remove the branch and its menu categories. This can't be undone."
        confirmLabel="Delete"
        isDestructive
        isLoading={deleting}
        onCancel={() => setDeletingBranch(null)}
        onConfirm={() =>
          deletingBranch &&
          deleteBranch(deletingBranch.id, {
            onSuccess: () => setDeletingBranch(null),
          })
        }
      />

      {!isLoading && branches?.length === 0 && (
        <div className="flex justify-center text-base-content/30">
          <Building2 className="size-6" />
        </div>
      )}
    </div>
  );
}
