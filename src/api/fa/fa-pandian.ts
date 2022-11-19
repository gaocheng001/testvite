import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";


export const findFaPanDianListByCondition = defRouteApi((params) => {
  return {
    url: '/faPd/findFaPanDianListByCondition',
    method: 'POST',
    params
  }
})
export const findFaAssetByCondition = defRouteApi((params) => {
  return {
    url: '/faPd/findFaAssetByCondition',
    method: 'POST',
    params
  }
})

export const findFaAssetListByCondition = defRouteApi((params) => {
  return {
    url: '/faPd/findFaAssetListByCondition',
    method: 'POST',
    params
  }
})

export const findFaPanDianByCondition = defRouteApi((params) => {
  return {
    url: '/faPd/findFaPanDianByCondition',
    method: 'POST',
    params
  }
})

export const findFaInvoiceByDate = defRouteApi((params) => {
  return {
    url: '/faPd/generate',
    method: 'POST',
    params
  }
})

export const savePanDing = defRouteApi((params) => {
  return {
    url: '/faPd/save',
    method: 'POST',
    params
  }
})

export function findFaCheckByDate(params) {
  return defHttp.request({
    url: '/faPd/checkDate',
    method: 'GET',
    params
  })
}
export const delPanDing = defRouteApi((params) => {
  return {
    url: '/faPd/del',
    method: 'DELETE',
    params
  }
})
export const reviewPanDing = defRouteApi((params) => {
  return {
    url: '/faPd/review',
    method: 'POST',
    params
  }
})
