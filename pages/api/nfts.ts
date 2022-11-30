import * as alchemySdk from "@alch/alchemy-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { alchemy } from "../../lib/sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (session?.user?.name) {
    const Nfts = await alchemySdk.getNftsForOwner(alchemy, session.user.name);

    return res.send({
      content: Nfts,
    });
  }

  res.send({
    error: "You must be signed in to view the protected content on this page.",
  });
}
