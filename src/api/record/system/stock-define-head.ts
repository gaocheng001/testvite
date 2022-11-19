// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findStockDefineHeadList=defRouteApi( ()=>{
  return {
    url: '/stockdefinehead/findAll',
    method: 'GET',
  }
})

export const getStockDefineHeadList=defRouteApi( ()=>{
  return {
    url: '/stockdefinehead/getAll',
    method: 'GET',
  }
})

export const saveStockDefineHead=defRouteApi((params:any)=>{
  return {
    url: '/stockdefinehead',
    method: 'POST',
    params
  }
})

export const deleteStockDefineHead=defRouteApi((params:any)=>{
  return {
    url: '/stockdefinehead/del',
    method: 'DELETE',
    params
  }
})

export const deleteStockDefineHeadList=defRouteApi((params:any)=>{
  return {
    url: '/stockdefinehead/deleteList',
    method: 'DELETE',
    params
  }
})

export const findByCode=defRouteApi((defineCode:any)=>{
  return {
    url: '/stockdefinehead/findByCode?defineCode='+defineCode,
    method: 'GET',
  }
})
export const findByName=defRouteApi((defineName:any)=>{
  return {
    url: '/stockdefinehead/findByName?defineName='+defineName,
    method: 'GET',
  }
})

export const editByFlag=defRouteApi((params:any)=>{
  return {
    url: '/stockdefinehead/editByFlag',
    method: 'POST',
    params
  }
})

export const findAllStockDefineHeadList=defRouteApi(()=>{
  return {
    url: '/stockdefinehead/findAllList',
    method: 'GET',
  }
})

export const findByModelList=defRouteApi((model)=>{
  return {
    url: '/stockdefinehead/findByModelList?model='+model,
    method: 'GET',
  }
})

export const excelStockDefineHead = defRouteApi((params:any)=> {
  return {
    url: '/stockdefinehead/excel',
    timeout:100000000000,
    method: 'POST',
    params
  }
})

export const findMaxDefineCode=defRouteApi(()=>{
  return {
    url: '/stockdefinehead/findMaxDefineCode',
    method: 'GET',
  }
})

export const findBukongDefineCode=defRouteApi(()=>{
  return {
    url: '/stockdefinehead/findBukongDefineCode',
    method: 'GET',
  }
})

export const findByModelOrderByDefineCode=defRouteApi((model)=>{
  return {
    url: '/stockdefinehead/findByModelOrderByDefineCode?model='+model,
    method: 'GET',
  }
})
