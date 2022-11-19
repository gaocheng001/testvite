import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findDefinedRecordList({definedCode,originId}){
  return defHttp.request({
    url: '/originDefinedRecord/findAll?definedCode='+definedCode+'&originId='+originId,
    method: 'GET',
  })
}

export function getDefinedRecordList(definedCode,originId){
  return defHttp.request({
    url: '/originDefinedRecord/getAll?definedCode='+definedCode+'&originId='+originId,
    method: 'GET',
  })
}

export function saveDefinedRecord(params:any){
  return defHttp.request({
    url: '/originDefinedRecord',
    method: 'POST',
    params
  })
}

export function deleteDefinedRecord(params:any){
  return defHttp.request({
    url: '/originDefinedRecord/del',
    method: 'DELETE',
    params
  })
}

export function deleteDefinedRecordList(params:any){
  return defHttp.request({
    url: '/originDefinedRecord/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode({definedCode,recordCode,originId}){
  return defHttp.request({
    url: '/originDefinedRecord/findByCode?definedCode='+definedCode+'&recordCode='+recordCode+'&originId='+originId,
    method: 'GET',
  })
}

export function findByName({definedCode,recordName,originId}){
  return defHttp.request({
    url: '/originDefinedRecord/findByName?definedCode='+definedCode+'&recordName='+recordName+'&originId='+originId,
    method: 'GET',
  })
}

export function editByFlag(params:any){
  return defHttp.request({
    url: '/originDefinedRecord/editByFlag',
    method: 'POST',
    params
  })
}

export function findAllDefinedRecordList(definedCode:any,originId:any){
  return defHttp.request({
    url: '/originDefinedRecord/findAllList?definedCode='+definedCode+'&originId='+originId,
    method: 'GET',
  })
}

export function excelDefinedRecord(params:any){
  return defHttp.request({
    url: '/originDefinedRecord/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}

export function findMaxRecordCode(definedCode:any,originId:any){
  return defHttp.request({
    url: '/originDefinedRecord/findMaxRecordCode?definedCode='+definedCode+'&originId='+originId,
    method: 'GET',
  })
}

export function findBukongRecordCode(definedCode:any,originId:any){
  return defHttp.request({
    url: '/originDefinedRecord/findBukongRecordCode?definedCode='+definedCode+'&originId='+originId,
    method: 'GET',
  })
}
