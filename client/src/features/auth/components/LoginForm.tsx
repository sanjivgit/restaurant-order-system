"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLogin } from "@/features/auth/services/auth.service";
import type { UserRole } from "@/redux/authSlice";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const LoginForm: React.FC<{ role: UserRole; redirectTo: string; demoHint: string }> = ({
  role,
  redirectTo,
  demoHint,
}) => {
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    mutate(
      { ...values, role },
      {
        onSuccess: () => router.replace(redirectTo),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@tableserve.app"
        leftIcon={<Mail className="size-4" />}
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="size-4" />}
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" fullWidth isLoading={isPending}>
        Log in
      </Button>
      <p className="text-xs text-center text-base-content/50">{demoHint}</p>
    </form>
  );
};

export default LoginForm;
