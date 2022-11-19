import {defRouteApi, otherRouteApi, useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp, otherHttp, uploadHttp} from "/@/utils/http/axios";


enum Api {
  findAll         = '/api/task/findAll',
  hide            = '/api/task/hide',
  read            = '/api/task/read',
  getUserList     = '/api/task/getUserList',
  save            = '/api/task/save',
  getMessageUser  = '/api/task/getMessageUser',
  findAllIndex    = '/api/task/findAllIndex',
  findNewMseeage  = '/api/task/findNewMseeage',
  chexiao         = '/api/task/chexiao',
  upload          = '/api/task/upload',
  getFileList     = '/api/task/getFileList',
  downloadFile    = '/api/task/download',
  delete          = '/api/task/delete',
}

/**
 * @description: Get user jigou based on id
 */

// 消息list
export function  findAll(params:any) {
  return defHttp.request({
    url: Api.findAll,
    method: 'POST',
    params
  })
}
//首页消息 4条
export function  findAllIndex(params:any) {
  return defHttp.request({
    url: Api.findAllIndex,
    method: 'POST',
    params
  })
}
//定时一分钟请求 新消息数量
export function  findNewMseeage(params:any) {
  return defHttp.request({
    url: Api.findNewMseeage,
    method: 'POST',
    params
  })
}

//隐藏
export function  hide(userId,id) {
  return defHttp.request({
    url: Api.hide+'/'+id+"/"+userId,
    method: 'GET',
  })
}
//隐藏
export function  chexiao(id,messageId) {
  return defHttp.request({
    url: Api.chexiao+'/'+id+'/'+messageId,
    method: 'GET',
  })
}
//read
export function goread(userId,id) {
  return defHttp.request({
    url: Api.read+'/'+id+"/"+userId,
    method: 'GET',
  })
}
//getUserList
export function getUserList() {
  return defHttp.request({
    url: Api.getUserList,
    method: 'GET',
  })
}

//getMessageUser
export function getMessageUser() {
  return defHttp.request({
    url: Api.getMessageUser,
    method: 'GET',
  })
}
//save
export function save(params:any) {
  return defHttp.request({
    url: Api.save,
    method: 'POST',
    params
  })
}
//upload
export function uploadFile(params:any) {
  return defHttp.request({
    url: Api.upload,
    timeout:10000000,
    method: 'POST',
    params
  })
}
export function getFileList(messageId:any) {
  return defHttp.request({
    url: Api.getFileList+"/"+messageId,
    method: 'GET',
  })
}

export function downloadFile(fileId:any) {
  return otherHttp.request({
    url: Api.downloadFile+"/"+fileId,
    method: 'GET',
  })
}
export function delMessage(params:any) {
  return defHttp.request({
    url: Api.delete,
    method: 'POST',
    params
  })
}
