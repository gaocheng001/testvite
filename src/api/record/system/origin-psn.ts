import {defHttp} from "/@/utils/http/axios";

enum Api {
  FindAll = '/originSys/psn/findAll',
  FindByFlag = '/originSys/psn/findByFlag',
}
export function psnFindAll(params){
  return defHttp.request({
    url: Api.FindAll,
    method: 'GET',
    params
  })
}

export function psnFindByFlag(params) {
  return defHttp.request({
    url: Api.FindByFlag,
    method: 'GET',
    params
  })
}
export function getPsnList(params){
  return defHttp.request({
    url: '/originSys/psn/getAll',
    method: 'GET',
    params
  })
}

export function savePsn(params){
  return defHttp.request({
    url: '/originSys/psn',
    method: 'POST',
    params
  })
}

export function deletePsn(params){
  return defHttp.request({
    url: '/originSys/psn',
    method: 'DELETE',
    params
  })
}

export function editFlag(params){
  return defHttp.request({
    url: '/originSys/psn/editFlag',
    method: 'POST',
    params
  })
}

export function findByCode(code:any,originId:any){
  return defHttp.request({
    url: '/originSys/psn/findByCode?code='+code+'&originId='+originId,
    method: 'GET',
  })
}

export function excelPsn(params:any) {
  return defHttp.request({
    url: '/originSys/psn/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}

export function findByOriginIdAndUniqueCode(originId,uniqueCode) {
  return defHttp.request({
    url: '/originSys/psn/findByOriginIdAndUniqueCode?originId=' + originId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

