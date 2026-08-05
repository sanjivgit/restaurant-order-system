"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useCreateEmployee, useUpdateEmployee } from "@/features/employee/services/employee.service";
import { useGetBranches } from "@/features/branch/services/branch.service";
import { EMPLOYEE_ROLES } from "@/utils/constants";
import type { Employee } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  branchId: z.string().min(1, "Select a branch"),
  role: z.enum(EMPLOYEE_ROLES),
});

type FormValues = z.infer<typeof schema>;

const EmployeeFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
}> = ({ isOpen, onClose, employee }) => {
  const isEdit = Boolean(employee);
  const { data: branches } = useGetBranches();
  const { mutate: create, isPending: creating } = useCreateEmployee();
  const { mutate: update, isPending: updating } = useUpdateEmployee();

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
        name: employee?.name ?? "",
        email: employee?.email ?? "",
        phone: employee?.phone ?? "",
        branchId: employee?.branchId ?? "",
        role: employee?.role ?? "WAITER",
      });
    }
  }, [isOpen, employee, reset]);

  const onSubmit = (values: FormValues) => {
    if (isEdit && employee) {
      update({ id: employee.id, payload: values }, { onSuccess: onClose });
    } else {
      create({ ...values, password: "password" }, { onSuccess: onClose });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit employee" : "Add employee"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full name" placeholder="e.g. Ravi Kumar" error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" placeholder="name@tableserve.app" error={errors.email?.message} {...register("email")} />
        <Input label="Phone" placeholder="10-digit number" error={errors.phone?.message} {...register("phone")} />

        <Controller
          control={control}
          name="branchId"
          render={({ field }) => (
            <Select
              label="Branch"
              placeholder="Select branch"
              options={(branches ?? []).map((b) => ({ label: b.name, value: b.id }))}
              error={errors.branchId?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              label="Role"
              options={EMPLOYEE_ROLES.map((r) => ({ label: r.charAt(0) + r.slice(1).toLowerCase(), value: r }))}
              error={errors.role?.message}
              {...field}
            />
          )}
        />

        <Button type="submit" fullWidth isLoading={creating || updating}>
          {isEdit ? "Save changes" : "Add employee"}
        </Button>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal;
