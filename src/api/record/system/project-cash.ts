import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getProjectCashList=defRouteApi( (params:any)=>{
  return {
    url: '/projectCash/findAll',
    method: 'Post',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const saveProjectCash=defRouteApi((params:any)=>{
  return {
    url: '/projectCash',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteProjectCash=defRouteApi((params:any)=>{
  return {
    url: '/projectCash',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByCode=defRouteApi((projectCode:any)=>{
  return {
    url: '/projectCash/findByCode?projectCode='+projectCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editFlag=defRouteApi((params:any)=>{
  return {
    url: '/projectCash/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findCodeByYearAndBend = defRouteApi((year:any)=>{
  return {
    url: '/projectCash/findCodeByYearAndBend?year='+year,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findCodeByProjectCode = defRouteApi(({projectCode,iyear})=>{
  return {
    url: '/projectCash/findCodeByProjectCode?projectCode='+projectCode+'&iyear='+iyear,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findCodeByIyear = defRouteApi((iyear:any)=>{
  return {
    url: '/projectCash/findCodeByIyear?iyear='+iyear,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const excelProjectCash = defRouteApi((params:any)=> {
  return {
    url: '/projectCash/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const initData = defRouteApi(({flgs,accId,year})=>{
  return {
    url: '/projectCash/initData?accId='+accId+'&flg='+flgs+'&year='+year,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export function isGroup({type,accId}){
  return defHttp.request({
    url: '/projectCash/isGroup?accId='+accId+'&type='+type,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export const getTypeList = defRouteApi(()=>{
  return {
    url: '/projectCash/getTypeList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getTotalData = defRouteApi(()=>{
  return {
    url: '/projectCash/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const saveMoney=defRouteApi((params:any)=>{
  return {
    url: '/projectCash/saveMoney',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const delAll = defRouteApi(()=>{
  return {
    url: '/projectCash/delAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const excelProjectCashQc = defRouteApi((params:any)=> {
  return {
    url: '/projectCash/excelQc',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
