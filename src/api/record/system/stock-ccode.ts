// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findStockCcodeAll=defRouteApi( ()=>{
  return {
    url: '/stockCcode/findAll',
    method: 'GET',
  }
})

export const findByUniqueId=defRouteApi( (uniqueId)=>{
  return {
    url: '/stockCcode/findByUniqueId?uniqueId='+uniqueId,
    method: 'GET',
  }
})

export const saveStockCcode=defRouteApi( (params)=>{
  return {
    url: '/stockCcode/saveStockCcode',
    method: 'POST',
    params
  }
})

export const saveStockCcodes=defRouteApi( (params)=>{
  return {
    url: '/stockCcode/saveStockCcodes',
    method: 'POST',
    params
  }
})

export const deleteByUniqueId=defRouteApi( (uniqueId)=>{
  return {
    url: '/stockCcode/deleteByUniqueId?uniqueId='+uniqueId,
    method: 'DELETE',
  }
})
