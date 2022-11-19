import { defHttp } from '/@/utils/http/axios'

enum Api {
  FindAll = '/sys/user2/findAll',
  findAllById = '/sys/user2/findAllById',
  count = '/sys/user2/count'
}

/**
 * @description: user login api
 */
export async function findAll(params:any) {
  return defHttp.request(
    {
      url: Api.FindAll,
      timeout: 10000000000,
      method: 'POST',
      params
    }
  )
}

export async function findAllById(params:any) {
  return defHttp.request(
    {
      url: Api.findAllById,
      timeout: 10000000000,
      method: 'POST',
      params
    }
  )
}

export async function count() {
  return defHttp.request(
    {
      url: Api.count,
      timeout: 10000000000,
      method: 'GET',
    }
  )
}
export function delCheck(params) {
  return defHttp.request({
    url: '/sys/user2/delCheck',
    method: 'POST',params
  })
}
export function saveUser(params) {
  return defHttp.request({
    url: '/sys/user2',
    timeout: 10000000000,
    method: 'POST',
    params
  })
}
export function saveUserBatch(params) {
  return defHttp.request({
    url: '/sys/user2/batch',
    timeout: 10000000000,
    method: 'POST',
    params
  })
}

export function saveUserList(params) {
  return defHttp.request({
    url: '/sys/user2/all',
    timeout: 10000000000,
    method: 'POST',
    params
  })
}

export function checkUser(params) {
  return defHttp.request({
    url: '/sys/user2/check',
    method: 'POST',
    params
  })
}
export function checkUserList(params) {
  return defHttp.request({
    url: '/sys/user2/checkList',
    method: 'POST',
    params
  })
}
export function findUserAuthor(params) {
  return defHttp.request({
    url: '/sys/account/findUserAuthor',
    method: 'POST',
    params
  })
}
export function saveAuthor(params) {
  return defHttp.request({
    url: '/sys/account/saveAuthor',
    method: 'POST',
    params
  })
}
export function emptyAuthor(params) {
  return defHttp.request({
    url: '/sys/account/emptyAuthor',
    method: 'POST',
    params
  })
}
export function copyAuthor(params) {
  return defHttp.request({
    url: '/sys/account/copyAuthor',
    method: 'POST',
    params
  })
}
export function getPlatformColumn(params) {
  return defHttp.request({
    url: '/sys/account/getPlatformColumn',
    method: 'POST',
    params
  })
}
export function savePlatformColumn(params) {
  return defHttp.request({
    url: '/sys/account/savePlatformColumn',
    method: 'POST',
    params
  })
}
export function getPlatformAndMenu() {
  return defHttp.request({
    url: '/sys/account/getPlatformAndMenu',
    method: 'GET',
  })
}
export function savePlatformAndMenu(params) {
  return defHttp.request({
    url: '/sys/account/savePlatformAndMenu',
    method: 'POST',
    params
  })
}
export function saveAudit(params) {
  return defHttp.request({
    url: '/audit-operator',
    method: 'POST',
    params
  })
}
export function findUserAuthor2(params) {
  return defHttp.request({
    url: '/sys/account/findUserAuthor2',
    method: 'POST',
    params
  })
}
export function saveAuthor2(params) {
  return defHttp.request({
    url: '/sys/account/saveAuthor2',
    method: 'POST',
    params
  })
}
export function findAllByAuthPeriod(userUnique,ztCode) {
  return defHttp.request({
    url: '/sys/account/findAllByAuthPeriod?userUnique='+userUnique+'&ztCode='+ztCode,
    method: 'POST',
  })
}
export function copyAuthor2(params) {
  return defHttp.request({
    url: '/sys/account/copyAuthor2',
    method: 'POST',
    params
  })
}
export function updateFlag(id, flag) {
  return defHttp.request({
    url: '/sys/user2/updateFlag/' + id +'/'+ flag,
    method: 'GET',
  })
}

export function findAllList() {
  return defHttp.request({
    url: '/sys/user2/findAllList',
    method: 'POST',
  })
}

