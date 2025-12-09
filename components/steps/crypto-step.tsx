// Rectified version of the CryptoStep component

"use client";

import { useState, useEffect } from "react";
import { QRCodeDisplay } from "../qr-code-display";
import type { CryptoStepProps } from "./crypto-step-props";

const WALLET_ADDRESSES: Record<string, Record<string, string>> = {
  BTC: { "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84" },
  ETH: { "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84" },
  USDT: { "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84" },
  USDC: { "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84" },
  XRP: { "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84" },
  LTC: { "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84" },
  DOGE: { "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84" },
};

const SUPPORTED_CURRENCIES = [
  {
    code: "BTC",
    name: "Bitcoin (BEP20)",
    icon: "₿",
    networks: ["BEP20 (BSC)"],
  },
  {
    code: "ETH",
    name: "Ethereum (BEP20)",
    icon: "Ξ",
    networks: ["BEP20 (BSC)"],
  },
  {
    code: "USDT",
    name: "Tether (BEP20)",
    icon: "₮",
    networks: ["BEP20 (BSC)"],
  },
  {
    code: "USDC",
    name: "USD Coin (BEP20)",
    icon: "◎",
    networks: ["BEP20 (BSC)"],
  },
  { code: "XRP", name: "Ripple (BEP20)", icon: "✕", networks: ["BEP20 (BSC)"] },
  {
    code: "LTC",
    name: "Litecoin (BEP20)",
    icon: "Ł",
    networks: ["BEP20 (BSC)"],
  },
  {
    code: "DOGE",
    name: "Dogecoin (BEP20)",
    icon: "🐕",
    networks: ["BEP20 (BSC)"],
  },
];

export function CryptoStep({ data, onNext, onBack }: CryptoStepProps) {
  const [selectedCrypto, setSelectedCrypto] = useState(
    data.cryptoCurrency || ""
  );
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showWallet, setShowWallet] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState<number | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  const COINGECKO_IDS: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    USDC: "usd-coin",
    XRP: "ripple",
    LTC: "litecoin",
    DOGE: "dogecoin",
  };

  const getUsdAmount = (madPrice: number): number => {
    const priceMap: Record<number, number> = {
      360: 39,
      600: 65,
      960: 104,
    };
    return priceMap[madPrice];
  };

  const fetchCryptoPrice = async () => {
    if (!selectedCrypto || !data.selectedPlan?.price) return;

    setIsLoadingPrice(true);
    setPriceError(null);

    try {
      const coinId = COINGECKO_IDS[selectedCrypto];
      const usdAmount = getUsdAmount(data.selectedPlan.price);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
      );

      if (!response.ok) {
        throw new Error("Impossible de récupérer le prix");
      }

      const priceData = await response.json();
      const cryptoPrice = Number(priceData[coinId]?.usd);

      if (!cryptoPrice || !isFinite(cryptoPrice)) {
        throw new Error("Prix non disponible");
      }

      const amount = getUsdAmount(data.selectedPlan.price) / cryptoPrice;
      if (typeof amount === "number" && isFinite(amount)) {
        setCryptoAmount(amount);
      } else {
        throw new Error("Montant invalide");
      }
    } catch (error) {
      console.error("Erreur API CoinGecko:", error);
      setPriceError("Erreur lors du calcul du montant");
      setCryptoAmount(null);
    } finally {
      setIsLoadingPrice(false);
    }
  };

  useEffect(() => {
    if (showWallet && selectedCrypto) {
      fetchCryptoPrice();
      const interval = setInterval(() => fetchCryptoPrice(), 1200000);
      return () => clearInterval(interval);
    }
  }, [showWallet, selectedCrypto, data.selectedPlan?.price]);

  // ...rest of your original component code remains unchanged...

  // Replace this block in your JSX:
  // {cryptoAmount && !priceError && (

  // With this corrected version:

  {
    typeof cryptoAmount === "number" &&
      isFinite(cryptoAmount) &&
      !priceError && (
        <div className="flex justify-center">
          <div className="inline-block px-6 py-4 bg-green-50 border-2 border-green-500 rounded-lg">
            <p className="text-center space-y-2">
              <span className="block text-3xl font-bold text-green-600 animate-pulse-slow">
                {cryptoAmount.toFixed(8)} {selectedCrypto}
              </span>
              <span className="block text-sm text-green-700 font-medium">
                {getUsdAmount(data.selectedPlan?.price || 360)} USD
              </span>
            </p>
          </div>
        </div>
      );
  }
}
