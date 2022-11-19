import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */


export function findVoucherTypeAll() {
  return defHttp.request({
    url: '/groupVoucherType/findAll',
    method: 'GET',
  })
}

export function saveVoucherType(params:any) {
  return defHttp.request({
    url: '/groupVoucherType',
    method: 'POST',
    params
  })
}

export function deleteVoucherType(params:any) {
  return defHttp.request({
    url: '/groupVoucherType',
    method: 'DELETE',
    params
  })
}

export function findVoucherTypeByNum(voucherNum:any) {
  return defHttp.request({
    url: '/groupVoucherType/findByNum?voucherNum='+voucherNum,
    method: 'GET',
  })
}

export function findVoucherTypeByCode(voucherTypeCode:any) {
  return defHttp.request({
    url: '/groupVoucherType/findByCode?voucherTypeCode='+voucherTypeCode,
    method: 'GET',
  })
}

export function findVoucherTypeByName(voucherTypeName:any) {
  return defHttp.request({
    url: '/groupVoucherType/findByName?voucherTypeName='+voucherTypeName,
    method: 'GET',
  })
}

export function excelVoucherType(params:any) {
  return defHttp.request({
    url: '/groupVoucherType/excel',
    method: 'POST',
    params
  })
}
