import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get jigou Emp based on id
 */
export const findCodeCompareAll = defRouteApi(()=> {
  return {
    url: '/codeCompare/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },timeout:100000000000
  }
})

export const findCodeCompareByIyear = defRouteApi(({iyear}:any)=> {
  return {
    url: '/codeCompare/findByIyear?iyear='+iyear,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },timeout:100000000000
  }
})

export const saveCodeCompare = defRouteApi((params:any)=> {
  return {
    url: '/codeCompare',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params,timeout:100000000000
  }
})

export const deleteCodeCompare = defRouteApi((id:any)=> {
  return {
    url: '/codeCompare?id='+id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },timeout:100000000000
  }
})

export const excelCodeCompare = defRouteApi((params:any)=> {
  return {
    url: '/codeCompare/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
