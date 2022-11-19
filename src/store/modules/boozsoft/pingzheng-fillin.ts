import router from '/@/router';
import {defineStore} from 'pinia'
import {store} from '/@/store'

export const usePingZhengFillinStore = defineStore({
  id: 'pingZhengFillinStore',
  state: (): any => ({
    apiDataModels: [
      {
        title: null,
        apiData: null
      }
    ],
  }),
  getters: {
    getApiDataModels() {
      return this.apiDataModels
    }
  },
  actions: {
    openPingZhengAddEditer() {
      router.push('/zhongZhang/vouchers/handle-voucher/tinazhi-voucher')
    },
    openPingZhengShowEditer(apiData) {
      this.apiDataModels[0].title = '查看'
      this.apiDataModels[0].apiData = apiData
      router.push('/zhongZhang/vouchers/handle-voucher/tinazhi-voucher')
    },
    openPingZhengChongXiangEditer(apiData) {
      console.log(apiData)
      apiData.forEach(item => {
        console.log(item.md)
        console.log(item.mc)
          item.md=item.md*-1
          item.mc=item.mc*-1
      })
      this.apiDataModels[0].title = '冲销'
      this.apiDataModels[0].apiData = apiData
      router.push('/zhongZhang/vouchers/handle-voucher/tinazhi-voucher')
    },
    openPingZhengCopyEditer(apiData) {
      this.apiDataModels[0].title = '复制'
      this.apiDataModels[0].apiData = apiData
      apiData.forEach(item => {
        item.uniqueCode=null
        // console.log(item.md)
        // console.log(item.mc)
        // item.md=item.md*-1
        // item.mc=item.mc*-1
      })
      // console.log(apiData)
      router.push('/zhongZhang/vouchers/handle-voucher/tinazhi-voucher')
    },
    openPingZhengEditEditer(apiData) {
      this.apiDataModels[0].title = '修改'
      this.apiDataModels[0].apiData = apiData
      router.push('/zhongZhang/vouchers/handle-voucher/tinazhi-voucher')
    },
    // setApiDataModels(apiData){
    //   this.apiDataModels=apiData
    // }
  }
})

// Need to be used outside the setup
export function usePingZhengFillinStoreWidthOut() {
  return usePingZhengFillinStore(store)
}
