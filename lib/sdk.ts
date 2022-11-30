import { initializeAlchemy } from "@alch/alchemy-sdk";

export const alchemy = initializeAlchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
});
