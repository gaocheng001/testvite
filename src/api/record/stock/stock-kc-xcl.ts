// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";


export const findByStockXCL = defRouteApi( async (params)=>{
  return  {
    url: '/stockKcXCL/findByStockXCL',
    method: 'POST',timeout: 10000000,params
  }
})

