"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useCreateItem, useUpdateItem } from "@/features/menu/services/menu.service";
import type { MenuCategory, MenuItem } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Item name is required"),
  description: z.string().min(5, "Add a short description"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  categoryId: z.string().min(1, "Select a category"),
  image: z.string().url("Enter a valid image URL").or(z.literal("")),
  isVeg: z.enum(["true", "false"]),
});

type FormValues = z.infer<typeof schema>;

const ItemFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  item?: MenuItem | null;
  categories: MenuCategory[];
  branchId?: string;
}> = ({ isOpen, onClose, item, categories, branchId }) => {
  const isEdit = Boolean(item);
  const { mutate: create, isPending: creating } = useCreateItem();
  const { mutate: update, isPending: updating } = useUpdateItem();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: item?.name ?? "",
        description: item?.description ?? "",
        price: item?.price ?? 0,
        categoryId: item?.categoryId ?? categories[0]?.id ?? "",
        image: item?.image ?? "",
        isVeg: item ? (item.isVeg ? "true" : "false") : "true",
      });
    }
  }, [isOpen, item, categories, reset]);

  const onSubmit = (values: FormValues) => {
    const payload = { ...values, isVeg: values.isVeg === "true" };

    if (isEdit && item) {
      update({ id: item.id, payload }, { onSuccess: onClose });
    } else if (branchId) {
      create({ ...payload, branchId }, { onSuccess: onClose });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit menu item" : "Add menu item"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Item name" placeholder="e.g. Paneer Tikka" error={errors.name?.message} {...register("name")} />
        <Textarea label="Description" rows={2} placeholder="Short, appetite-building description" error={errors.description?.message} {...register("description")} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Price (₹)" type="number" step="0.01" placeholder="249" error={errors.price?.message} {...register("price")} />
          <Controller
            control={control}
            name="isVeg"
            render={({ field }) => (
              <Select
                label="Type"
                options={[
                  { label: "Vegetarian", value: "true" },
                  { label: "Non-vegetarian", value: "false" },
                ]}
                {...field}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              label="Category"
              placeholder="Select category"
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              error={errors.categoryId?.message}
              {...field}
            />
          )}
        />

        <Input label="Image URL" placeholder="https://…" error={errors.image?.message} {...register("image")} />

        <Button type="submit" fullWidth isLoading={creating || updating}>
          {isEdit ? "Save changes" : "Add item"}
        </Button>
      </form>
    </Modal>
  );
};

export default ItemFormModal;
