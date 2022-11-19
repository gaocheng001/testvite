import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findFuzhuHesuanList(){
  return defHttp.request({
    url: '/groupFuzhuHesuan/findAll',
    method: 'GET',
  })
}

export function getFuzhuHesuanList(){
  return defHttp.request({
    url: '/groupFuzhuHesuan/getAll',
    method: 'GET',
  })
}

export function saveFuzhuHesuan(params:any){
  return defHttp.request({
    url: '/groupFuzhuHesuan',
    method: 'POST',
    params
  })
}

export function deleteFuzhuHesuan(params:any){
  return defHttp.request({
    url: '/groupFuzhuHesuan/del',
    method: 'DELETE',
    params
  })
}

export function deleteFuzhuHesuanList(params:any){
  return defHttp.request({
    url: '/groupFuzhuHesuan/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode(ccode:any){
  return defHttp.request({
    url: '/groupFuzhuHesuan/findByCode?ccode='+ccode,
    method: 'GET',
  })
}

export function findByName(cname:any){
  return defHttp.request({
    url: '/groupFuzhuHesuan/findByName?cname='+cname,
    method: 'GET',
  })
}

export function findByCankaoDuixiang(cankaoDuixiang:any){
  return defHttp.request({
    url: '/groupFuzhuHesuan/findByCankaoDuixiang?cankaoDuixiang='+cankaoDuixiang,
    method: 'GET',
  })
}

export function editByFlag(params:any){
  return defHttp.request({
    url: '/groupFuzhuHesuan/editByFlag',
    method: 'POST',
    params
  })
}

export function findAllFuzhuHesuanList(){
  return defHttp.request({
    url: '/groupFuzhuHesuan/findAllList',
    method: 'GET',
  })
}

export function excelFuzhuHesuan(params:any){
  return defHttp.request({
    url: '/groupFuzhuHesuan/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}
