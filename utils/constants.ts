import { ethers } from "ethers";
import { Address, parseUnits } from "viem";

export const PAPAYA_CONTRACT_ADDRESS =
  "0x1c3E45F2D9Dd65ceb6a644A646337015119952ff";
export const USDT_ADDRESS_POLYGON =
  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
export const BUKOV_ENS = "k06a.eth";
export const BUKOV_FALLBACK =
  "0x083fc10cE7e97CaFBaE0fE332a9c4384c5f54E45" as Address;
export const UNICEF_ADDRESS =
  "0x9CAF1B9144A5eC3aE180539F4dcf404B2D91974b" as Address;
export const PAPAYA_ADDRESS =
  "0x22E0adC1b4e680bB4483aE32BA3f45D2F9BAD67C" as Address;
export const SUBSCRIPTION_RATE = ethers.getBigInt("11574074074074");
export const DEPOSIT_AMOUNT_USDT = parseUnits("10", 6);
export const PAPAYA_PROJECT_ID = BigInt(0);
