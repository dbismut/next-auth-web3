import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/layout";
import AccessDenied from "../components/access-denied";
// import { sdk } from "../lib/sdk";

function NFT({ title, description, media }: any) {
  return (
    <div>
      <h3>{title}</h3>
      <img src={media[0].thumbnail} alt={title} style={{ width: "100%" }} />
      <p>
        <small>{description}</small>
      </p>
    </div>
  );
}

function NFTList() {
  const [Nfts, setNFTs] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/nfts");
      const json = await res.json();
      console.log({ json });
      setNFTs(json.content);
      setLoading(false);
    };
    fetchData();
  }, []);

  return loading ? (
    <h3>Loading…</h3>
  ) : (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridGap: 10,
      }}
    >
      {Nfts?.ownedNfts?.map((n: any) => (
        <NFT key={n.tokenId} {...n} />
      ))}
    </div>
  );
}

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  // If session exists, display content
  return (
    <Layout>
      <h1>My Nfts</h1>
      <NFTList />
    </Layout>
  );
}
