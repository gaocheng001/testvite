// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getProjectList(params:any) {
  return defHttp.request({
    url: '/groupProject/findByClass',
    method: 'GET',
    params
  })
}

export function saveProject(params:any) {
  return defHttp.request({
    url: '/groupProject',
    method: 'POST',
    params
  })
}

export function deleteProject(params: any) {
  return defHttp.request({
    url: '/groupProject',
    method: 'DELETE',
    params
  })
}

export function deleteProjectList(params: any) {
  return defHttp.request({
    url: '/groupProject/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode(params:any) {
  return defHttp.request({
    url: '/groupProject/findByCode',
    method: 'GET',
    params
  })
}

export function findByName(params:any) {
  return defHttp.request({
    url: '/groupProject/findByName',
    method: 'GET',
    params
  })
}

export function excelProject(params:any) {
  return defHttp.request({
    url: '/groupProject/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}

export function findProjectByCateCode(projectCateCode:any) {
  return defHttp.request({
    url: '/groupProject/findByCateCode?projectCateCode='+projectCateCode,
    method: 'GET',
  })
}

export function getFromEdit(projectCateCode:any) {
  return defHttp.request({
    url: '/groupProject/category/fromColumnByCate?projectCateCode='+projectCateCode,
    method: 'GET',
  })
}

export function findAllList() {
  return defHttp.request({
    url: '/groupProject/findAllList',
    method: 'GET',
  })
}

export function findProjectDelList() {
  return defHttp.request({
    url: '/groupProject/findDelList',
    method: 'GET',
  })
}

export function findByUniqueCode(uniqueCode) {
  return defHttp.request({
    url: '/groupProject/findByUniqueCode?uniqueCode='+uniqueCode,
    method: 'GET'
  })
}

export function findByCtypeAndOriginId(originId) {
  return defHttp.request({
    url: '/groupProject/findByCtypeAndOriginId?originId='+originId,
    method: 'GET',
  })
}

export function findByCtypeAndTenantId(tenantId) {
  return defHttp.request({
    url: '/groupProject/findByCtypeAndTenantId?tenantId='+tenantId,
    method: 'GET',
  })
}

export function findByNotSuccessState() {
  return defHttp.request({
    url: '/groupProject/findByNotSuccessState',
    method: 'GET',
  })
}

export function findBukongProjectCode(num,sum,qzNum,qianzhui) {
  return defHttp.request({
    url: '/groupProject/findBukongProjectCode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  })
}

export function findMaxProjectCode(num,sum,qzNum,qianzhui) {
  return defHttp.request({
    url: '/groupProject/findMaxProjectCode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  })
}
