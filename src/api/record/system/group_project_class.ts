import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
export function GetProClassTree() {
  return defHttp.request({
    url: '/groupProject/class/treeProClass',
    method: 'GET',
  })
}

export function findProClassTree() {
  return defHttp.request({
    url: '/groupProject/class/treeProClass',
    method: 'GET',
  })
}

export function findProClassByCode(projectClassCode:any) {
  return defHttp.request({
    url: '/groupProject/class/findByCode?projectClassCode='+projectClassCode,
    method: 'GET',
  })
}

export function saveProClass(params:any) {
  return defHttp.request({
    url: '/groupProject/class',
    method: 'POST',
    params
  })
}

export function deleteProClass(params:any) {
  return defHttp.request({
    url: '/groupProject/class',
    method: 'DELETE',
    params
  })
}

export function findClassByBend() {
  return defHttp.request({
    url: '/groupProject/class/findClassByBend',
    method: 'GET',
  })
}

export function projectClassFindAll() {
  return defHttp.request({
    url: '/groupProject/class/findAll',
    method: 'GET',
  })
}

export function findByProjectCateCodeAndNotJiciOrderByProjectClassCode() {
  return defHttp.request({
    url: '/groupProject/class/findByProjectCateCodeAndNotJiciOrderByProjectClassCode',
    method: 'GET',
  })
}

export function findById(id) {
  return defHttp.request({
    url: '/groupProject/class/findById?id='+id,
    method: 'GET',
  })
}
