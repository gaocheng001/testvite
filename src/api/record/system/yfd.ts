// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const saveWarehousing=defRouteApi( (params)=>{
  return {
    url: '/yfd/saveWarehousing',
    method: 'POST',
    params
  }
})

export const saveWarehousings=defRouteApi( (params)=>{
  return {
    url: '/yfd/saveWarehousings',
    method: 'POST',
    params
  }
})

export const saveWarehousingsList=defRouteApi( (params)=>{
  return {
    url: '/yfd/saveWarehousingsList',
    method: 'POST',
    params
  }
})

export const findBukongCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/yfd/findBukongCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findMaxCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/yfd/findMaxCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const deleteWarehousingById=defRouteApi( (id)=>{
  return {
    url: '/yfd/deleteWarehousingById?id='+id,
    method: 'DELETE',
  }
})

export const deleteWarehousingsById=defRouteApi( (id)=>{
  return {
    url: '/yfd/deleteWarehousingsById?id='+id,
    method: 'DELETE',
  }
})

export const deleteWarehousingsByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/yfd/deleteWarehousingsByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'DELETE',
  }
})

export const findWarehousingByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/yfd/findWarehousingByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findWarehousingsByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/yfd/findWarehousingsByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findWarehousingList=defRouteApi( ({billStyle,iyear})=>{
  return {
    url: '/yfd/findWarehousingList?billStyle='+billStyle+'&iyear='+iyear,
    method: 'GET',
  }
})

export const findYfdtjbList=defRouteApi( ({bcheck,ddate1,ddate2,apSourceFlag})=>{
  return {
    url: '/yfd/findYfdtjbList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2+'&apSourceFlag='+apSourceFlag,
    method: 'GET',
  }
})

export const findYfdmxbList=defRouteApi( ({bcheck,ddate1,ddate2})=>{
  return {
    url: '/yfd/findYfdmxbList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2,
    method: 'GET',
  }
})

export const findYfdmxzByDateAndCvencodeList=defRouteApi( ({bcheck,ddate1,ddate2,cvencode,apSourceFlag})=>{
  return {
    url: '/yfd/findYfdmxzByDateAndCvencodeList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2+'&cvencode='+cvencode+'&apSourceFlag='+apSourceFlag,
    method: 'GET',
  }
})

export const findYshCgdhdByIyear=defRouteApi( ({ddate1,ddate2})=>{
  return {
    url: '/yfd/findYshCgdhdByIyear?ddate1='+ddate1+'&ddate2='+ddate2,
    method: 'GET',
  }
})

export const findCgfpByIyear=defRouteApi( ({ddate1,ddate2})=>{
  return {
    url: '/yfd/findCgfpByIyear?ddate1='+ddate1+'&ddate2='+ddate2,
    method: 'GET',
  }
})

export const findYfdByDateList=defRouteApi( ({bcheck,iyear,ddate1,ddate2,apSourceFlag})=>{
  return {
    url: '/yfd/findYfdByDateList?bcheck='+bcheck+'&iyear='+iyear+'&ddate1='+ddate1+'&ddate2='+ddate2+'&apSourceFlag='+apSourceFlag,
    method: 'GET',
  }
})

export const findYfdByEndDateList=defRouteApi( ({bcheck,iyear,endDate,apSourceFlag})=>{
  return {
    url: '/yfd/findYfdByEndDateList?bcheck='+bcheck+'&iyear='+iyear+'&endDate='+endDate+'&apSourceFlag='+apSourceFlag,
    method: 'GET',
  }
})
