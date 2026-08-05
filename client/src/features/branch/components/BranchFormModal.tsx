"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateBranch, useUpdateBranch } from "@/features/branch/services/branch.service";
import type { Branch } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Branch name is required"),
  address: z.string().min(5, "Address is required"),
});

type FormValues = z.infer<typeof schema>;

const BranchFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  branch?: Branch | null;
}> = ({ isOpen, onClose, branch }) => {
  const isEdit = Boolean(branch);
  const { mutate: create, isPending: creating } = useCreateBranch();
  const { mutate: update, isPending: updating } = useUpdateBranch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) reset({ name: branch?.name ?? "", address: branch?.address ?? "" });
  }, [isOpen, branch, reset]);

  const onSubmit = (values: FormValues) => {
    if (isEdit && branch) {
      update({ id: branch.id, payload: values }, { onSuccess: onClose });
    } else {
      create(values, { onSuccess: onClose });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit branch" : "Add branch"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Branch name" placeholder="e.g. Koramangala" error={errors.name?.message} {...register("name")} />
        <Input label="Address" placeholder="Street, area, city" error={errors.address?.message} {...register("address")} />
        <Button type="submit" fullWidth isLoading={creating || updating}>
          {isEdit ? "Save changes" : "Add branch"}
        </Button>
      </form>
    </Modal>
  );
};

export default BranchFormModal;
