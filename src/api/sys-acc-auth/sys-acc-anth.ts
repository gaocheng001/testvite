import {defHttp} from "/@/utils/http/axios";

export async function findByUserIdAndAccIdAndYear({userId, accId, year}) {
  return defHttp.request({
    url: '/sysAccAuth/findByUserIdAndAccIdAndYear?userId='+userId+'&accId='+accId+'&year='+year,
    method: 'GET',
  });
}

export async function findAllByCode({userId, accId, year}) {
  return defHttp.request({
    url: '/sysAccAuth/findAllByCode?userId='+userId+'&accId='+accId+'&year='+year,
    method: 'GET',
  });
}



