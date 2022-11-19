// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";



export const findByStockIdToBalanceAndSwsAndSss = defRouteApi( async (id)=>{
  return  {
    url: '/stock/findByStockIdToBalanceAndSwsAndSss?id='+id,
    method: 'POST',timeout: 10000000,
  }
})

export const findStockById = defRouteApi( async (id)=>{
  return  {
    url: '/stock/findStockById?id='+id,
    method: 'POST',timeout: 10000000,
  }
})

export const singleUnitOfMea = defRouteApi( async ()=>{
  return  {
    url: '/stock/singleUnitOfMea',
    method: 'POST',timeout: 10000000,
  }
})
export const multiUnitOfMea = defRouteApi( async ()=>{
  return  {
    url: '/stock/multiUnitOfMea',
    method: 'POST',timeout: 10000000,
  }
})
export const multiUnitOfMeaMX = defRouteApi( async (manyCode)=>{
  return  {
    url: '/stock/multiUnitOfMeaMX?manyCode='+manyCode,
    method: 'POST',timeout: 10000000,
  }
})
export const stockSave = defRouteApi( async (params)=>{
  return  {
    url: '/stock/save',
    method: 'POST',timeout: 10000000,params
  }
})
export const saveList = defRouteApi( async (params)=>{
  return  {
    url: '/stock/saveList',
    method: 'POST',timeout: 10000000,params
  }
})

export const findByStockNum = defRouteApi( async (num)=>{
  return  {
    url: '/stock/findByStockNum?num='+num,
    method: 'POST',timeout: 10000000,
  }
})
export const findByStockNum2 = defRouteApi( async (num)=>{
  return  {
    url: '/stock/findByStockNum2?num='+num,
    method: 'POST',timeout: 10000000,
  }
})

export const findByStockNameAndGgxh = defRouteApi( async ({name,ggxh,ggxhType})=>{
  return  {
    url: '/stock/findByStockNameAndGgxh?name='+name+'&ggxh='+ggxh+'&ggxhType='+ggxhType,
    method: 'POST',timeout: 10000000,
  }
})
export const countByStockUnitBarcode = defRouteApi( async (stockBarcode)=>{
  return  {
    url: '/stock/countByStockUnitBarcode?stockBarcode='+stockBarcode,
    method: 'POST',timeout: 10000000,
  }
})
export const countStock = defRouteApi( async ()=>{
  return  {
    url: '/stock/countStock',
    method: 'GET',timeout: 10000000,
  }
})

export const delFindById = defRouteApi( async (id)=>{
  return  {
    url: '/stock/delFindById?id='+id,
    method: 'POST',timeout: 10000000,
  }
})
export const findAll = defRouteApi( async (params)=>{
  return  {
    url: '/stock/findAll',
    method: 'POST',timeout: 10000000,params
  }
})
export const findAllBySearch = defRouteApi( async (search)=>{
  return  {
    url: '/stock/findAllBySearch?search='+search,
    method: 'POST',timeout: 10000000,
  }
})
export const getMaxStockNumByCodingFlag = defRouteApi( async (params)=>{
  return  {
    url: '/stock/getMaxStockNumByCodingFlag',
    method: 'POST',timeout: 10000000,params
  }
})
export const delAll = defRouteApi( async (params)=>{
  return  {
    url: '/stock/delAll',
    method: 'POST',timeout: 10000000,params
  }
})
export const countByStockClass = defRouteApi( async (stockClass)=>{
  return  {
    url: '/stock/countByStockClass?stockClass='+stockClass,
    method: 'POST',timeout: 10000000,
  }
})
export const editStockFlag = defRouteApi( async (params)=>{
  return  {
    url: '/stock/editStockFlag',
    method: 'POST',timeout: 10000000,params
  }
})
export const importStockColumn = defRouteApi( async (params)=>{
  return  {
    url: '/stock/importStockColumn',
    method: 'POST',timeout: 10000000,params
  }
})
export const findAllByXcl = defRouteApi( async (params)=>{
  return  {
    url: '/stock/currents/getStockXclList',
    method: 'POST',timeout: 10000000,params
  }
})
export const findCunHuoAllByXcl = defRouteApi( async (params)=>{
  return  {
    url: '/stock/findCunHuoAllByXcl',
    method: 'POST',timeout: 10000000,params
  }
})
export const findAllByStockClass = defRouteApi( async (stockClass)=>{
  return  {
    url: '/stock/findAllByStockClass?stockClass='+stockClass,
    method: 'POST',timeout: 10000000,
  }
})

export const verifyStockIsData = defRouteApi( async (stockNum)=>{
  return  {
    url: '/stock/verifyStockIsData?stockNum='+stockNum,
    method: 'POST',timeout: 10000000
  }
})

export function batchStockData(params: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/stock/batchStockData',
    method: 'POST',params
  });
}
export function findByStockSupplierPrice(stockNum: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/stock/findByStockSupplierPrice?stockNum='+stockNum,
    method: 'POST',
  });
}
export const countByStockUnitBarcode1NotInStockNum = defRouteApi( async ({stockNum,stockUnitBarcode1})=>{
  return  {
    url: '/stock/countByStockUnitBarcode1NotInStockNum?stockNum='+stockNum+'&stockUnitBarcode1='+stockUnitBarcode1,
    method: 'POST',timeout: 10000000,
  }
})
export const countByStockUnitBarcode2NotInStockNum = defRouteApi( async ({stockNum,stockUnitBarcode2})=>{
  return  {
    url: '/stock/countByStockUnitBarcode2NotInStockNum?stockNum='+stockNum+'&stockUnitBarcode2='+stockUnitBarcode2,
    method: 'POST',timeout: 10000000,
  }
})
