
import {defHttp} from "/@/utils/http/axios";

enum Api {
  GetFaPropertyAll = '/groupFaProperty/findAll',
  SaveFaProperty = '/groupFaProperty/save',
  DeleteFaPropertyBy = '/groupFaProperty/deleteBy',
}



export function GetFaPropertyAll() {
  return defHttp.request({
    url: Api.GetFaPropertyAll,
    method: 'GET',
  });
}
export async function SaveFaProperty(params) {
  return defHttp.request({
    url: Api.SaveFaProperty,
    method: 'POST',
    params
  });
}
export function DeleteFaPropertyBy(params) {
  return defHttp.request({
    url: Api.DeleteFaPropertyBy,
    method: 'POST',
    params
  });
}
