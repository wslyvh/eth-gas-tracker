/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog'
import { handle } from 'frog/next'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
})

app.frame('/', async (context) => {
  const url = `${context.url}/gas/latest`
  const res = await fetch(url).then((res) => res.json())
  const data = res.data
  
  return context.res({
    image: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          width: '100%',
          padding: '10px 20px',
          backgroundColor: 'white',

          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <h2>{data.baseFee} @ {data.blockNr}</h2>
      </div>
    ),
    intents: [
      <Button value="apples">Apples</Button>,
      <Button.Link href="https://eth-gas-tracker-dusky.vercel.app/">More</Button.Link>,
    ],
  })
})

export const GET = handle(app)