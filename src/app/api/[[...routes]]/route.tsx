/** @jsxImportSource frog/jsx */
import { SITE_EMOJI, SITE_NAME, SITE_URL } from '@/app/utils/site'
import { fetchLatestGas } from '@/services/gas'
import dayjs from 'dayjs'
import { Button, Frog } from 'frog'
import { handle } from 'frog/next'

const app = new Frog({
  basePath: '/api',
  verify: false,
})

app.frame('/', async (context) => {
  const url = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : SITE_URL;
  const data = await fetchLatestGas(url);

  return context.res({
    headers:{
      'Cache-Control': `max-age=12`,
    },
    image: (
      <div tw="flex flex-col w-full h-full bg-white p-8 text-xl">
        <h1 tw='text-3xl'>
          <span tw="pr-4">{SITE_EMOJI}</span> {SITE_NAME}
        </h1>
  
        <div tw="flex relative grow w-auto h-auto justify-center my-8">
          <div tw="flex flex-col items-center justify-center rounded-full bg-slate-100 h-72 w-72">
            <span tw="text-8xl">{data.nextFee}</span>
            <span tw="text-2xl text-slate-500 mt-2">Gwei</span>
          </div>
  
          <div tw="flex flex-col mt-8">
            <span tw={`py-1 px-2 rounded-xl ${
              data.difference >= 0 ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'}`}>
              {data.difference}%
            </span>
          </div>
        </div>
  
        <div tw="flex flex-col">
          <div tw="flex justify-between">
            <div tw="flex flex-col">
              <span tw="text-4xl">Block # {data.blockNr}</span>
              <span tw="text-slate-400">
                {data.transactionCount} transactions
              </span>
            </div>
            <div tw="flex flex-col">
              <span tw="text-4xl">{data.utilization}%</span>
              <span tw="text-slate-400">
                {Math.round(data.gasUsed / 1e6)}M /{" "}
                {Math.round(data.gasLimit / 1e6)}M
              </span>
            </div>
          </div>
  
          <div tw="flex bg-slate-300 mt-4 w-full rounded-xl">
            <span
              tw={`bg-[#4a00ff] w-[${data.utilization}%] h-2 rounded-xl`}
            ></span>
          </div>
  
          <span tw="text-slate-600 mt-2">
            {dayjs.unix(data.timestamp).format("MMM DD · HH:mm:ss")} UTC
          </span>
        </div>
      </div>
    ),
    intents: [
      <Button value="">Latest</Button>,
      <Button.Link href="https://www.ethgastracker.com/">More info</Button.Link>,
    ],
  })
})

export const GET = handle(app)
export const POST = handle(app)
