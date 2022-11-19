import {defHttp} from "/@/utils/http/axios";

enum Api {
  findAllByNcPanel = '/nc/findAllByNcPanel',
  editFlagAndAccId = '/nc/editFlagAndAccId',
  editOrderAndAccId = '/nc/editOrderAndAccId',
}

export function findAllByNcPanel() {
  return defHttp.request({
    url: Api.findAllByNcPanel,
    method: 'POST',
  });
}

export function editFlagAndAccId(flag,accId,id) {
  return defHttp.request({
    url: Api.editFlagAndAccId+'?flag='+flag+'&accId='+accId+'&id='+id,
    method: 'POST',
  });
}

export function editOrderAndAccId(order,accId,id) {
  return defHttp.request({
    url: Api.editOrderAndAccId+'?order='+order+'&accId='+accId+'&id='+id,
    method: 'POST',
  });
}
