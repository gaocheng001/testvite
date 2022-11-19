import {defRouteApi, otherRouteApi, useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";


enum Api {
  findAllByUnitName          = '/group/sys/unitmea/findAllByUnitName',
  findAllSysUnitOfMeaType    = '/group/sys/unitmea/findAllSysUnitOfMeaMany',
  findAll                    = '/group/sys/unitmea/findAll',
  editFlag                   = '/group/sys/unitmea/editFlag',
  deletePsn                  = '/group/sys/unitmea/delete',
  delMany                    = '/group/sys/unitmea/delMany',
  delManyList                = '/group/sys/unitmea/delManyList',
  save                       = '/group/sys/unitmea/save',
  saveList                   = '/group/sys/unitmea/saveList',
  saveType                   = '/group/sys/unitmea/saveType',
  delType                    = '/group/sys/unitmea/delType',
  findAllSysUnitOfMeaList    = '/group/sys/unitmea/findAllSysUnitOfMeaList',
  saveManyList               = '/group/sys/unitmea/saveManyList',


}
/**
 * 查询所有分类list
 * @return
 */
//查询list
export function findAllSysUnitOfMeaType(params) {
  return defHttp.request({
    url: Api.findAllSysUnitOfMeaType,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

//查询list
export const findAll=defRouteApi( (params)=>{
  return{
    url: Api.findAll,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)


export function findAllSysUnitOfMeaList(params) {
  return defHttp.request({
    url: Api.findAllSysUnitOfMeaList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export const findAllByUnitName=defRouteApi( ()=>{
  return{
    url: Api.findAllByUnitName,
    timeout: 100000000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
},)

export const savePsn=defRouteApi( (params)=>{
  return{
    url: Api.save,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
export const saveList=defRouteApi( (params)=>{
  return{
    url: Api.saveList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
export const deletePsn=defRouteApi( (params)=>{
  return{
    url: Api.deletePsn,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const delMany=defRouteApi( (params)=>{
  return{
    url: Api.delMany,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const delManyList=defRouteApi( (params)=>{
  return{
    url: Api.delManyList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const editFlag=defRouteApi( (params)=>{
  return{
    url: Api.editFlag,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const saveType=defRouteApi( (params)=>{
  return{
    url: Api.saveType,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const delType=defRouteApi( (id)=>{
  return{
    url: Api.delType+'/'+id,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  }
},)


export function saveManyList(params) {
  return defHttp.request({
    url: Api.saveManyList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}


