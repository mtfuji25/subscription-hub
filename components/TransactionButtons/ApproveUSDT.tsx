import { ERC20_ABI } from "@/lib/erc20Abi";
import {
  PAPAYA_CONTRACT_ADDRESS,
  USDT_ADDRESS_POLYGON,
} from "@/utils/constants";
import { UseAppKitAccountReturn } from "@reown/appkit";
import { FormEvent, useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface ApproveUSDTProps {
  account: UseAppKitAccountReturn;
  approvalAmount: bigint;
  setMessage: (msg: string | null) => void;
  setError: (err: string | null) => void;
}

export const ApproveUSDT: React.FC<ApproveUSDTProps> = ({
  account,
  approvalAmount,
  setMessage,
  setError,
}) => {
  const {
    data: hash,
    isError,
    error,
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
      abi: ERC20_ABI,
      address: USDT_ADDRESS_POLYGON,
      functionName: "approve",
      args: [PAPAYA_CONTRACT_ADDRESS, approvalAmount],
    });
  }

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle state updates for transaction success
  useEffect(() => {
    if (isConfirmed) {
      setMessage("Successfully approved USDT for Papaya.");
      setError(null);
    }
  }, [isConfirmed, setMessage, setError]);

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
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Approve
      </button>
    </form>
  );
};
