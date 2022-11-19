import {defRouteApi, otherRouteApi, useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";


enum Api {
  findPeriodByAccontId  = '/faSeachConfig/findPeriodByAccontId',
  findPeriod            = '/faSeachConfig/findPeriod',
  findMaxJc             = '/faSeachConfig/findMaxJc',
  findAccountList       = '/faSeachConfig/findAccountList',
  findAll               = '/faSeachConfig/findAll',
  findPsnAll            = '/faSeachConfig/findPsnAll',
  findFaAssetType       = '/faSeachConfig/findFaAssetType',
  findProject           = '/faSeachConfig/findProject',
}

/**
 * @description: Get user jigou based on id
 */
// 日期
export function findPeriod(uniqueCode:any) {
  return defHttp.request(   {
    url: Api.findPeriod + '/' + uniqueCode,
    method: 'GET',
  })
}

// 获取级次范围
export const findMaxJc = defRouteApi(async () => {
  return {
    url: Api.findMaxJc,
    method: 'GET',
  };
});

// 管理代码list
export function findAccountList() {
  return defHttp.request(   {
    url: Api.findAccountList,
    method: 'GET',
  })
}

//总账
export const findAll=defRouteApi( async(params)=>{
  return{
    url: Api.findAll,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
},)


// 获取级次范围
export const findProject = defRouteApi(async () => {
  return {
    url: Api.findProject,
    method: 'GET',
  };
});

// 获取级次范围
export const findPsnAll = defRouteApi(async () => {
  return {
    url: Api.findPsnAll,
    method: 'GET',
  };
});

// 获取级次范围
export const findFaAssetType = defRouteApi(async () => {
  return {
    url: Api.findFaAssetType,
    method: 'GET',
  };
});
