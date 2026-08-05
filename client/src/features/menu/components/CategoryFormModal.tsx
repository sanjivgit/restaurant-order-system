"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateCategory, useUpdateCategory } from "@/features/menu/services/menu.service";
import type { MenuCategory } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Category name is required"),
});

type FormValues = z.infer<typeof schema>;

const CategoryFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  category?: MenuCategory | null;
  branchId?: string;
}> = ({ isOpen, onClose, category, branchId }) => {
  const isEdit = Boolean(category);
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: update, isPending: updating } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) reset({ name: category?.name ?? "" });
  }, [isOpen, category, reset]);

  const onSubmit = (values: FormValues) => {
    if (isEdit && category) {
      update({ id: category.id, payload: values }, { onSuccess: onClose });
    } else if (branchId) {
      create({ ...values, branchId }, { onSuccess: onClose });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit category" : "Add category"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Category name" placeholder="e.g. Starters" error={errors.name?.message} {...register("name")} />
        <Button type="submit" fullWidth isLoading={creating || updating}>
          {isEdit ? "Save changes" : "Add category"}
        </Button>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
