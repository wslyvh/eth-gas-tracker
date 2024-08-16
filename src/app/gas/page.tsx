import { SITE_NAME, SITE_URL, SOCIAL_TWITTER } from "../utils/site";

const title = `Ethereum Gas | ${SITE_NAME}`;
const description =
  "Ethereum gas is the fuel that powers transactions on the Ethereum network. Understanding how it works and setting optimal gas fees can save you money on transaction costs.";

export async function generateMetadata() {
  return {
    applicationName: title,
    title: title,
    metadataBase: new URL(SITE_URL),
    description: description,
    openGraph: {
      type: "website",
      title: title,
      siteName: SITE_NAME,
      description: description,
      url: SITE_URL,
      images: "/opengraph-image",
    },
    twitter: {
      card: "summary_large_image",
      site: SOCIAL_TWITTER,
      title: title,
      description: description,
      images: "/opengraph-image",
    },
  };
}

export default async function Home() {
  return (
    <div className="prose max-w-[1200px] w-11/12 md:w-full">
      <h2 className="text-2xl font-bold">Ethereum Gas</h2>
      <p>
        Ethereum gas is the fuel that powers transactions on the Ethereum
        network. Similar to how a car needs gasoline to drive.
      </p>
      <p>
        Gas refers to the fee paid for processing a transaction on the Ethereum
        blockchain. It is a unit of measure for the amount of computational
        effort required to execute the transaction. Gas fees are paid in Ether
        (ETH), the native currency of the Ethereum blockchain, and are most
        commonly denominated in "gwei", which is a unit of ETH (1e9). Each
        transaction consumes gas units based on its complexity and computational
        requirements.
      </p>

      <h3>Why is Ethereum gas important?</h3>
      <p>
        Gas is a mechanism designed to ensure the efficient and secure execution
        of transactions on the network. It plays a vital role in providing a
        fair, and dynamic market that helps efficient transaction execution and
        to prevent spam, malicious or other accidental activity.
      </p>
      <ul>
        <li>
          <b>Efficient resource allocation</b>
          <br />
          Gas enables transaction processing and efficient resource allocation
          through dynamic fee markets. By requiring users to pay for
          transactions, Ethereum ensures that the network's computational
          resources are allocated to the most valuable transactions, preventing
          congestion and maintaining a stable user experience.
        </li>
        <li>
          <b>Incentivizes validator participation</b>
          <br />
          Validators provide a service to the network by downloading, processing
          and verifying all transactions. They are rewarded for their service
          through block rewards and transaction fees. Incentivizing them to help
          keep the network secure & decentralized.
        </li>
        <li>
          <b>Ensuring transaction execution</b>
          <br />
          Gas helps secure the execution of transactions on the Ethereum network
          by preventing spam, malicious or unintentional activity. By paying a
          transaction fee and limiting the amount of gas each transaction can
          consume, users are discouraged from executing unnecessary or
          computationally expensive transactions. This avoids the network from
          being flooded with unnecessary requests, ensuring that transactions
          are executed efficiently.
        </li>
      </ul>

      <h3>How does Ethereum gas work?</h3>
      <p>
        When you submit a transaction on the network, you need to include the
        gas fee required for it to be executed on the network. The gas fee is
        determined by the gas price and gas limit. The gas price (also called
        base fee) is the amount of Ether you are willing to pay per unit of gas.
        The gas limit is the maximum amount of gas you are willing to spend on
        the transaction. This is typically provided by the wallet or application
        your interacting with. The total gas fee is calculated by multiplying
        the gas price by the gas limit. As a user, this is shown as a base fee
        (required) and a priority fee (optional). Together they can help
        incentivize validators to include your transaction.
      </p>
      <p>
        Validators select transactions based on the price the sender is willing
        to pay. The required base fee is dynamically adjusted by the network,
        based on activity and block utilization. There is no use in setting a
        higher base fee than the current network activity, as any excess will be
        burned (EIP-1559). It is recommended to verify the base fee of the
        current, and pending block to adjust your gas price accordingly. If a
        block is full, the next block will have a higher base fee. If a block is
        underutilized, the base fee will decrease. You can incentivize
        validators by providing an optional tip, called priority fee.
        Transactions with higher priority fees are more likely to be included.
      </p>
      <p>
        You can adjust both fees to influence how soon your transaction is
        included in a block. Keep in mind that setting a low gas price, can
        drastically reduce the cost of your transaction, but it may result in
        your transaction being delayed or not included at all. If you are
        delaying your transaction, make sure that its not time-sensitive (e.g. a
        DeFi swap) and that you are not competing with other users (e.g. a NFT
        Bid).
      </p>

      <h3>Conclusion</h3>
      <p>
        Ethereum gas is an essential component of the Ethereum network, enabling
        transactions and smart contract executions. Understanding how gas works
        and its role in securing the network is crucial for effectively
        interacting with Ethereum. By grasping the fundamentals of gas, you'll
        be better equipped to navigate the complexities of the Ethereum
        blockchain.
      </p>
    </div>
  );
}
