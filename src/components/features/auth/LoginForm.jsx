import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useAuth } from "../../../context/AuthContext";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      // ✅ No navigate() needed here. 
      // AuthContext.login uses window.location.replace(ROUTES.dashboard).
      // This hard redirect is the key to breaking the auth loop.
      await login(values); 
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Login failed. Please check your credentials.";
      setServerError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
      autoComplete="on"
    >
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      
      {serverError && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-200">
          {serverError}
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}