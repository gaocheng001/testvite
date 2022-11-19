import {defHttp} from "/@/utils/http/axios";

export async function finAllotByAccId(accId,dataType) {
  return defHttp.request({
    url: '/groupAllot/finAllotByAccId?accId='+accId+'&dataType='+dataType,
    method: 'POST',
  });
}

export async function delAllotRecordById(id) {
  return defHttp.request({
    url: '/groupAllot/del?id='+id,
    method: 'POST',
  });
}

export async function editAcclotType(accId,dataUnique,acclotType) {
  return defHttp.request({
    url: '/groupAllot/editAcclotType?accId='+accId+'&dataUnique='+dataUnique+'&acclotType='+acclotType,
    method: 'POST',
  });
}


