import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findAllKeMuCode = defRouteApi( async (params:any)=>{
  return  {
    url:'/carryForward/kemuList',
    timeout:10000000,
    method: 'GET',
    params
  }
})


export const findAllCorresponds = defRouteApi( async (params:any)=>{
  return  {
    url:'/carryForward/carryover/list',
    timeout:10000000,
    method: 'POST',
    params
  }
})

export const carryoverSaveApi = defRouteApi( async (params:any)=>{
  return  {
    url:'/carryForward/carryover/save',
    timeout:10000000,
    method: 'POST',
    params
  }
})

export const carryoverDeleteApi = defRouteApi( async (params:any)=>{
  return  {
    url:'/carryForward/carryover',
    method: 'DELETE',
    params
  }
})

export const carryoverCheckApi = defRouteApi( async (params:any)=>{
  return  {
    url:'/carryForward/carryover/checkNumAndName',
    method: 'POST',
    params
  }
})
