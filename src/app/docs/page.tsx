import { SITE_NAME, SITE_URL, SOCIAL_TWITTER } from "../utils/site";

const title = `API Docs @ ${SITE_NAME}`;
const description =
  "This API provides latest and historical gas prices for the Ethereum network and various layer 2 solutions, like Arbitrum, Optimism and Base.";

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
    <div className="prose">
      <h2>Ethereum Gas API</h2>
      <p>{description}</p>

      <h3>Supported networks</h3>
      <ul>
        <li>Ethereum Mainnet (default)</li>
        <li>Arbitrum</li>
        <li>Optimism</li>
        <li>Base</li>
      </ul>
      <p>
        All endpoints can be appended with any of the supported networks (lower
        case) e.g.
        <br />
        <ul>
          <li>
            https://www.ethgastracker.com/api/gas/latest/<b>base</b>
          </li>
        </ul>
      </p>

      <h3>Endpoints</h3>
      <ul>
        <li>
          <code>/oracle</code> or <code>/oracles/[network]</code> - Get the
          latest gas prices and estimates for gas fees.
          <br />
          <p>
            <b>Response</b>
            <pre>
              <code>
                {`{
    "data": {
        "blockNr": "20505507",
        "timestamp": 1723380959,
        "ethPrice": 2635.57,
        "baseFee": 2967671685,
        "nextFee": 3129340348,
        "estimates": {
            "maxFeePerGas": 3562206022,
            "maxPriorityFeePerGas": 1000000
        },
        "oracle": {
            "slow": 3.24,
            "normal": 5.36,
            "fast": 12.94
        },
        "lastUpdate": 1723381091617
    }
}`}
              </code>
            </pre>
          </p>
        </li>
        <li>
          <code>/latest</code> or <code>/latest/[network]</code> - Get the
          latest gas prices and block utilization.
          <br />
          <p>
            <b>Response</b>
            <pre>
              <code>
                {`{
    "data": {
        "blockNr": "20504050",
        "timestamp": 1723363343,
        "baseFee": 0.95,
        "nextFee": 0.92,
        "difference": -0.03,
        "gasLimit": 30000000,
        "gasUsed": 10737402,
        "utilization": 36,
        "transactionCount": 122,
        "lastUpdate": 1723368892836
    }
}`}
              </code>
            </pre>
          </p>
        </li>
        <li>
          <code>/[blockNr]</code> or <code>/[blockNr]/[network]</code> - Get the
          gas prices for a specific block. Only supports blocks since EIP-1559.
          <br />
          <p>
            <b>
              Response <span className="text-xs ml-2">same as /latest</span>
            </b>
            <pre>
              <code>
                {`{
    "data": {
        "blockNr": "15537394",
        "timestamp": 1663224179,
        "baseFee": 48.81,
        "nextFee": 54.91,
        "difference": 6.1,
        "gasLimit": 30000000,
        "gasUsed": 29983006,
        "utilization": 100,
        "transactionCount": 80,
        "lastUpdate": 1723368915518
    }
}`}
              </code>
            </pre>
          </p>
        </li>
        <li>
          <code>/history</code> or <code>/history/[network]</code> - Get the gas
          prices of the latest x number of blocks (50 by default).
          <p>
            <b>Response</b>
            <pre>
              <code>{`{
    "data": {
        "blocks": [
            {
                "blockNr": 20504260,
                "baseFee": 0.8,
                "txCount": 59,
                "min": 0.8,
                "max": 502,
                "avg": 32.7,
                "median": 2.0549999999999997,
                "ethPrice": 2681.275,
                "gasLimit": 30000000,
                "gasUsed": 29982569,
                "date": "2024-08-11T08:44:35.000Z",
                "timestamp": 1723365875
            },
            {
                "blockNr": 20504259,
                "baseFee": 0.87,
                "txCount": 58,
                "min": 0.87,
                "max": 502,
                "avg": 33.88,
                "median": 2.05,
                "ethPrice": 2681.275,
                "gasLimit": 30000000,
                "gasUsed": 5120176,
                "date": "2024-08-11T08:44:23.000Z",
                "timestamp": 1723365863
            },
        ],
        "lastUpdate": 1723369133230
    }
}`}</code>
            </pre>
          </p>
        </li>
        <li>
          <code>/average</code> or <code>/average/[network]</code> - Gets the
          hourly average gas prices of the past week.
          <p>
            <b>Response</b>
            <pre>
              <code>
                {`{
    "data": {
        "data": [
            {
                "period": "2024-08-11T08:00:00+00:00",
                "baseFee": 0.9648648648648648,
                "gasLimit": 30000263.91891892,
                "gasUsed": 15137036.274774775,
                "txCount": 93.79,
                "min": 0.9805855855855856,
                "max": 1.9805855855855856,
                "median": 2.070743243243243,
                "ethPrice": 2679.635518018018
            },
            {
                "period": "2024-08-11T07:00:00+00:00",
                "baseFee": 0.9125838926174497,
                "gasLimit": 30000000,
                "gasUsed": 15264319.5,
                "txCount": 90.35833333333333,
                "min": 0.9273154362416106,
                "max": 1.9273154362416106,
                "median": 1.7994295302013423,
                "ethPrice": 2672.2797483221475
            },
        ],
        "lastUpdate": 1723369158692
    }
}`}
              </code>
            </pre>
          </p>
        </li>
      </ul>
    </div>
  );
}
