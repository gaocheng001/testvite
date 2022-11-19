
import {defHttp} from "/@/utils/http/axios";

enum Api {
  GetFaClassAll = '/groupFaClass/findAll',
  SaveFaClass = '/groupFaClass/save',
  DeleteFaClassBy = '/groupFaClass/deleteBy',
}



export function GetFaClassAll() {
  return defHttp.request({
    url: Api.GetFaClassAll,
    method: 'GET',
  });
}
export async function SaveFaClass(params) {
  return defHttp.request({
    url: Api.SaveFaClass,
    method: 'POST',
    params
  });
}
export function DeleteFaClassBy(params) {
  return defHttp.request({
    url: Api.DeleteFaClassBy,
    method: 'POST',
    params
  });
}
