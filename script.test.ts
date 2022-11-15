// @ts-ignore
import { TOKEN, MAX_COMMON_PRICE, IPlayerOrder, IOrder, sortBy, getBuylableOrders, getNotSellingOrders, getOrders } from "./script.ts"
// @ts-ignore
import UserService from './src/api/services/userService.ts'
// @ts-ignore
import OrderSerivce from './src/api/services/orderService.ts'
jest.mock('./src/api/services/userService.ts')
jest.mock('./src/api/services/orderService.ts')
describe('script.ts', () => {
  it('should get correct token from localstorage', () => {
    localStorage.setItem('user.token', 'userToken')
    const expected = localStorage.getItem('user.token')
    expect(TOKEN()).toEqual(expected)
  })
  it('should return not selling orders without default land', async () => {
    const orders: IPlayerOrder[] = [
      {
        clegPrice: 1,
        name: 'Common'
      },
      {
        clegPrice: 0,
        name: 'Desert'
      },
      {
        clegPrice: 0,
        name: 'Common'
      }
    ]
    // @ts-ignore
    UserService.playerLand.mockResolvedValue(orders)
    const res = await getNotSellingOrders()
    expect(res).toEqual([orders[2]])
  })
  it('should return sorted by price low to high / lower or equal maxPrice ', async () => {
    const orders: IOrder[] = [
      {
        ClegPrice: 35,
        ID: 0
      },
      {
        ClegPrice: 33,
        ID: 1
      },
      {
        ClegPrice: 32,
        ID: 2
      }
    ]
    const expected = [orders[2], orders[1]]
    // @ts-ignore
    OrderSerivce.obtainOrders.mockResolvedValue(orders)
    const res = await getOrders(MAX_COMMON_PRICE)
    expect(res).toEqual(expected)
  }),
    it('should sort array of objects', () => {
      type UnsortedObject = {
        price: number
      }
      const unsorted: UnsortedObject[] = [
        {
          price: 10
        },
        {
          price: 5
        },
        {
          price: 2
        },
        {
          price: 11
        }
      ]
      const sorted = sortBy({ array: unsorted, param: 'price' })
      expect(sorted).toEqual(unsorted.sort((a, b) => a.price - b.price))
      expect(sorted).not.toBe(unsorted)
    })
  it('get buylable orders depending on max price and balance', async () => {
    const orders: IOrder[] = [
      {
        ClegPrice: 35,
        ID: 0
      },
      {
        ClegPrice: 33,
        ID: 1
      },
      {
        ClegPrice: 32,
        ID: 2
      }
    ]
    OrderSerivce.obtainOrders.mockResolvedValue(orders)
    const res = await getBuylableOrders(66, MAX_COMMON_PRICE)
    console.log(res)
    expect(res).toHaveLength(2)
  })
})
