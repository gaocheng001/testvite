import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const stockDefineBodyFindByAll = defRouteApi( async (headName)=>{
  return  {
    url: '/stockdefinebody/stockDefineBodyFindByAll?headName='+headName,
    method: 'POST',timeout: 10000000,
  }
})

export const stockDefineBodySave = defRouteApi( async (params)=>{
  return  {
    url: '/stockdefinebody/stockDefineBodySave',
    method: 'POST',timeout: 10000000,params
  }
})
export const stockDefineBodyDelById = defRouteApi( async (params)=>{
  return  {
    url: '/stockdefinebody/stockDefineBodyDelById',
    method: 'POST',timeout: 10000000,params
  }
})
export const stockDefineBodyDelByHeadId = defRouteApi( async (headId)=>{
  return  {
    url: '/stockdefinebody/stockDefineBodyDelByHeadId?headId='+headId,
    method: 'POST',timeout: 10000000,
  }
})

export const importStockDefineBody = defRouteApi(async (params) => {
  return {
    url: '/stockdefinebody/importStockDefineBody',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const countBodyByHeadIdAndDeName = defRouteApi( async ({headId,deName})=>{
  return  {
    url: '/stockdefinebody/countBodyByHeadIdAndDeName?headId='+headId+'&deName='+deName,
    method: 'POST',timeout: 10000000,
  }
})
