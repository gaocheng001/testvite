// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

export function findPeriodByYearList(year){
  return defHttp.request({
    url: '/arApPeriod/findPeriodByYearList?year='+year,
    method: 'GET',
  })
}

export const findBeginBalanceByYearList=defRouteApi( ({billStyle,year})=>{
  return {
    url: '/arApPeriod/findBeginBalanceByYearList?billStyle='+billStyle+'&year='+year,
    method: 'GET',
  }
})

export const findSaleousingByDateList=defRouteApi( (billStyle,date)=>{
  return {
    url: '/arApPeriod/findSaleousingByDateList?billStyle='+billStyle+'&date='+date,
    method: 'GET',
  }
})

export const findWarehousingByDateList=defRouteApi( (billStyle,date)=>{
  return {
    url: '/arApPeriod/findWarehousingByDateList?billStyle='+billStyle+'&date='+date,
    method: 'GET',
  }
})

export const findArApYsyfByDateList=defRouteApi( ({billStyle,date})=>{
  return {
    url: '/arApPeriod/findArApYsyfByDateList?billStyle='+billStyle+'&date='+date,
    method: 'GET',
  }
})

export function savePeriod(params){
  return defHttp.request({
    url: '/arApPeriod/savePeriod',
    method: 'POST',
    params
  })
}

export function saveApPeriod(params){
  return defHttp.request({
    url: '/arApPeriod/saveApPeriod',
    method: 'POST',
    params
  })
}
