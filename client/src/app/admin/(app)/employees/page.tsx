"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Table, { type Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmployeeFormModal from "@/features/employee/components/EmployeeFormModal";
import { useGetEmployees, useDeleteEmployee } from "@/features/employee/services/employee.service";
import { useGetBranches } from "@/features/branch/services/branch.service";
import { useAppSelector } from "@/redux/hooks";
import type { Employee } from "@/types";

export default function AdminEmployeesPage() {
  const activeBranch = useAppSelector((s) => s.context.activeBranch);
  const { data: employees, isLoading } = useGetEmployees(activeBranch?.id);
  const { data: branches } = useGetBranches();
  const { mutate: deleteEmployee, isPending: deleting } = useDeleteEmployee();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const branchName = (id: string) => branches?.find((b) => b.id === id)?.name ?? "—";

  const columns: Column<Employee>[] = [
    {
      header: "Employee",
      accessor: (e) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={e.name} size="sm" />
          <div>
            <p className="font-medium leading-tight">{e.name}</p>
            <p className="text-xs text-base-content/50">{e.email}</p>
          </div>
        </div>
      ),
    },
    { header: "Branch", accessor: (e) => <span className="text-base-content/60">{branchName(e.branchId)}</span> },
    { header: "Role", accessor: (e) => <Badge variant="outline">{e.role}</Badge> },
    {
      header: "Status",
      accessor: (e) => <Badge variant={e.isActive ? "success" : "neutral"}>{e.isActive ? "Active" : "Inactive"}</Badge>,
    },
    {
      header: "",
      accessor: (e) => (
        <div className="flex justify-end gap-1">
          <button
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => {
              setEditing(e);
              setFormOpen(true);
            }}
            aria-label="Edit employee"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            className="btn btn-ghost btn-xs btn-circle text-error"
            onClick={() => setDeletingEmployee(e)}
            aria-label="Delete employee"
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
          <h1 className="font-display text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-base-content/50">Waitstaff, chefs, and cashiers across your branches.</p>
        </div>
        <Button
          size="sm"
          icon={<Plus className="size-4" />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add employee
        </Button>
      </div>

      <Table
        columns={columns}
        data={employees ?? []}
        keyExtractor={(e) => e.id}
        isLoading={isLoading}
        emptyTitle="No employees yet"
        emptyDescription="Add your first team member to assign orders."
      />

      <EmployeeFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} employee={editing} />

      <ConfirmDialog
        isOpen={Boolean(deletingEmployee)}
        title={`Remove ${deletingEmployee?.name}?`}
        description="They'll lose access to the employee dashboard immediately."
        confirmLabel="Remove"
        isDestructive
        isLoading={deleting}
        onCancel={() => setDeletingEmployee(null)}
        onConfirm={() =>
          deletingEmployee &&
          deleteEmployee(deletingEmployee.id, {
            onSuccess: () => setDeletingEmployee(null),
          })
        }
      />
    </div>
  );
}
