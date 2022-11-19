import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getTaskList(params:any) {
  return defHttp.request({
    url: '/task/findAll',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },params
  })
}
export function GroupAccuracyOverTime() {
  return defHttp.request({
    url: '/task/GroupAccuracyOverTime',
    method: 'POST',
  })
}
export function saveGroupAccuracyOverTime(decimalPlaces:any) {
  return defHttp.request({
    url: '/task/saveGroupAccuracyOverTime?decimalPlaces='+decimalPlaces,
    method: 'POST'
  })
}
export function editGroupAccuracyOverTime(id:any,decimalPlaces:any) {
  return defHttp.request({
    url: '/task/editGroupAccuracyOverTime?id='+id+'&decimalPlaces='+decimalPlaces,
    method: 'POST'
  })
}
export function deleteByState(params) {
  return defHttp.request({
    url: '/task/deleteByState',params,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function deleteList(params:any) {
  return defHttp.request({
    url: '/task/deleteList',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
export function delAcclotList(idlist:any) {
  return defHttp.request({
    url: '/task/delAcclotList?idlist='+idlist,
    method: 'POST',
  })
}
export function editAcclotStateList(idlist:any) {
  return defHttp.request({
    url: '/task/editAcclotStateList?idlist='+idlist,
    method: 'POST',
  })
}
export function getStockCurrLock() {
  return defHttp.request({
    url: '/task/getStockCurrLock',
    method: 'GET',
  })
}
export function delStockCurrLock(id) {
  return defHttp.request({
    url: '/task/delStockCurrLock?id='+id,
    method: 'POST',
  })
}



export const saveTaskApi = defRouteApi(async ({params}) => {
  return {
    url: '/task/save',
    method: 'POST',
    params,
  };
});
export const findByFunctionModule = defRouteApi(async ({name}) => {
  return {
    url: '/task/findByFunctionModule?name='+name,
    method: 'POST',
  };
});
export const countByFunctionModule = defRouteApi(async ({name}) => {
  return {
    url: '/task/countByFunctionModule?name='+name,
    method: 'POST',
  };
});
export const deleteByFunctionModuleAndCaozuoUnique = defRouteApi(async ({caozuoUnique,name}) => {
  return {
    url: '/task/deleteByFunctionModuleAndCaozuoUnique?caozuoUnique='+caozuoUnique+'&name='+name,
    method: 'POST',
  };
});

export const findByIyearAndCaozuoModule = defRouteApi( ({iyear,caozuoModule}) => {
  return {
    url: '/task/findByIyearAndCaozuoModule?iyear='+iyear+'&caozuoModule='+caozuoModule,
    method: 'GET',
  };
});
