import { PAPAYA_ABI } from "@/lib/papayaAbi";
import { PAPAYA_CONTRACT_ADDRESS } from "@/utils/constants";
import { UseAppKitAccountReturn } from "@reown/appkit";
import { FormEvent, useEffect } from "react";
import { Address } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface UnsubscribeProps {
  account: UseAppKitAccountReturn;
  fromAddress: Address;
  setMessage: (msg: string | null) => void;
  setError: (err: string | null) => void;
}

export const Unsubscribe: React.FC<UnsubscribeProps> = ({
  account,
  fromAddress,
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
      functionName: "unsubscribe",
      args: [fromAddress],
    });
  }

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle state updates for transaction success
  useEffect(() => {
    if (isConfirmed) {
      setMessage(`Unsubscribed from ${fromAddress}.`);
      setError(null);
    }
  }, [isConfirmed, setMessage, setError, fromAddress]);

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
        className="bg-red-500 text-white px-3 py-2 rounded disabled:opacity-50"
      >
        Unsubscribe
      </button>
    </form>
  );
};
