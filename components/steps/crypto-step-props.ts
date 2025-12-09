// crypto-step-props.ts

export interface SelectedPlan {
  price: number;
  name: string;
}

export interface CryptoStepProps {
  data: {
    email: string;
    plan: string;
    selectedPlan?: SelectedPlan;
    cryptoCurrency?: string;
  };
  onNext: (data: {
    cryptoCurrency: string;
    network: string;
    walletAddress: string;
    orderNumber: string;
    subscriptionId: string;
  }) => void;
  onBack: () => void;
}
