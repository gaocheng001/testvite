import {defHttp} from "/@/utils/http/axios";

export function getProjectList(params:any) {
  return defHttp.request({
    url: '/originProject/findByClass',
    method: 'GET',
    params
  })
}

export function saveProject(params:any) {
  return defHttp.request({
    url: '/originProject',
    method: 'POST',
    params
  })
}

export function deleteProject(params: any) {
  return defHttp.request({
    url: '/originProject',
    method: 'DELETE',
    params
  })
}

export function deleteProjectList(params: any) {
  return defHttp.request({
    url: '/originProject/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode(params:any) {
  return defHttp.request({
    url: '/originProject/findByCode',
    method: 'GET',
    params
  })
}

export function findByName(params:any) {
  return defHttp.request({
    url: '/originProject/findByName',
    method: 'GET',
    params
  })
}

export function excelProject(params:any) {
  return defHttp.request({
    url: '/originProject/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}

export function findProjectByCateCode(projectCateCode:any,originId) {
  return defHttp.request({
    url: '/originProject/findByCateCode?projectCateCode='+projectCateCode+'&originId='+originId,
    method: 'GET',
  })
}

export function getFromEdit(projectCateCode:any,originId) {
  return defHttp.request({
    url: '/originProject/category/fromColumnByCate?projectCateCode='+projectCateCode+'&originId='+originId,
    method: 'GET',
  })
}

export function findAllList(originId) {
  return defHttp.request({
    url: '/originProject/findAllList?originId='+originId,
    method: 'GET',
  })
}

export function findByUniqueCode(uniqueCode,originId) {
  return defHttp.request({
    url: '/originProject/findByUniqueCode?uniqueCode='+uniqueCode+'&originId='+originId,
    method: 'GET'
  })
}
