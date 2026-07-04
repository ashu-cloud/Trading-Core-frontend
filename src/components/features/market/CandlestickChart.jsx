import React, { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";

function generateMockCandles(symbol, period, currentPrice = 150) {
  const data = [];
  let basePrice = currentPrice || 150;
  
  let count = 60;
  let intervalSeconds = 86400; // 1 day default
  if (period === "1D") { count = 48; intervalSeconds = 1800; } 
  else if (period === "1W") { count = 70; intervalSeconds = 8640; }
  else if (period === "1M") { count = 30; intervalSeconds = 86400; }
  else if (period === "3M") { count = 90; intervalSeconds = 86400; }
  else if (period === "1Y") { count = 250; intervalSeconds = 129600; } // 1.5 days

  let date = new Date();
  const startTimestamp = Math.floor(date.getTime() / 1000) - (count * intervalSeconds);

  // Deterministic random seed based on symbol characters
  let seed = 0;
  const cleanSymbol = symbol ? String(symbol).toUpperCase() : "STOCK";
  for (let i = 0; i < cleanSymbol.length; i++) {
    seed += cleanSymbol.charCodeAt(i);
  }

  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  let price = basePrice;
  const rawCandles = [];
  for (let i = 0; i < count; i++) {
    const change = (random() - 0.49) * (price * 0.015); 
    const open = price - change;
    const close = price;
    const high = Math.max(open, close) + random() * (price * 0.003);
    const low = Math.min(open, close) - random() * (price * 0.003);
    
    rawCandles.push({
      open,
      high,
      low,
      close,
    });
    price = open;
  }

  rawCandles.reverse();

  for (let i = 0; i < count; i++) {
    const timestamp = startTimestamp + (i * intervalSeconds);
    data.push({
      time: timestamp,
      open: Number(rawCandles[i].open.toFixed(2)),
      high: Number(rawCandles[i].high.toFixed(2)),
      low: Number(rawCandles[i].low.toFixed(2)),
      close: Number(rawCandles[i].close.toFixed(2)),
    });
  }

  return data;
}

export default function CandlestickChart({ symbol, period, currentPrice }) {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    
    const chart = createChart(container, {
      layout: {
        background: { color: "#0A0A0F" },
        textColor: "#71717A",
        fontFamily: "IBM Plex Mono, monospace",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.02)" },
        horzLines: { color: "rgba(255, 255, 255, 0.02)" },
      },
      crosshair: {
        mode: 0, 
      },
      width: container.clientWidth || 600,
      height: 480,
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.07)",
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.07)",
      }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22C55E",
      downColor: "#EF4444",
      borderUpColor: "#22C55E",
      borderDownColor: "#EF4444",
      wickUpColor: "#22C55E",
      wickDownColor: "#EF4444",
    });

    const data = generateMockCandles(symbol, period, currentPrice);
    candlestickSeries.setData(data);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (container) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [symbol, period, currentPrice]);

  return <div ref={chartContainerRef} className="w-full relative h-[480px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-2" />;
}
