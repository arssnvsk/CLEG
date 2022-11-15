const TOKEN = localStorage.getItem('user.token')
const BASE_URL = 'https://core.chainoflegends.com/api/v1'
const ORDER_ENDPOINT = '/land/2/orders'
const PLAYER_ENDPOINT = '/player'
const PLAYER_LAND_ENDPOINT = '/playerland'
const BUY_ORDER_ENDPOINT = (id: number) => '/order/' + id + '/buy'
const SELL_ORDER_ENDPOINT = (id: number) => '/playerland/' + id + '/place-order'
const MAX_COMMON_PRICE = 34

type IOrder = {
  ClegPrice: number,
  ID: number
}

const http = async ({ endpoint, config = {} }: { endpoint: string, config?: object }) => {
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

const sortBy = <T>({ array, param }: { array: T[], param: keyof T }) => {
  return [...array].sort((a, b) => Number(a[param]) - Number(b[param]))
}

const getOrders = async (): Promise<IOrder[]> => {
  const orders: IOrder[] = await http({ endpoint: ORDER_ENDPOINT })
  const sortedOrders = sortBy({ array: orders, param: 'ClegPrice' })
  const filtered = sortedOrders.filter(
    ({ ClegPrice }) => ClegPrice <= MAX_COMMON_PRICE
  )
  return filtered
}

const getPlayerInfo = async () => {
  const playerInfo = await http({ endpoint: PLAYER_ENDPOINT })
  return playerInfo
}

const getBuylableOrders = async (balance: number) => {
  const allOrders: IOrder[] = await getOrders()
  const amountToBuy = Math.floor(balance / MAX_COMMON_PRICE)
  return allOrders.slice(0, amountToBuy)
}

const buyOrders = async (orders: IOrder[]) => {
  for (const { ID } of orders) {
    try {
      await http({ endpoint: BUY_ORDER_ENDPOINT(ID) })
    } catch (e) {
      console.log(e)
    }
  }
}

const getNotSellingOrders = async () => {
  const DESERT = 'Desert'
  const orders = await http({ endpoint: PLAYER_LAND_ENDPOINT })
  const notSellingorders = orders.filter(
    ({ clegPrice, name }: { clegPrice: number, name: string }) => clegPrice === 0 && name !== DESERT
  )
  console.log('not sell orders', notSellingorders)
  return notSellingorders
}

const sellOrders = async () => {
  const SELL_PRICE = (36.4 + Math.random() * 0.1).toFixed(2)
  const sellOrderConfig = {
    method: 'POST',
    body: JSON.stringify({ clegPrice: SELL_PRICE })
  }

  const orders = await getNotSellingOrders()
  for (const { id } of orders) {
    try {
      const res = await http({
        endpoint: SELL_ORDER_ENDPOINT(id),
        config: sellOrderConfig
      })
      console.log('set to sell', res)
    } catch (e) {
      console.log(e)
    }
  }
}

const app = async () => {
  const { totalCleg } = await getPlayerInfo()
  const buylableOrders: IOrder[] = await getBuylableOrders(totalCleg)
  if (!buylableOrders.length) return
  await buyOrders(buylableOrders)
  await sellOrders()
}
// setInterval(() => {
//   app()
// }, Math.random() * 10000)

console.log('From typescript')