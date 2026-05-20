"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CURRENCIES = [
  { code: "USDT", name: "Tether",   letter: "T" },
  { code: "BTC",  name: "Bitcoin",  letter: "₿" },
  { code: "ETH",  name: "Ethereum", letter: "E" },
];

const FIAT = [
  { code: "COP", name: "Colombian Peso", flag: "🇨🇴" },
  { code: "EUR", name: "Euro",           flag: "🇪🇺" },
  { code: "USD", name: "US Dollar",      flag: "🇺🇸" },
  { code: "XOF", name: "Franc CFA",      flag: "🌍" },
];

const RATES: Record<string, number> = {
  "USDT-COP": 3964.8673, "USDT-EUR": 0.9231, "USDT-USD": 1.0, "USDT-XOF": 605.5,
  "BTC-COP": 240000000, "BTC-EUR": 58000, "BTC-USD": 62500, "BTC-XOF": 37800000,
  "ETH-COP": 14000000,  "ETH-EUR": 3200,  "ETH-USD": 3450,  "ETH-XOF": 2100000,
};

export default function ExchangePage() {
  const router = useRouter();
  const [fromCurrency, setFromCurrency] = useState(CURRENCIES[0]);
  const [toCurrency,   setToCurrency]   = useState(FIAT[0]);
  const [amount,       setAmount]       = useState("1,000.00");
  const [showFromDD,   setShowFromDD]   = useState(false);
  const [showToDD,     setShowToDD]     = useState(false);

  const rawAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const rateKey   = `${fromCurrency.code}-${toCurrency.code}`;
  const rate      = RATES[rateKey] ?? 1;
  const received  = (rawAmount * rate).toLocaleString("fr-FR", { maximumFractionDigits: 3 });

  function handleAmountChange(v: string) {
    const cleaned = v.replace(/[^0-9.]/g, "");
    const parts   = cleaned.split(".");
    let formatted = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts.length > 1) formatted += "." + parts[1].slice(0, 2);
    setAmount(formatted);
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center px-5 pt-5 pb-3 gap-4">
        <button
          onClick={() => router.back()}
          className="size-9 flex items-center justify-center rounded-full bg-white/80 border border-black/[0.07] text-gray-600 hover:text-gray-900 transition-colors shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
        </button>
        <h1 className="text-gray-900 text-[28px] font-bold leading-tight flex-1">Exchange</h1>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-8">
        {/* Available Balance */}
        <p className="text-gray-500 text-[12px] text-center font-medium">
          Available Balance: {fromCurrency.code} 5667.00
        </p>

        {/* From currency selector */}
        <div className="relative">
          <button
            onClick={() => { setShowFromDD((v) => !v); setShowToDD(false); }}
            className="w-full flex items-center gap-3 bg-white/80 border border-black/[0.07] rounded-xl px-4 py-3.5 shadow-sm cursor-pointer hover:shadow-md transition-all"
          >
            <div className="size-8 rounded-full bg-[#FF4D1C]/10 border border-[#FF4D1C]/20 flex items-center justify-center shrink-0">
              <span className="text-[#FF4D1C] text-[13px] font-bold">{fromCurrency.letter}</span>
            </div>
            <span className="text-gray-900 text-[15px] font-semibold flex-1 text-left">
              {fromCurrency.code} – {fromCurrency.name}
            </span>
          </button>
          {showFromDD && (
            <div className="absolute z-20 top-full mt-1 w-full bg-white border border-black/[0.08] rounded-xl overflow-hidden shadow-lg">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setFromCurrency(c); setShowFromDD(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <div className="size-7 rounded-full bg-[#FF4D1C]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#FF4D1C] text-[12px] font-bold">{c.letter}</span>
                  </div>
                  <span className="text-gray-900 text-[14px] font-medium">{c.code} – {c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Transfer amount */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-500 text-[12px] font-medium px-1">Transfer amount</label>
          <div className="bg-white/80 border border-black/[0.07] rounded-xl px-4 py-3 shadow-sm">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full bg-transparent text-gray-900 text-[22px] font-medium outline-none placeholder:text-gray-300"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Swap arrow */}
        <div className="flex justify-center -my-1">
          <button className="size-10 rounded-full bg-[#FF4D1C] flex items-center justify-center shadow-md hover:bg-[#E8421A] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-white" style={{ fontSize: "22px", fontVariationSettings: `'wght' 600` }}>
              arrow_downward
            </span>
          </button>
        </div>

        {/* To currency dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowToDD((v) => !v); setShowFromDD(false); }}
            className="w-full flex items-center gap-3 bg-white/80 border border-black/[0.07] rounded-xl px-4 py-3.5 shadow-sm cursor-pointer hover:shadow-md transition-all"
          >
            <span className="text-[22px] leading-none">{toCurrency.flag}</span>
            <span className="text-gray-900 text-[15px] font-semibold flex-1 text-left">
              {toCurrency.code} – {toCurrency.name}
            </span>
            <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "20px" }}>expand_more</span>
          </button>
          {showToDD && (
            <div className="absolute z-20 top-full mt-1 w-full bg-white border border-black/[0.08] rounded-xl overflow-hidden shadow-lg">
              {FIAT.map((f) => (
                <button
                  key={f.code}
                  onClick={() => { setToCurrency(f); setShowToDD(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <span className="text-[20px]">{f.flag}</span>
                  <span className="text-gray-900 text-[14px] font-medium">{f.code} – {f.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Indicated amount received */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-500 text-[12px] font-medium px-1">Indicated amount received</label>
          <div className="bg-black/[0.03] border border-black/[0.07] rounded-xl px-4 py-3">
            <p className="text-gray-900 text-[20px] font-medium">
              {received} {toCurrency.code}S
            </p>
          </div>
        </div>

        {/* Info rows */}
        <div className="bg-white/80 border border-black/[0.07] rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/[0.06]">
            <div className="size-9 rounded-lg bg-black/[0.04] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-gray-500" style={{ fontSize: "20px" }}>currency_exchange</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-500 text-[12px] font-medium">Exchange Rate</span>
              <span className="text-gray-900 text-[13px] font-semibold">
                1.00 {fromCurrency.code} = {rate.toLocaleString("en-US", { maximumFractionDigits: 4 })} {toCurrency.code}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="size-9 rounded-lg bg-black/[0.04] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-gray-500" style={{ fontSize: "20px" }}>schedule</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-500 text-[12px] font-medium">Estimated Received Time</span>
              <span className="text-gray-900 text-[14px] font-semibold">5 mins</span>
            </div>
          </div>
        </div>

        {/* Need Support */}
        <p className="text-gray-400 text-[13px] text-center cursor-pointer hover:text-gray-600 transition-colors">
          Need Support?
        </p>

        {/* Confirm button */}
        <button className="w-full bg-[#FF4D1C] text-white py-4 rounded-full text-[17px] font-bold hover:bg-[#E8421A] transition-colors cursor-pointer shadow-md">
          Confirm
        </button>
      </div>
    </div>
  );
}
