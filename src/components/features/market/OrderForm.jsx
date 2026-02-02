import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useWalletBalance, usePortfolio } from "../../../hooks/usePortfolio";
import api from "../../../lib/axios";
import { formatCurrency } from "../../../lib/utils";

const orderSchema = z.object({
  stockSymbol: z.string().min(1, "Symbol is required"),
  quantity: z
    .number({ invalid_type_error: "Quantity is required" })
    .positive("Quantity must be greater than zero"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than zero"),
});

export default function OrderForm({ side = "BUY", symbol }) {
  const [serverError, setServerError] = useState("");
  const { data: wallet } = useWalletBalance();
  const { data: portfolio } = usePortfolio();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      stockSymbol: symbol || "",
      quantity: 0,
      price: 0,
    },
  });

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
        stockSymbol: values.stockSymbol,
        quantity: Number(values.quantity),
        price: Number(values.price),
        type: side,
      };
      if (side === "BUY") {
        await api.post("/order/buy", payload);
      } else {
        await api.post("/order/sell", payload);
      }
      toast.success("Order placed");
      reset({ stockSymbol: symbol || "", quantity: 0, price: 0 });
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Unable to place order.";
      setServerError(message);
      toast.error("Order failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 text-xs"
      noValidate
    >
      <Input
        label="Symbol"
        placeholder="e.g. AAPL"
        defaultValue={symbol}
        error={errors.stockSymbol?.message}
        {...register("stockSymbol")}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Quantity"
          type="number"
          step="1"
          min="0"
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
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Estimated notional</span>
          <span className="tabular-nums text-slate-100">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            {side === "BUY" ? "Available cash" : "Owned shares (approx.)"}
          </span>
          <span className="tabular-nums">
            {side === "BUY"
              ? formatCurrency(walletBalance)
              : ownedShares.toString()}
          </span>
        </div>
        {insufficientFunds && (
          <p className="mt-2 text-[11px] font-medium text-rose-400">
            Insufficient funds to place this order.
          </p>
        )}
        {insufficientShares && (
          <p className="mt-2 text-[11px] font-medium text-rose-400">
            You are trying to sell more shares than you own.
          </p>
        )}
      </div>

      {serverError && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] font-medium text-rose-200">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        variant={side === "BUY" ? "success" : "danger"}
        isLoading={isSubmitting}
        disabled={insufficientFunds || insufficientShares || total <= 0}
      >
        {side === "BUY" ? "Place buy order" : "Place sell order"}
      </Button>
    </form>
  );
}

