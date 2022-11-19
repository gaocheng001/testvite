import {defRouteApi, otherRouteApi, useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";


enum Api {
  load     = '/group/fileEncodingRules/load',
  save     = '/group/fileEncodingRules/save',
}

export function add(params){
  return defHttp.request({
    url: Api.save,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function load(type){
  return defHttp.request({
    url: Api.load+'/'+type,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  })
}




