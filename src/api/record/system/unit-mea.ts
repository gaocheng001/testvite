import {defRouteApi, otherRouteApi, useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";


enum Api {
  findAllByUnitName          = '/sys/unitmea/findAllByUnitName',
  findAllSysUnitOfMeaType    = '/sys/unitmea/findAllSysUnitOfMeaMany',
  findAll                    = '/sys/unitmea/findAll',
  editFlag                   = '/sys/unitmea/editFlag',
  deletePsn                  = '/sys/unitmea/delete',
  delMany                    = '/sys/unitmea/delMany',
  delManyList                = '/sys/unitmea/delManyList',
  save                       = '/sys/unitmea/save',
  saveList                   = '/sys/unitmea/saveList',
  saveType                   = '/sys/unitmea/saveType',
  delType                    = '/sys/unitmea/delType',
  findAllSysUnitOfMeaList    = '/sys/unitmea/findAllSysUnitOfMeaList',
  findAllSysUnitOfMea        = '/sys/unitmea/findAllSysUnitOfMea',
  findUnitInfoById            = '/sys/unitmea/findUnitInfoById',
  findUnitInfoList            = '/sys/unitmea/findUnitInfoList',
  findUnitAssociationList            = '/sys/unitmea/findUnitAssociationList',
  saveManyList               = '/sys/unitmea/saveManyList',
  editManyList               = '/sys/unitmea/editManyList',
  introduceData              = '/sys/unitmea/introduceData',
  introduceDatas             = '/sys/unitmea/introduceDatas',
  findInAll                  = '/sys/unitmea/findInAll',
  findInsAll                  = '/sys/unitmea/findInsAll',
  findMeaTypeList             = '/sys/unitmea/findMeaTypeList',
  findMeaTypeAll              = '/sys/unitmea/findMeaTypeAll',
}
/**
 * 查询所有分类list
 * @return
 */
//查询list
export const findAllSysUnitOfMeaType=defRouteApi( (params)=>{
  return{
    url: Api.findAllSysUnitOfMeaType,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
export const findAllSysUnitOfMea=defRouteApi( (params)=>{
  return{
    url: Api.findAllSysUnitOfMea,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
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
export const findAllSysUnitOfMeaList=defRouteApi( (params)=>{
  return{
    url: Api.findAllSysUnitOfMeaList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findUnitInfoById=defRouteApi( (params)=>{
  return{
    url: Api.findUnitInfoById,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findUnitInfoList=defRouteApi( ()=>{
  return{
    url: Api.findUnitInfoList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
  }
})
export const findUnitAssociationList=defRouteApi( ()=>{
  return{
    url: Api.findUnitAssociationList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
  }
})
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

export const saveManyList = defRouteApi(async (params) => {
  return {
    url: Api.saveManyList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  };
});
export const editManyList = defRouteApi(async (params) => {
  return {
    url: Api.editManyList,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  };
});

export const introduceData = defRouteApi(async (params) => {
  return {
    url: Api.introduceData,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  };
});

export const introduceDatas = defRouteApi(async (params) => {
  return {
    url: Api.introduceDatas,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  };
});

export const findInAll=defRouteApi( (params)=>{
  return{
    url: Api.findInAll,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const findInsAll=defRouteApi( (params)=>{
  return{
    url: Api.findInsAll,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)

export const excelVoucherType = defRouteApi( async (params:any)=>{
  return  {
    url: '/sys/unitmea/excel',
    method: 'POST',
    params
  }
})
export const excelVoucherType1 = defRouteApi( async (params:any)=>{
  return  {
    url: '/sys/unitmea/excels',
    method: 'POST',
    params
  }
})
export const findMeaTypeList=defRouteApi( (params)=>{
  return{
    url: Api.findMeaTypeList,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
export const findMeaTypeAll=defRouteApi( (params)=>{
  return{
    url: Api.findMeaTypeAll,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)
