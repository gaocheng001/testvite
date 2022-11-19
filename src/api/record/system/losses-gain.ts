import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findAll = defRouteApi( async (params:any)=>{
  return  {
    url: '/company/loss/findAll',
    timeout:10000000,
    method: 'POST',
    params
  }
})
export const findByCcode = defRouteApi( async (params:any)=>{
  return  {
    url: '/company/loss/findByCcode',
    timeout:10000000,
    method: 'POST',
    params
  }
})
export const setPingZhengSave = defRouteApi( async (params:any)=>{
  return  {
    url: '/company/loss/setPingZhengSave',
    timeout:10000000,
    method: 'POST',
    params
  }
})
export const getLastDayOfMonth = defRouteApi( async (iyearAndMonth:any)=>{
  return  {
    url: '/company/loss/getLastDayOfMonth?iyearAndMonth='+iyearAndMonth,
    timeout:10000000,
    method: 'POST',
  }
})
