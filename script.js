const TOKEN = localStorage.getItem('user.token')
const BASE_URL = 'https://core.chainoflegends.com/api/v1'
const ORDER_ENDPOINT = '/land/2/orders'
const PLAYER_ENDPOINT = '/player'
const BUY_ORDER_ENDPOINT = (id) => '/order/' + id + '/buy'
const SELL_ORDER_ENDPOINT = (id) => '/playerland/' + id + '/place-order'
const MAX_COMMON_PRICE = 34
const SELL_PRICE = (36.4 + Math.random() * 0.1).toFixed(2)

const http = async ({ endpoint, config = {} }) => {
  const defaultConfig = {
    headers: {
      authorization: 'Bearer ' + TOKEN,
      'content-type': 'application/json'
    }
  }
  const res = await fetch(BASE_URL + endpoint, { ...defaultConfig, ...config })
  const jsoned = await res.json()
  return jsoned
}

const sortBy = ({ array, param }) => {
  return [...array].sort((a, b) => a[param] - b[param])
}

const getOrders = async () => {
  const orders = await http({ endpoint: ORDER_ENDPOINT })
  const sortedOrders = sortBy({ array: orders, param: 'ClegPrice' })
  const filtered = sortedOrders.filter(
    ({ ClegPrice }) => ClegPrice <= MAX_COMMON_PRICE
  )
  console.log(filtered)
  return filtered
}

const getPlayerInfo = async () => {
  const playerInfo = await http({ endpoint: PLAYER_ENDPOINT })
  return playerInfo
}

const getBuylableOrders = async (balance) => {
  const allOrders = await getOrders()
  const amountToBuy = Math.floor(balance / MAX_COMMON_PRICE)
  return allOrders.slice(0, amountToBuy)
}

const buyOrders = async (orders) => {
  for (const { ID } of orders) {
    try {
      await http({ endpoint: BUY_ORDER_ENDPOINT(ID) })
      await sellOrder(ID)
    } catch (e) {
      console.log(e)
    }
  }
}

const sellOrder = async (ID) => {
  const sellOrderConfig = {
    method: 'POST',
    body: JSON.stringify({ clegPrice: SELL_PRICE })
  }
  try {
    const res = await http({
      endpoint: SELL_ORDER_ENDPOINT(ID),
      config: sellOrderConfig
    })
    console.log('set to sell', res)
  } catch (e) {
    console.log(e)
  }
}

const app = async () => {
  const { totalCleg } = await getPlayerInfo()
  const buylableOrders = await getBuylableOrders(totalCleg)
  buyOrders(buylableOrders)
}
setInterval(() => {
  app()
}, Math.random() * 10000)
