import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Added for navigation
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useWalletBalance, usePortfolio } from "../../../hooks/usePortfolio";
import api from "../../../lib/axios";
import { formatCurrency } from "../../../lib/utils";
import { ROUTES } from "../../../lib/constants";

const orderSchema = z.object({
  stockSymbol: z.string().min(1, "Symbol is required"),
  quantity: z
    .number({ invalid_type_error: "Quantity is required" })
    .positive("Quantity must be greater than zero"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than zero"),
});

export default function OrderForm({ side = "BUY", symbol, currentPrice }) {
  const [serverError, setServerError] = useState("");
  const { data: wallet } = useWalletBalance();
  const { data: portfolio } = usePortfolio();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      stockSymbol: symbol || "",
      quantity: 0,
      price: currentPrice || 0,
    },
  });

  // FIXED: Auto-update form when user searches or price updates
  useEffect(() => {
    if (symbol) setValue("stockSymbol", symbol);
    if (currentPrice) setValue("price", currentPrice);
  }, [symbol, currentPrice, setValue]);

  const quantity = watch("quantity");
  const price = watch("price");
  const total = useMemo(
    () => Number(quantity || 0) * Number(price || 0),
    [quantity, price]
  );

  const walletBalance = wallet?.balance ?? 0;
  const holdings = portfolio?.holdings ?? [];

  const ownedShares = useMemo(() => {
    const holding = holdings.find(
      (h) => (h.stockSymbol ?? h.symbol) === (symbol || watch("stockSymbol"))
    );
    return holding?.quantity ?? 0;
  }, [holdings, symbol, watch]);

  const insufficientFunds = side === "BUY" && total > walletBalance;
  const insufficientShares = side === "SELL" && quantity > ownedShares;

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const payload = {
        symbol: String(values.stockSymbol).toUpperCase(),
        quantity: Number(values.quantity),
        type: side.toUpperCase(),
      };

      if (side === "BUY") {
         await api.post("/order/buy", payload);
         
         // FIXED: Custom Toast with Action Button
         toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-slate-100">
                      Buy Order Created!
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Go to Orders tab to confirm execution.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-slate-700">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate(ROUTES.orders); // Redirect user
                  }}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none"
                >
                  Go to Orders
                </button>
              </div>
            </div>
         ), { duration: 5000 });

      } else {
         await api.post("/order/sell", payload);
         toast.success("Sell order executed successfully");
      }

      reset({ stockSymbol: symbol || "", quantity: 0, price: currentPrice || 0 });

      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });

    } catch (err) {
      const message = err?.response?.data?.message ?? "Order failed";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs" noValidate>
      <Input
        label="Symbol"
        readOnly // FIXED: Make read-only since it syncs with search
        className="opacity-70 cursor-not-allowed"
        {...register("stockSymbol")}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Quantity"
          type="number"
          step="1"
          min="1"
          placeholder="0"
          error={errors.quantity?.message}
          {...register("quantity", { valueAsNumber: true })}
        />
        <Input
          label="Limit Price (Auto-filled)"
          type="number"
          step="0.01"
          min="0.01"
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Total Cost</span>
          <span className="tabular-nums text-slate-100">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>{side === "BUY" ? "Available Cash" : "Owned Shares"}</span>
          <span className="tabular-nums">
            {side === "BUY" ? formatCurrency(walletBalance) : ownedShares}
          </span>
        </div>
        {insufficientFunds && (
          <p className="mt-2 text-[11px] font-medium text-rose-400">Insufficient funds</p>
        )}
      </div>

      {serverError && (
        <div className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded">{serverError}</div>
      )}

      <Button
        type="submit"
        className="w-full"
        variant={side === "BUY" ? "success" : "danger"}
        isLoading={isSubmitting}
        disabled={insufficientFunds || insufficientShares || total <= 0}
      >
        {side === "BUY" ? "Place Buy Order" : "Place Sell Order"}
      </Button>
    </form>
  );
}