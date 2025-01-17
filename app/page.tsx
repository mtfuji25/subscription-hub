"use client";

import {
  BUKOV_FALLBACK,
  DEPOSIT_AMOUNT_USDT,
  PAPAYA_ADDRESS,
  PAPAYA_CONTRACT_ADDRESS,
  UNICEF_ADDRESS,
  USDT_ADDRESS_POLYGON,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { ApproveUSDT } from "@/components/TransactionButtons/ApproveUSDT";
import { DepositUSDT } from "@/components/TransactionButtons/DepositUSDT";
import { Subscribe } from "@/components/TransactionButtons/Subscribe";
import { Unsubscribe } from "@/components/TransactionButtons/Unsubscribe";
import { useReadContract } from "wagmi";
import { ERC20_ABI } from "@/lib/erc20Abi";
import { Address, formatUnits } from "viem";
import { PAPAYA_ABI } from "@/lib/papayaAbi";
import { SubscriptionInfo } from "@/types";
import React from "react";

export default function Home() {
  // UI states
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bukovAddress, setBukovAddress] = useState(BUKOV_FALLBACK);
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionInfo>();

  const account = useAppKitAccount();

  // Get USDT Balance
  const { data: balanceData } = useReadContract({
    address: USDT_ADDRESS_POLYGON,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [account?.address as Address],
  });

  useEffect(() => {
    if (balanceData) {
      setUsdtBalance(Number(formatUnits(balanceData, 6)).toFixed(2));
    }
  }, [balanceData]);

  // Get USDT Allowance to Papaya contract
  const { data: allowanceData } = useReadContract({
    address: USDT_ADDRESS_POLYGON,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [account.address as Address, PAPAYA_CONTRACT_ADDRESS],
  });

  useEffect(() => {
    if (allowanceData) {
      setAllowance(BigInt(allowanceData.toString()));
    }
  }, [allowanceData]);

  // Fetch subscriptions
  const { data: subscriptionData } = useReadContract({
    address: PAPAYA_CONTRACT_ADDRESS,
    abi: PAPAYA_ABI,
    functionName: "allSubscriptions",
    args: [account?.address as Address],
  });

  useEffect(() => {
    if (subscriptionData && subscriptionData.length > 0) {
      setSubscriptions(subscriptionData as SubscriptionInfo);
    }
  }, [subscriptionData]);

  const isSubscribedTo = (wallet: `0x${string}`) => {
    return subscriptions?.[0]?.includes(wallet) ?? false;
  };

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-slate-800 border-b p-4 flex justify-between items-center">
        <h1 className="text-lg text-white font-bold">Subscription Hub</h1>
        {React.createElement("appkit-button")}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-3xl w-full mx-auto p-4 space-y-6">
        {/* Messages */}
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded">
            {message}
          </div>
        )}

        {/* USDT Balance */}
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold">Your USDT Balance</h2>
          <p>{usdtBalance} USDT</p>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold">Your Active Subscriptions</h2>
          <ul className="list-disc ml-5">
            {subscriptions &&
              subscriptions[0].map((data) => <li key={data}>{data}</li>)}
          </ul>
        </div>

        {/* Deposit Section */}
        <section className="bg-white p-5 rounded shadow">
          <h2 className="text-xl font-semibold">Deposit to Papaya</h2>
          <p className="text-sm text-gray-600 mt-1">
            You must first approve Papaya to pull USDT from your wallet, then
            deposit. I will deposit <strong>10 USDT</strong>.
          </p>
          {allowance != null && allowance >= DEPOSIT_AMOUNT_USDT ? (
            <DepositUSDT
              account={account}
              depositAmount={BigInt(DEPOSIT_AMOUNT_USDT)}
              setMessage={setMessage}
              setError={setError}
            />
          ) : (
            <ApproveUSDT
              account={account}
              approvalAmount={BigInt(DEPOSIT_AMOUNT_USDT)}
              setMessage={setMessage}
              setError={setError}
            />
          )}
        </section>

        {/* Subscription Cards */}
        <section className="space-y-6">
          {/* Bukov */}
          <div className="bg-white p-5 rounded shadow">
            <h3 className="text-lg font-semibold">Support Anton Bukov</h3>
            <p className="text-sm text-gray-700">$1 daily contribution</p>
            <div className="flex space-x-4 mt-2">
              <Subscribe
                account={account}
                toAddress={bukovAddress}
                setMessage={setMessage}
                setError={setError}
              />
              {isSubscribedTo(bukovAddress) && (
                <Unsubscribe
                  account={account}
                  fromAddress={bukovAddress}
                  setMessage={setMessage}
                  setError={setError}
                />
              )}
            </div>
          </div>

          {/* UNICEF */}
          <div className="bg-white p-5 rounded shadow">
            <h3 className="text-lg font-semibold">Support UNICEF Daily</h3>
            <p className="text-sm text-gray-700">
              $1 daily for children in need
            </p>
            <div className="flex space-x-4 mt-2">
              <Subscribe
                account={account}
                toAddress={UNICEF_ADDRESS}
                setMessage={setMessage}
                setError={setError}
              />
              {isSubscribedTo(UNICEF_ADDRESS) && (
                <Unsubscribe
                  account={account}
                  fromAddress={UNICEF_ADDRESS}
                  setMessage={setMessage}
                  setError={setError}
                />
              )}
            </div>
          </div>

          {/* Papaya */}
          <div className="bg-white p-5 rounded shadow">
            <h3 className="text-lg font-semibold">Support Papaya</h3>
            <p className="text-sm text-gray-700">$1 daily for Papaya</p>
            <div className="flex space-x-4 mt-2">
              <Subscribe
                account={account}
                toAddress={PAPAYA_ADDRESS}
                setMessage={setMessage}
                setError={setError}
              />
              {isSubscribedTo(PAPAYA_ADDRESS) && (
                <Unsubscribe
                  account={account}
                  fromAddress={PAPAYA_ADDRESS}
                  setMessage={setMessage}
                  setError={setError}
                />
              )}
            </div>
          </div>
        </section>

        <p className="text-xs text-gray-600 mt-4">
          <strong>Important:</strong> You are responsible for managing and
          canceling your own subscriptions. Please ensure you keep track of your
          active subscriptions and cancel them when needed.
        </p>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t p-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Subscription Hub.
      </footer>
    </div>
  );
}
