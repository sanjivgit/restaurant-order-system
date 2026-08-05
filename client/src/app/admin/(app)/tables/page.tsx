"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, QrCode, Grid2x2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Table, { type Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import TableFormModal from "@/features/table/components/TableFormModal";
import QrCodeModal from "@/features/table/components/QrCodeModal";
import { useGetTables, useDeleteTable } from "@/features/table/services/table.service";
import { useGetBranches } from "@/features/branch/services/branch.service";
import { useAppSelector } from "@/redux/hooks";
import type { Table as TableModel } from "@/types";

export default function AdminTablesPage() {
  const activeBranch = useAppSelector((s) => s.context.activeBranch);
  const { data: branches, isLoading: branchesLoading } = useGetBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<string>(activeBranch?.id ?? "");

  const { data: tables, isLoading } = useGetTables(selectedBranchId);
  const { mutate: deleteTable, isPending: deleting } = useDeleteTable();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TableModel | null>(null);
  const [qrTable, setQrTable] = useState<TableModel | null>(null);
  const [deletingTable, setDeletingTable] = useState<TableModel | null>(null);

  useEffect(() => {
    if (activeBranch?.id) setSelectedBranchId(activeBranch.id);
  }, [activeBranch?.id]);

  const selectedBranch = branches?.find((b) => b.id === selectedBranchId);
  const branchName = (branchId: string) => branches?.find((b) => b.id === branchId)?.name ?? branchId;

  const columns: Column<TableModel>[] = [
    { header: "Table", accessor: (t) => <span className="font-medium">{t.tableNumber}</span> },
    { header: "Branch", accessor: (t) => <span className="text-base-content/60">{branchName(t.branchId)}</span> },
    {
      header: "Status",
      accessor: (t) => <Badge variant={t.isActive ? "success" : "neutral"}>{t.isActive ? "Active" : "Inactive"}</Badge>,
    },
    {
      header: "",
      accessor: (t) => (
        <div className="flex justify-end gap-1">
          <button
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => setQrTable(t)}
            aria-label="View QR code"
            title="View QR code"
          >
            <QrCode className="size-3.5" />
          </button>
          <button
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => {
              setEditing(t);
              setFormOpen(true);
            }}
            aria-label="Edit table"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            className="btn btn-ghost btn-xs btn-circle text-error"
            onClick={() => setDeletingTable(t)}
            aria-label="Delete table"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  if (!branchesLoading && branches?.length === 0) {
    return (
      <EmptyState
        title="No branches yet"
        description="Add a branch first, then you can create tables and their QR codes for it."
        icon={<Grid2x2 className="size-6" />}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Tables</h1>
          <p className="text-sm text-base-content/50">Create tables and print their QR codes for guests.</p>
        </div>
        <Button
          size="sm"
          icon={<Plus className="size-4" />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          disabled={!selectedBranchId}
        >
          Add table
        </Button>
      </div>

      <div className="max-w-sm">
        <Select
          label="Branch"
          placeholder="Select a branch"
          options={(branches ?? []).map((b) => ({ label: b.name, value: b.id }))}
          value={selectedBranchId}
          onChange={(e) => setSelectedBranchId(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        data={tables ?? []}
        keyExtractor={(t) => t.id}
        isLoading={isLoading}
        emptyTitle="No tables yet"
        emptyDescription={`Add tables for ${selectedBranch?.name ?? "this branch"} to generate QR codes.`}
      />

      <TableFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        branches={branches ?? []}
        defaultBranchId={selectedBranchId}
        table={editing}
        onCreated={(t) => setQrTable(t)}
      />

      <QrCodeModal isOpen={Boolean(qrTable)} onClose={() => setQrTable(null)} table={qrTable} />

      <ConfirmDialog
        isOpen={Boolean(deletingTable)}
        title={`Delete ${deletingTable?.tableNumber}?`}
        description="This will remove the table and its QR code. Orders already placed are kept."
        confirmLabel="Delete"
        isDestructive
        isLoading={deleting}
        onCancel={() => setDeletingTable(null)}
        onConfirm={() =>
          deletingTable &&
          deleteTable(deletingTable.id, {
            onSuccess: () => setDeletingTable(null),
          })
        }
      />
    </div>
  );
}
