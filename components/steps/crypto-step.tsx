"use client";

import { useState, useEffect } from "react";
import { QRCodeDisplay } from "../qr-code-display";
// import type { CryptoStepProps } from "./crypto-step-props";
import type { CryptoStepProps } from "./crypto-step-props";

const WALLET_ADDRESSES: Record<string, Record<string, string>> = {
  BTC: {
    "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84",
  },
  ETH: {
    "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84",
  },
  USDT: {
    "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84",
  },
  USDC: {
    "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84",
  },
  XRP: {
    "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84",
  },
  LTC: {
    "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84",
  },
  DOGE: {
    "BEP20 (BSC)": "0xc86b2d5155f07fd72a47ec670d432882bf495e84",
  },
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

      // const priceData = await response.json();
      // console.log("ha lme3na :", priceData);
      // test
      console.log(
        "API URL:",
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
      );
      console.log("Selected crypto:", selectedCrypto);
      console.log("Coin ID:", coinId);
      console.log("Plan price:", data.selectedPlan?.price);

      const priceData = await response.json();
      console.log("Response JSON:", priceData);
      const cryptoPrice = priceData[coinId]?.usd;

      if (!cryptoPrice) {
        throw new Error("Prix non disponible");
      }

      // Calculate crypto amount needed based on USD only
      const amount = usdAmount / Number(cryptoPrice);
      // const amount = 10;
      // setCryptoAmount(amount);
      setCryptoAmount(Number(amount));
    } catch (error) {
      console.error("Error fetching crypto price:", error);
      setPriceError("Erreur lors du calcul du montant");
      setCryptoAmount(null);
    } finally {
      setIsLoadingPrice(false);
    }
  };

  useEffect(() => {
    if (showWallet && selectedCrypto) {
      fetchCryptoPrice();

      // Refresh price every 20 minutes (1200000ms)
      const interval = setInterval(() => {
        fetchCryptoPrice();
      }, 1200000);

      return () => clearInterval(interval);
    }
  }, [showWallet, selectedCrypto, data.selectedPlan?.price]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCrypto) {
      newErrors.crypto = "Veuillez sélectionner une cryptomonnaie";
    }

    if (selectedCrypto && !selectedNetwork) {
      newErrors.network = "Veuillez sélectionner un réseau";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setShowWallet(true);
    }
  };

  const handleContinue = async () => {
    setIsCreating(true);
    try {
      console.log("[v0] Starting crypto subscription creation");
      console.log("[v0] Payment data:", {
        email: data.email,
        plan: data.plan,
        amount: data.selectedPlan?.price || 0,
        paymentMethod: "crypto",
        cryptoCurrency: selectedCrypto,
        cryptoNetwork: selectedNetwork,
        status: "en_cours_de_traitement",
      });

      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          plan: data.plan,
          amount: data.selectedPlan?.price || 0,
          paymentMethod: "crypto",
          cryptoCurrency: selectedCrypto,
          cryptoNetwork: selectedNetwork,
          status: "en_cours_de_traitement",
        }),
      });

      console.log("[v0] API response status:", response.status);

      const result = await response.json();
      console.log("[v0] API response:", result);

      if (!response.ok) {
        throw new Error(
          result.error || "Erreur lors de la création de l'abonnement"
        );
      }

      console.log(
        "[v0] Subscription created successfully, moving to confirmation"
      );

      onNext({
        cryptoCurrency: selectedCrypto,
        network: selectedNetwork,
        walletAddress: WALLET_ADDRESSES[selectedCrypto][selectedNetwork],
        orderNumber: result.orderNumber,
        subscriptionId: result.subscription.id,
      });
    } catch (error) {
      console.error("[v0] Error creating subscription:", error);
      setErrors({
        submit:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getQRCodeImage = () => {
    if (selectedCrypto === "ETH" && selectedNetwork === "BEP20 (BSC)") {
      return "/images/eth-bep20-qr.jpeg";
    }
    if (selectedCrypto === "BTC" && selectedNetwork === "BEP20 (BSC)") {
      return "/images/btc-bep20-qr.png";
    }
    if (selectedCrypto === "USDT" && selectedNetwork === "BEP20 (BSC)") {
      return "/images/usdt-bep20-qr.jpeg";
    }
    if (selectedCrypto === "USDC" && selectedNetwork === "BEP20 (BSC)") {
      return "/images/usdc-bep20-qr.jpeg";
    }
    if (selectedCrypto === "LTC" && selectedNetwork === "BEP20 (BSC)") {
      return "/images/ltc-bep20-qr.jpeg";
    }
    if (selectedCrypto === "XRP" && selectedNetwork === "BEP20 (BSC)") {
      return "/images/xrp-bep20-qr.jpeg";
    }
    if (selectedCrypto === "DOGE" && selectedNetwork === "BEP20 (BSC)") {
      return "/images/doge-bep20-qr.jpeg";
    }
    return undefined;
  };

  const walletAddress =
    selectedCrypto && selectedNetwork
      ? WALLET_ADDRESSES[selectedCrypto][selectedNetwork]
      : "";
  const cryptoData = SUPPORTED_CURRENCIES.find(
    (c) => c.code === selectedCrypto
  );
  const cryptoName = cryptoData?.name;

  if (showWallet) {
    const usdAmount = getUsdAmount(data.selectedPlan?.price || 360);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Adresse de Paiement
          </h2>
          <p className="text-gray-600">
            Envoyez votre {cryptoName} à cette adresse
          </p>
        </div>

        <div className="flex justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <QRCodeDisplay
            value={walletAddress}
            size={250}
            imageUrl={getQRCodeImage()}
          />
        </div>

        {cryptoAmount && !priceError && (
          <div className="flex justify-center">
            <div className="inline-block px-6 py-4 bg-green-50 border-2 border-green-500 rounded-lg">
              <p className="text-center space-y-2">
                {/* <span className="block text-3xl font-bold text-green-600 animate-pulse-slow">
                  {cryptoAmount.toFixed(8)} {selectedCrypto}
                </span> */}
                <span className="block text-3xl font-bold text-green-600 animate-pulse-slow">
                  {Number(cryptoAmount).toFixed(8)} {selectedCrypto}
                </span>
                <span className="block text-sm text-green-700 font-medium">
                  {usdAmount} USD
                </span>
              </p>
            </div>
          </div>
        )}

        {isLoadingPrice && (
          <div className="flex justify-center">
            <p className="text-sm text-gray-600">Calcul du montant...</p>
          </div>
        )}

        {priceError && (
          <div className="flex justify-center">
            <p className="text-sm text-red-600">{priceError}</p>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Adresse du Portefeuille
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={walletAddress}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
              }}
              className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all duration-200"
              title="Copier l'adresse"
            >
              Copier
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-blue-900">ℹ️ Important:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Scannez le code QR ou copiez l'adresse</li>
            <li>
              • Réseau sélectionné: <strong>{selectedNetwork}</strong>
            </li>
            <li>
              • Assurez-vous d'envoyer sur le réseau BEP20 (Binance Smart Chain)
            </li>
            <li>• Les frais de réseau s'appliquent</li>
            <li>• Attendez 1-2 confirmations</li>
          </ul>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setShowWallet(false)}
            disabled={isCreating}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
          >
            Retour
          </button>
          <button
            onClick={handleContinue}
            disabled={isCreating}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
          >
            {isCreating ? "Traitement..." : "J'ai envoyé mon paiement"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Paiement en Cryptomonnaies
        </h2>
        <p className="text-gray-600">
          Sélectionnez votre cryptomonnaie (réseau BEP20 uniquement)
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Cryptomonnaie
        </label>
        {SUPPORTED_CURRENCIES.map((crypto) => (
          <button
            key={crypto.code}
            onClick={() => {
              setSelectedCrypto(crypto.code);
              setSelectedNetwork(crypto.networks[0]);
              setErrors({});
            }}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-4 ${
              selectedCrypto === crypto.code
                ? "border-amber-600 bg-amber-50"
                : "border-gray-300 hover:border-amber-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                selectedCrypto === crypto.code
                  ? "bg-amber-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {crypto.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{crypto.name}</p>
              <p className="text-sm text-gray-600">{crypto.code}</p>
            </div>
            {selectedCrypto === crypto.code && (
              <svg
                className="w-6 h-6 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ))}
      </div>

      {errors.crypto && <p className="text-sm text-red-600">{errors.crypto}</p>}

      {selectedCrypto && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <label className="block text-sm font-medium text-gray-700">
            Réseau Blockchain
          </label>
          <div className="grid grid-cols-1 gap-2">
            {cryptoData?.networks.map((network) => (
              <button
                key={network}
                onClick={() => {
                  setSelectedNetwork(network);
                  setErrors({});
                }}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                  selectedNetwork === network
                    ? "border-amber-600 bg-amber-50 text-amber-900"
                    : "border-gray-300 hover:border-amber-300 text-gray-700"
                }`}
              >
                {network}
              </button>
            ))}
          </div>
        </div>
      )}

      {errors.network && (
        <p className="text-sm text-red-600">{errors.network}</p>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold text-amber-900">
          ⚠️ Attention: Réseau BEP20 uniquement
        </p>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>
            • Tous les paiements doivent être effectués sur le réseau BEP20
            (Binance Smart Chain)
          </li>
          <li>
            • Assurez-vous de sélectionner BEP20/BSC dans votre wallet avant
            d'envoyer
          </li>
          <li>• Les paiements envoyés sur d'autres réseaux seront perdus</li>
          <li>
            • Votre accès sera activé après 1-2 confirmations sur la blockchain
          </li>
        </ul>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Retour
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
