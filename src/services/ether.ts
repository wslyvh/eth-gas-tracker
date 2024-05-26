export async function getEthPrice() {
  try {
    const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
    const body = await response.json()

    if (body.data.rates.USD) {
      return parseFloat(body.data.rates.USD)
    }
  } catch (e) {
    console.log('Unable to fetch price from coinbase..')
  }

  try {
    const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
    const body = await response.json()

    if (body.USD) {
      return parseFloat(body.usdPrice)
    }
  } catch (e) {
    console.log('Unable to fetch price from cryptocompare..')
  }

  return -1
}