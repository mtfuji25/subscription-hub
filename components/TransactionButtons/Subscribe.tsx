import { PAPAYA_ABI } from "@/lib/papayaAbi";
import {
  PAPAYA_CONTRACT_ADDRESS,
  PAPAYA_PROJECT_ID,
  SUBSCRIPTION_RATE,
} from "@/utils/constants";
import { UseAppKitAccountReturn } from "@reown/appkit";
import { FormEvent, useEffect } from "react";
import { Address, formatUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface SubscribeProps {
  account: UseAppKitAccountReturn;
  toAddress: Address;
  setMessage: (msg: string | null) => void;
  setError: (err: string | null) => void;
}

export const Subscribe: React.FC<SubscribeProps> = ({
  account,
  toAddress,
  setMessage,
  setError,
}) => {
  const {
    data: hash,
    error,
    isError,
    isPending,
    writeContract,
  } = useWriteContract();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    writeContract({
      abi: PAPAYA_ABI,
      address: PAPAYA_CONTRACT_ADDRESS,
      functionName: "subscribe",
      args: [toAddress, SUBSCRIPTION_RATE, PAPAYA_PROJECT_ID],
    });
  }

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle state updates for transaction success
  useEffect(() => {
    if (isConfirmed) {
      setMessage(
        `Subscribed to ${toAddress} at rate=${formatUnits(
          SUBSCRIPTION_RATE,
          18
        )} USDT per second.\n Check your streams: https://app.papaya.finance/wallet/${
          account.address
        }#Streams`
      );
      setError(null);
    }
  }, [isConfirmed, setMessage, setError, toAddress, account.address]);

  // Handle state updates for transaction error
  useEffect(() => {
    if (isError) {
      setError(error?.message || "An unknown error occurred.");
    }
  }, [isError, error, setError]);

  return (
    <form onSubmit={submit}>
      <button
        type="submit"
        disabled={!account || isPending}
        className="bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50"
      >
        Subscribe $1/day
      </button>
    </form>
  );
};
