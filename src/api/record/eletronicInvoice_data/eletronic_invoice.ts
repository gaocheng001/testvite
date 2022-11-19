import { defHttp, otherHttp } from '/@/utils/http/axios';
import {defRouteApi, otherRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  findAllElectronicInvoice = '/electronicInvoice/findAllElectronicInvoice',
  findAllInvoiceType = '/electronicInvoice/findAllInvoiceType',
  eletronicInvoiceSaveApi = '/electronicInvoice/save',
  findByImgid = '/electronicInvoice/findByImgid',
  delByImgid = '/electronicInvoice/delByImgid',
  findAllOcrApi = '/electronicInvoice/findAllOcrApi',
  findByOcrSurplusNumber = '/electronicInvoice/findByOcrSurplusNumber',
  listOCR = '/ocr/listOCR',
  findByCheckFlag = '/electronicInvoice/findByCheckFlag',
  isCheckApi = '/ocr/isCheckApi',
  findByHeaderUniqueInvoice = '/electronicInvoice/findByHeaderUniqueInvoice',
  delInvoice = '/electronicInvoice/delInvoice',
  findAllByAccvoucher = '/electronicInvoice/findAllByAccvoucher',
  dlownload = '/electronicInvoice/dlownloadById',
  uploadInvocie = '/electronicInvoice/uploadInvocie',
  djStatus = '/electronicInvoice/djStatus',
  rzStatus = '/electronicInvoice/rzStatus',
  delByIds = '/electronicInvoice/delByIds',
  findNext = '/electronicInvoice/findNext',
  findAllAccvoucherTree = '/electronicInvoice/dateTree',
  pzAssociationFp = '/electronicInvoice/pzAssociationFp',


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

export const findAllElectronicInvoice=defRouteApi( (params)=>{
  return{
    url: Api.findAllElectronicInvoice,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const eletronicInvoiceSaveApi=defRouteApi( (params: any)=>{
  return{
    url: Api.eletronicInvoiceSaveApi,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params,
    timeout: 100000000000,
  }
},)


export const findByHeaderUniqueInvoice=defRouteApi( (uniqueCode: any)=>{
  return{
    url: Api.findByHeaderUniqueInvoice + '?uniqueCode=' + uniqueCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  }
},)

export const findNext=defRouteApi( (params: any)=>{
  return{
    url: Api.findNext + '?id=' + params.id+ '&type=' + params.type,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  }
},)

export const delInvoice=defRouteApi( (id: any)=>{
  return{
    url: Api.delInvoice + '?id=' + id,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
  }
},)

//upload
export const listOCR=defRouteApi( (params)=>{
  return{
    url: Api.listOCR,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const uploadInvocie=defRouteApi( (params)=>{
  return{
    url: Api.uploadInvocie,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const dlownload=otherRouteApi( (id: any)=>{
  return{
    url: Api.dlownload + '?id=' + id,
    method: 'POST',
    responseType: 'blob',
  }
},)
export const djStatus=defRouteApi( (params)=>{
  return{
    url: Api.djStatus,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
export const rzStatus=defRouteApi( (params)=>{
  return{
    url: Api.rzStatus,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
export const delByIds=defRouteApi( (params)=>{
  return{
    url: Api.delByIds,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
// 获取凭证树
export const findAllAccvoucherTree = defRouteApi((params: any) => {
  return {
    url: Api.findAllAccvoucherTree,
    timeout: 500000000,
    method: 'GET', params
  }
})
export const pzAssociationFp=defRouteApi( (params)=>{
  return{
    url: Api.pzAssociationFp,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
