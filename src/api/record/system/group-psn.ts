import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
enum Api {
  FindAll = '/groupSys/psn/findAll',
  FindByFlag = '/groupSys/psn/findByFlag',
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
export function getPsnList(){
  return defHttp.request({
    url: '/groupSys/psn/getAll',
    method: 'GET',
  })
}

export function savePsn(params){
  return defHttp.request({
    url: '/groupSys/psn',
    method: 'POST',
    params
  })
}

export function deletePsn(params){
  return defHttp.request({
    url: '/groupSys/psn',
    method: 'DELETE',
    params
  })
}

export function editFlag(params){
  return defHttp.request({
    url: '/groupSys/psn/editFlag',
    method: 'POST',
    params
  })
}

export function findByCode(code:any){
  return defHttp.request({
    url: '/groupSys/psn/findByCode?code='+code,
    method: 'GET',
  })
}

export function excelPsn(params:any) {
  return defHttp.request({
    url: '/groupSys/psn/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}

export function findPsnDelList() {
  return defHttp.request({
    url: '/groupSys/psn/findDelList',
    method: 'GET',
  })
}

export function findByUniqueCode(uniqueCode) {
  return defHttp.request({
    url: '/groupSys/psn/findByUniqueCode?uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByCtypeAndOriginId(originId) {
  return defHttp.request({
    url: '/groupSys/psn/findByCtypeAndOriginId?originId='+originId,
    method: 'GET',
  })
}

export function findByCtypeAndTenantId(tenantId) {
  return defHttp.request({
    url: '/groupSys/psn/findByCtypeAndTenantId?tenantId='+tenantId,
    method: 'GET',
  })
}

export function findByPsnNameAndCellPhoneNum(psnName, cellPhoneNum) {
  return defHttp.request({
    url: '/groupSys/psn/findByPsnNameAndCellPhoneNum?psnName='+psnName+'&cellPhoneNum='+cellPhoneNum,
    method: 'GET',
  })
}

export function findByPsnNameAndCellPhoneNumAndSuccessState(psnName, cellPhoneNum) {
  return defHttp.request({
    url: '/groupSys/psn/findByPsnNameAndCellPhoneNumAndSuccessState?psnName='+psnName+'&cellPhoneNum='+cellPhoneNum,
    method: 'GET',
  })
}

export function findByNotSuccessState() {
  return defHttp.request({
    url: '/groupSys/psn/findByNotSuccessState',
    method: 'GET',
  })
}

export function findBukongPsnCode(num,sum,qzNum,qianzhui) {
  return defHttp.request({
    url: '/groupSys/psn/findBukongPsnCode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  })
}

export function findMaxPsnCode(num,sum,qzNum,qianzhui) {
  return defHttp.request({
    url: '/groupSys/psn/findMaxPsnCode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  })
}
