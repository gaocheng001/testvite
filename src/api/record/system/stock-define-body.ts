// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findStockDefineBodyList=defRouteApi( ({defineCode})=>{
  return {
    url: '/stockdefinebody/findAll?defineCode='+defineCode,
    method: 'GET',
  }
})

export const getStockDefineBodyList=defRouteApi( (defineCode)=>{
  return {
    url: '/stockdefinebody/getAll?defineCode='+defineCode,
    method: 'GET',
  }
})

export const saveStockDefineBody=defRouteApi((params:any)=>{
  return {
    url: '/stockdefinebody',
    method: 'POST',
    params
  }
})

export const deleteStockDefineBody=defRouteApi((params:any)=>{
  return {
    url: '/stockdefinebody/del',
    method: 'DELETE',
    params
  }
})

export const deleteStockDefineBodyList=defRouteApi((params:any)=>{
  return {
    url: '/stockdefinebody/deleteList',
    method: 'DELETE',
    params
  }
})

export const findByCode=defRouteApi(({defineCode,ccode})=>{
  return {
    url: '/stockdefinebody/findByCode?defineCode='+defineCode+'&ccode='+ccode,
    method: 'GET',
  }
})
export const findByName=defRouteApi(({defineCode,cname})=>{
  return {
    url: '/stockdefinebody/findByName?defineCode='+defineCode+'&cname='+cname,
    method: 'GET',
  }
})

export const editByFlag=defRouteApi((params:any)=>{
  return {
    url: '/stockdefinebody/editByFlag',
    method: 'POST',
    params
  }
})

export const findAllStockDefineBodyList=defRouteApi((defineCode:any)=>{
  return {
    url: '/stockdefinebody/findAllList?defineCode='+defineCode,
    method: 'GET',
  }
})

export const excelStockDefineBody = defRouteApi((params:any)=> {
  return {
    url: '/stockdefinebody/excel',
    timeout:100000000000,
    method: 'POST',
    params
  }
})

export const findMaxCcode=defRouteApi((defineCode:any)=>{
  return {
    url: '/stockdefinebody/findMaxCcode?defineCode='+defineCode,
    method: 'GET',
  }
})

export const findBukongCcode=defRouteApi((defineCode:any)=>{
  return {
    url: '/stockdefinebody/findBukongCcode?defineCode='+defineCode,
    method: 'GET',
  }
})
