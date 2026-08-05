"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useCreateTable, useUpdateTable } from "@/features/table/services/table.service";
import type { Branch, Table } from "@/types";

const schema = z.object({
  tableNumber: z.string().min(1, "Table name is required").max(20, "Table name is too long"),
  branchId: z.string().uuid("Select a branch"),
});

type FormValues = z.infer<typeof schema>;

const TableFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  branches: Branch[];
  defaultBranchId?: string;
  table?: Table | null;
  onCreated?: (table: Table) => void;
}> = ({ isOpen, onClose, branches, defaultBranchId, table, onCreated }) => {
  const isEdit = Boolean(table);
  const { mutate: create, isPending: creating } = useCreateTable();
  const { mutate: update, isPending: updating } = useUpdateTable();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tableNumber: "", branchId: defaultBranchId ?? "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        tableNumber: table?.tableNumber ?? "",
        branchId: table?.branchId ?? defaultBranchId ?? "",
      });
    }
  }, [isOpen, table, defaultBranchId, reset]);

  const onSubmit = (values: FormValues) => {
    if (isEdit && table) {
      update(
        { id: table.id, payload: { tableNumber: values.tableNumber } },
        { onSuccess: onClose }
      );
    } else {
      create(
        { branchId: values.branchId, tableNumber: values.tableNumber },
        {
          onSuccess: (created) => {
            onClose();
            onCreated?.(created);
          },
        }
      );
    }
  };

  const branchOptions = branches.map((b) => ({ label: b.name, value: b.id }));
  const selectedBranchName = branches.find((b) => b.id === watch("branchId"))?.name;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit table" : "Add table"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isEdit ? (
          <div className="rounded-field border border-base-300 bg-base-200 px-3 py-2 text-sm text-base-content/70">
            {selectedBranchName}
          </div>
        ) : (
          <Select
            label="Branch"
            placeholder="Select a branch"
            options={branchOptions}
            error={errors.branchId?.message}
            {...register("branchId")}
          />
        )}

        <Input
          label="Table name"
          placeholder="e.g. Table - 1"
          error={errors.tableNumber?.message}
          {...register("tableNumber")}
        />

        <Button type="submit" fullWidth isLoading={creating || updating}>
          {isEdit ? "Save changes" : "Add table"}
        </Button>
      </form>
    </Modal>
  );
};

export default TableFormModal;
