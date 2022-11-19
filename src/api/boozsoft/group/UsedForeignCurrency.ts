import {defHttp} from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
    findAll = `/UsedForeignCurrency/findAll`,
    findAllOrg = `/UsedForeignCurrency/org/findAll`,
    findAllAcc = `/UsedForeignCurrency/acc/findAll`,
    findAvailablesOrg = `/UsedForeignCurrency/org/findAvailables`,
    findAvailablesAcc = `/UsedForeignCurrency/acc/findAvailables`,
    findById = `/api/UsedForeignCurrency/findById`,
    findByIdOrg = `/api/UsedForeignCurrency/org/findById`,
    findByIdAcc = `/api/UsedForeignCurrency/acc/findById`,
    save = `/UsedForeignCurrency/save`,
    saveOrg = `/UsedForeignCurrency/org/save`,
    saveAcc = `/UsedForeignCurrency/acc/save`,
    deleteById = `/UsedForeignCurrency/deleteById`,
    deleteByIdOrg = `/UsedForeignCurrency//orgdeleteById`,
    deleteByIdAcc = `/UsedForeignCurrency/acc/deleteById`,
    duplicate = `/UsedForeignCurrency/duplicate`,
    duplicateAcc = `/UsedForeignCurrency/acc/duplicate`,
    duplicateOrg = `/UsedForeignCurrency/org/duplicate`
}

export function findAllApi() {
    return defHttp.request({
        url: Api.findAll,
        method: 'GET'
    })
}

export function findAllApiOrg() {
  return defHttp.request({
    url: Api.findAllOrg,
    method: 'GET'
  })
}
export function findAvailablesOrg(params) {
  return defHttp.request({
    url: Api.findAvailablesOrg,
    method: 'GET',
    params
  })
}
export const findAvailablesAcc = defRouteApi( ()=>{
  return   {
    url: Api.findAvailablesAcc ,
    method: 'GET',
  }
})

export const findAllApiAcc = defRouteApi( ()=>{
  return   {
    url: Api.findAllAcc ,
    method: 'GET',
  }
})
export const checkDuplicate = defRouteApi( (params)=>{
  return   {
    url: Api.duplicate ,
    method: 'GET',params
  }
})

export function checkDuplicateOrg(params) {
  return defHttp.request({
    url: Api.duplicateOrg,
    method: 'GET',
    params
  })
}


export const checkDuplicateAcc = defRouteApi( (params:any)=>{
  return   {
    url: Api.duplicateAcc,
    method: 'GET',
    params
  }
})

export function findByIdApi() {
    return defHttp.request({
        url: Api.findById,
        method: 'GET'
    })
}
export function findByIdApiOrg() {
  return defHttp.request({
    url: Api.findByIdOrg,
    method: 'GET'
  })
}

export const findByIdAcc = defRouteApi( ()=>{
  return {
    url: Api.findByIdAcc,
    method: 'GET'
  }
})

export function saveApi(params) {
    return defHttp.request({
        url: Api.save,
        method: 'POST',
        params
    })
}

export function saveApiOrg(params) {
  return defHttp.request({
    url: Api.saveOrg,
    method: 'POST',
    params
  })
}

export const saveApiAcc = defRouteApi( (params)=>{
  return {
    url: Api.saveAcc,
    method: 'POST',
    params
  }
})

export function deleteByIdApi(params) {
    return defHttp.request({
        url: Api.deleteById,
        method: 'DELETE',
        params
    })
}

export function deleteByIdApiOrg(params) {
  return defHttp.request({
    url: Api.deleteByIdOrg,
    method: 'DELETE',
    params
  })
}
export const deleteByIdAcc = defRouteApi( (params)=>{
  return{
    url: Api.deleteByIdAcc,
    method: 'DELETE',
    params
  }
})
