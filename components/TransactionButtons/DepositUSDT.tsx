import { PAPAYA_ABI } from "@/lib/papayaAbi";
import { PAPAYA_CONTRACT_ADDRESS } from "@/utils/constants";
import { UseAppKitAccountReturn } from "@reown/appkit";
import { FormEvent, useEffect } from "react";
import { formatUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface DepositUSDTProps {
  account: UseAppKitAccountReturn;
  depositAmount: bigint;
  setMessage: (msg: string | null) => void;
  setError: (err: string | null) => void;
}

export const DepositUSDT: React.FC<DepositUSDTProps> = ({
  account,
  depositAmount,
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

    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }

    writeContract({
      abi: PAPAYA_ABI,
      address: PAPAYA_CONTRACT_ADDRESS,
      functionName: "deposit",
      args: [depositAmount, false],
    });
  }

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle state updates for transaction success
  useEffect(() => {
    if (isConfirmed) {
      setMessage(
        `Successfully deposited ${formatUnits(depositAmount, 6)} USDT.`
      );
      setError(null);
    }
  }, [isConfirmed, setMessage, setError, depositAmount]);

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
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Processing..." : "Deposit 10 USDT"}
      </button>
    </form>
  );
};
