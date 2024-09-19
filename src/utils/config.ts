import dotenv from "dotenv";

dotenv.config();

export const DEFAULT_LIMIT = 10;
export type NETWORKS = "mainnet" | "arbitrum" | "base" | "optimism";

export const API_PRICING = 20;
// export const API_PAYMENT_URL = "mailto:api@ethgas.watch?subject=API Access";
export const API_PAYMENT_URL = "https://buy.stripe.com/00g5ng2e8faa5he7st";

export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",

  INFURA_API_KEY: process.env.INFURA_API_KEY ?? "",
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY ?? "",
};
(() => {
  if (!process.env.INFURA_API_KEY) {
    console.error("You need to provide a INFURA_API_KEY env variable");
  }
  if (!process.env.ALCHEMY_API_KEY) {
    console.error("You need to provide a ALCHEMY_API_KEY env variable");
  }
})();
