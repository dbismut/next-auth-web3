import { getCsrfToken, signOut, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import Layout from "../components/layout";

function Siwe() {
  const { connector, isConnected } = useAccount();

  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = async () => {
    try {
      const res = await connectAsync({ connector: connectors[0] });
      const callbackUrl = "/my-nfts";
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.account,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: res.chain.id,
        nonce: await getCsrfToken(),
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error) {
      console.log({ error });
      window.alert(error);
    }
  };

  return (
    <Layout>
      <h1>Connect to see your NFTs</h1>
      {isConnected && connector ? (
        <button
          onClick={() => {
            disconnect();
            signOut();
          }}
        >
          Disconnect
        </button>
      ) : (
        <button onClick={(e) => handleLogin()}>Sign-In with Ethereum</button>
      )}
    </Layout>
  );
}

Siwe.Layout = Layout;

export default Siwe;
