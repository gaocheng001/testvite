import { defHttp, otherHttp } from '/@/utils/http/axios';

enum Api {
  findAllElectronicInvoice = '/bankelectronicInvoice/findAllElectronicInvoice',
  findAllInvoiceType = '/bankelectronicInvoice/findAllInvoiceType',
  eletronicInvoiceSaveApi = '/bankelectronicInvoice/save',
  findByImgid = '/bankelectronicInvoice/findByImgid',
  delByImgid = '/bankelectronicInvoice/delByImgid',
  findAllOcrApi = '/bankelectronicInvoice/findAllOcrApi',
  findByOcrSurplusNumber = '/bankelectronicInvoice/findByOcrSurplusNumber',
  listOCR = '/ocr/listOCR',
  findByCheckFlag = '/bankelectronicInvoice/findByCheckFlag',
  isCheckApi = '/ocr/isCheckApi',
  findByHeaderUniqueInvoice = '/bankelectronicInvoice/findByHeaderUniqueInvoice',
  delInvoice = '/bankelectronicInvoice/delInvoice',
  findAllByAccvoucher = '/bankelectronicInvoice/findAllByAccvoucher',
  dlownload = '/bankelectronicInvoice/dlownloadById',
}

export function isCheckApi(code: any, number: any, checkCode: any, date: any, money: any) {
  return defHttp.request({
    url:
      Api.isCheckApi +
      '?invoiceCode=' +
      code +
      '&invoiceNum=' +
      number +
      '&invoiceCheckCode=' +
      checkCode +
      '&invoiceDate=' +
      date +
      '&invoiceMoney=' +
      money,
    method: 'POST',
  });
}

export async function findByCheckFlag() {
  return defHttp.request({
    url: Api.findByCheckFlag,
    method: 'POST',
  });
}

export async function listOCR() {
  return defHttp.request({
    url: Api.listOCR,
    method: 'POST',
  });
}

export async function findByOcrSurplusNumber() {
  return defHttp.request({
    url: Api.findByOcrSurplusNumber,
    method: 'POST',
  });
}

export async function findAllOcrApi() {
  return defHttp.request({
    url: Api.findAllOcrApi,
    method: 'POST',
  });
}

export async function delByImgid(id: any, url: any, name: any) {
  return defHttp.request({
    url: Api.delByImgid + '?id=' + id + '&ftpName=' + name + '&ftpUrl=' + url,
    method: 'POST',
  });
}

export async function findByImgid(id: any) {
  return defHttp.request({
    url: Api.findByImgid + '?id=' + id,
    method: 'POST',
  });
}

export async function findAllInvoiceType() {
  return defHttp.request({
    url: Api.findAllInvoiceType,
    method: 'POST',
  });
}

export async function findAllElectronicInvoice() {
  return defHttp.request({
    url: Api.findAllElectronicInvoice,
    method: 'POST',
  });
}
export function eletronicInvoiceSaveApi(params: any) {
  return defHttp.request({
    url: Api.eletronicInvoiceSaveApi,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  });
}

export async function findByHeaderUniqueInvoice(headerunique: any) {
  return defHttp.request({
    url: Api.findByHeaderUniqueInvoice + '?headerunique=' + headerunique,
    method: 'POST',
  });
}
export async function delInvoice(id: any) {
  return defHttp.request({
    url: Api.delInvoice + '?id=' + id,
    method: 'POST',
  });
}

export async function dlownload(id: any) {
  return otherHttp.request({
    url: Api.dlownload + '?id=' + id,
    method: 'POST',
    responseType: 'blob',
  });
}
