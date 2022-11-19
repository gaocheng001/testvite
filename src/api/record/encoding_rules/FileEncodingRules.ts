import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  load     = '/sys/fileEncodingRules/load',
  save     = '/sys/fileEncodingRules/save',
  init     = '/sys/fileEncodingRules/init',
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

export const load =  defRouteApi((type)=>{
  return {
    url: Api.load+'/'+type,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  }
})

export const encodingInit =  defRouteApi(()=>{
  return {
    url: Api.init,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
