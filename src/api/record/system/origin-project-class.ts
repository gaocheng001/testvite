// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export function GetProClassTree(originId) {
  return defHttp.request({
    url: '/originProject/class/treeProClass?originId='+originId,
    method: 'GET',
  })
}

export function findProClassTree(originId) {
  return defHttp.request({
    url: '/originProject/class/treeProClass?originId='+originId,
    method: 'GET',
  })
}

export function findProClassByCode(projectClassCode:any,originId) {
  return defHttp.request({
    url: '/originProject/class/findByCode?projectClassCode='+projectClassCode+'&originId='+originId,
    method: 'GET',
  })
}

export function saveProClass(params:any) {
  return defHttp.request({
    url: '/originProject/class',
    method: 'POST',
    params
  })
}

export function deleteProClass(params:any) {
  return defHttp.request({
    url: '/originProject/class',
    method: 'DELETE',
    params
  })
}

export function findClassByBend(originId) {
  return defHttp.request({
    url: '/originProject/class/findClassByBend?originId='+originId,
    method: 'GET',
  })
}

export function projectClassFindAll(originId) {
  return defHttp.request({
    url: '/originProject/class/findAll?originId='+originId,
    method: 'GET',
  })
}

export function findByProjectCateCodeAndNotJiciOrderByProjectClassCode(originId) {
  return defHttp.request({
    url: '/originProject/class/findByProjectCateCodeAndNotJiciOrderByProjectClassCode?originId='+originId,
    method: 'GET',
  })
}

export function findById(id) {
  return defHttp.request({
    url: '/originProject/class/findById?id='+id,
    method: 'GET',
  })
}
