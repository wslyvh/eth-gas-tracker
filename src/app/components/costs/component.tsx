import { GasInfo } from "@/services/gas";
import dayjs from "dayjs";

interface Props {
  data: GasInfo;
}

const transactions = [
  { name: "ETH Transfer", cost: 21000 },
  { name: "ERC20 Approval", cost: 45000 },
  { name: "ERC20 Token Transfer", cost: 65000 },
  { name: "ERC721 NFT Transfer", cost: 85000 },
  { name: "Uniswap V2 Swap", cost: 150000 },
  { name: "Uniswap V3 Swap", cost: 185000 },
  { name: "OpenSea Sale", cost: 205000 },
  { name: "Uniswap V3 Liquidity", cost: 215000 },
  { name: "L2 Deposits (Arbitrum, zkSync, Polygon,..)", cost: 250000 },
  { name: "ENS Registration", cost: 265000 },
];

export function TransactionCosts({ data }: Props) {
  return (
    <div className="flex flex-col bg-white rounded-xl w-full max-w-[1200px] aspect-[1.91/1] p-4 md:p-12">
      <div className="flex justify-between">
        <h2 className="text-3xl">Transaction Costs  <span className='text-xs'>Updated {dayjs(data.lastUpdate).format("HH:mm:ss")} UTC</span></h2>
      </div>

      <div className="flex relative grow w-auto h-auto overflow-x-auto my-4">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Gwei</th>
              <th>USD</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((i) => {
              return (
                <tr key={i.name}>
                  <td>{i.name}</td>
                  <td>{i.cost.toLocaleString("en-US")}</td>
                  <td>${((data.baseFee * i.cost) / 1e9 * data.ethPrice).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
