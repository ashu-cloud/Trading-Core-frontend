import React, { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import api from "../../../lib/axios";
import { useQueryClient } from "@tanstack/react-query";

const depositSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .positive("Amount must be greater than zero")
    .max(1000000, "Maximum deposit is ₹1,000,000"),
});

export default function DepositMoney({ onClose }) {
  const [serverError, setServerError] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(depositSchema),
    defaultValues: { amount: 0 },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      // Backend expects { amount: Number }
      await api.post("/user/wallet/add", {
        amount: Number(values.amount),
      });

      toast.success("Funds added successfully");
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      onClose();
    } catch (err) {
      const message = err?.response?.data?.message ?? "Deposit failed.";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-50 text-indigo-400 uppercase tracking-widest">
            Add Funds
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Deposit Amount (INR)"
            type="number"
            placeholder="e.g. 5000"
            error={errors.amount?.message}
            {...register("amount", { valueAsNumber: true })}
          />
          
          {serverError && (
            <div className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Confirm Deposit
          </Button>
        </form>
      </div>
    </div>
  );
}