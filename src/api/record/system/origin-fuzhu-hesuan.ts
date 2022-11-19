import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findFuzhuHesuanList({originId}:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/findAll?originId='+originId,
    method: 'GET',
  })
}

export function getFuzhuHesuanList(originId:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/getAll?originId='+originId,
    method: 'GET',
  })
}

export function saveFuzhuHesuan(params:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/save',
    method: 'POST',
    params
  })
}

export function deleteFuzhuHesuan(params:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/del',
    method: 'DELETE',
    params
  })
}

export function deleteFuzhuHesuanList(params:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode(ccode:any,originId:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/findByCode?ccode='+ccode+'&originId='+originId,
    method: 'GET',
  })
}

export function findByName(cname:any,originId:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/findByName?cname='+cname+'&originId='+originId,
    method: 'GET',
  })
}

export function findByCankaoDuixiang(cankaoDuixiang:any,originId:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/findByCankaoDuixiang?cankaoDuixiang='+cankaoDuixiang+'&originId='+originId,
    method: 'GET',
  })
}

export function editByFlag(params:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/editByFlag',
    method: 'POST',
    params
  })
}

export function findAllFuzhuHesuanList(originId:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/findAllList?originId='+originId,
    method: 'GET',
  })
}

export function excelFuzhuHesuan(params:any){
  return defHttp.request({
    url: '/originFuzhuHesuan/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}
