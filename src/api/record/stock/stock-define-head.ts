import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const stockDefineHeadFindByAll = defRouteApi( async ()=>{
  return  {
    url: '/stockdefinehead/stockDefineHeadFindByAll',
    method: 'GET',timeout: 10000000,
  }
})

export const countByDefineName = defRouteApi( async (name)=>{
  return  {
    url: '/stockdefinehead/countByDefineName?name='+name,
    method: 'POST',timeout: 10000000,
  }
})
export const stockDefineHeadfindByName = defRouteApi( async (name)=>{
  return  {
    url: '/stockdefinehead/stockDefineHeadfindByName?name='+name,
    method: 'POST',timeout: 10000000,
  }
})
export const stockDefineHeadSave = defRouteApi( async (params)=>{
  return  {
    url: '/stockdefinehead/stockDefineHeadSave',
    method: 'POST',timeout: 10000000,params
  }
})
export const stockDefineHeadDeleteAllById = defRouteApi( async (id)=>{
  return  {
    url: '/stockdefinehead/stockDefineHeadDeleteAllById?id='+id,
    method: 'POST',timeout: 10000000,
  }
})
export const stockDefineHeadEditByFlag = defRouteApi( async (params)=>{
  return  {
    url: '/stockdefinehead/stockDefineHeadEditByFlag',
    method: 'POST',timeout: 10000000,params
  }
})
