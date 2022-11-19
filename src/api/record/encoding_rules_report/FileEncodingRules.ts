import {defRouteApi, otherRouteApi, useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

enum Api {
  load     = '/sys/reportEncodingRules/load',
  save     = '/sys/reportEncodingRules/save',
  init     = '/sys/reportEncodingRules/init',
}

export const add =  defRouteApi((params:any)=>{
  return {
    url: Api.save,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const fileInit =  defRouteApi(()=>{
  return {
    url: Api.init,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const load =  defRouteApi((type)=>{
  return {
    url: Api.load+'/'+type,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  }
})

