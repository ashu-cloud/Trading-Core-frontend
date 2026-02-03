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

const quickSellSchema = z.object({
  quantity: z
    .number({ invalid_type_error: "Quantity is required" })
    .positive("Quantity must be greater than zero"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than zero"),
});

export default function QuickSellModal({ symbol, quantity, onClose }) {
  const [serverError, setServerError] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quickSellSchema),
    defaultValues: {
      quantity: quantity ?? 0,
      price: 0,
    },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await api.post("/order/place", {
        stockSymbol: String(symbol).toUpperCase(),
        quantity: Number(values.quantity),
        price: Number(values.price),
        type: "SELL",
      });

      toast.success("Quick sell order placed");
      // Invalidate caches per spec
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      onClose();
    } catch (err) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Unable to place quick sell order.";
      setServerError(message);
      toast.error(message);
      if (status === 400) {
        if (/quantity/i.test(message)) setError("quantity", { type: "server", message });
        if (/price/i.test(message)) setError("price", { type: "server", message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-xl">
        <header className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
              Quick sell
            </p>
            <h2 className="text-sm font-semibold text-slate-50">
              {symbol} · up to {quantity} shares
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 text-xs"
          noValidate
        >
          <Input
            label="Quantity to sell"
            type="number"
            step="1"
            min="1"
            error={errors.quantity?.message}
            {...register("quantity", { valueAsNumber: true })}
          />
          <Input
            label="Limit price"
            type="number"
            step="0.01"
            min="0"
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />
          {serverError && (
            <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] font-medium text-rose-200">
              {serverError}
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              className="px-3 py-1"
              isLoading={isSubmitting}
            >
              Place sell order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

