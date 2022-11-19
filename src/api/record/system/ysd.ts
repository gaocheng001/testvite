// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const saveSaleousing=defRouteApi( (params)=>{
  return {
    url: '/ysd/saveSaleousing',
    method: 'POST',
    params
  }
})

export const saveSaleousings=defRouteApi( (params)=>{
  return {
    url: '/ysd/saveSaleousings',
    method: 'POST',
    params
  }
})

export const saveSaleousingsList=defRouteApi( (params)=>{
  return {
    url: '/ysd/saveSaleousingsList',
    method: 'POST',
    params
  }
})

export const findBukongCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/ysd/findBukongCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findMaxCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/ysd/findMaxCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const deleteSaleousingById=defRouteApi( (id)=>{
  return {
    url: '/ysd/deleteSaleousingById?id='+id,
    method: 'DELETE',
  }
})

export const deleteSaleousingsById=defRouteApi( (id)=>{
  return {
    url: '/ysd/deleteSaleousingsById?id='+id,
    method: 'DELETE',
  }
})

export const deleteSaleousingsByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/ysd/deleteSaleousingsByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'DELETE',
  }
})

export const findSaleousingByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/ysd/findSaleousingByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findSaleousingsByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/ysd/findSaleousingsByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findSaleousingList=defRouteApi( ({billStyle,iyear})=>{
  return {
    url: '/ysd/findSaleousingList?billStyle='+billStyle+'&iyear='+iyear,
    method: 'GET',
  }
})

export const findYsdtjbList=defRouteApi( ({bcheck,ddate1,ddate2,arSourceFlag})=>{
  return {
    url: '/ysd/findYsdtjbList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2+'&arSourceFlag='+arSourceFlag,
    method: 'GET',
  }
})

export const findYsdmxbList=defRouteApi( ({bcheck,ddate1,ddate2})=>{
  return {
    url: '/ysd/findYsdmxbList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2,
    method: 'GET',
  }
})

export const findYsdmxzByDateAndCvencodeList=defRouteApi( ({bcheck,ddate1,ddate2,cvencode,arSourceFlag})=>{
  return {
    url: '/ysd/findYsdmxzByDateAndCvencodeList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2+'&cvencode='+cvencode+'&arSourceFlag='+arSourceFlag,
    method: 'GET',
  }
})

export const findYsdByDateList=defRouteApi( ({bcheck,iyear,ddate1,ddate2,arSourceFlag})=>{
  return {
    url: '/ysd/findYsdByDateList?bcheck='+bcheck+'&iyear='+iyear+'&ddate1='+ddate1+'&ddate2='+ddate2+'&arSourceFlag='+arSourceFlag,
    method: 'GET',
  }
})

export const findYsdByEndDateList=defRouteApi( ({bcheck,iyear,endDate,arSourceFlag})=>{
  return {
    url: '/ysd/findYsdByEndDateList?bcheck='+bcheck+'&iyear='+iyear+'&endDate='+endDate+'&arSourceFlag='+arSourceFlag,
    method: 'GET',
  }
})

export const findYshXhdByIyear=defRouteApi( ({ddate1,ddate2})=>{
  return {
    url: '/ysd/findYshXhdByIyear?ddate1='+ddate1+'&ddate2='+ddate2,
    method: 'GET',
  }
})

export const findXsfpByIyear=defRouteApi( ({ddate1,ddate2})=>{
  return {
    url: '/ysd/findXsfpByIyear?ddate1='+ddate1+'&ddate2='+ddate2,
    method: 'GET',
  }
})
