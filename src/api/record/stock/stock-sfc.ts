// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";


export const findByStockSFCNumberOrMoney = defRouteApi( async (params)=>{
  return  {
    url: '/stock/sfc/numberOrMoney',
    method: 'POST',timeout: 10000000,params
  }
})
