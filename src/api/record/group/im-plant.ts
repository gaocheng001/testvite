import {defHttp} from "/@/utils/http/axios";


export async function getPlantsList (params:any){
  return defHttp.request({
    url: '/group/sys-plant',
    method: 'GET',
    params
  })
}

export async function getPlantsAll (params:any){
  return defHttp.request({
    url: '/group/sys-plant/all',
    method: 'GET',
    params
  })
}
export async function findByCode (params:any){
  return defHttp.request({
    url: '/group/sys-plant/findByCode',
    method: 'GET',
    params
  })
}

export async function findByName (params:any){
  return defHttp.request({
    url: '/group/sys-plant/findByName',
    method: 'GET',
    params
  })
}
export async function savePlant (params:any){
  return defHttp.request({
    url: '/group/sys-plant',
    method: 'POST',
    params
  })
}
export async function delPlant (params:any){
  return defHttp.request({
    url: '/group/sys-plant',
    method: 'DELETE',
    params
  })
}
export async function changePlant (params:any){
  return defHttp.request({
    url: '/group/sys-plant',
    method: 'POST',
    params
  })
}
export async function findByCorpUniqueCode (corpUniqueCode:any){
  return defHttp.request({
    url: '/group/sys-plant/findByCorpUniqueCode?corpUniqueCode='+corpUniqueCode,
    method: 'POST',
  })
}

export async function getPlantDelAll() {
  return defHttp.request({
    url: '/group/sys-plant/allDel',
    timeout: 100000000000,
    method: 'GET',
  })
}
export async function deletePlantTrue(params: any) {
  return defHttp.request({
    url: '/group/sys-plant/true',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}
export async function reductionPlant(params: any) {
  return defHttp.request({
    url: '/group/sys-plant/reduction',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

