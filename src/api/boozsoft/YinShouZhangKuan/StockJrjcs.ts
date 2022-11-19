
import {defHttp} from "/@/utils/http/axios";

enum Api {
  GetAll = '/stockJrjcs/findAll',
}



export function GetStockJrjcsAll() {
  return defHttp.request({
    url: Api.GetAll,
    method: 'GET',
  });
}

