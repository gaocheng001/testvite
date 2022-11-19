import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getDeptList =  defRouteApi(()=>{
  return {
    url: '/sys/zfClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getDeptListById =  defRouteApi(()=>{
  return {
    url: '/sys/zfClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const saveDept =  defRouteApi((params)=>{
  return {
    url: '/sys/zfClass/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const deleteDept =  defRouteApi((params)=> {
  return  {
    url: '/sys/zfClass/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag =  defRouteApi((params)=> {
  return  {
    url: '/sys/zfClass/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelDept = defRouteApi((params:any)=> {
  return {
    url: '/sys/zfClass/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const GetDeptTree = defRouteApi((params)=>{
  return {
    url: '/sys/zfClass/treeDept',
    method: 'GET',
    params
  }
})
export const GetDeptTreeByFlag = defRouteApi(()=>{
  return {
    url: '/sys/zfClass/treeDeptByFlag',
    method: 'GET',
  }
})
export const getMaxCode = defRouteApi((code: any)=>{
  return {
    url: '/sys/zfClass/getMaxCode?id='+code,
    method: 'GET',
  }
})
export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/zfClass/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findDelAll = defRouteApi((params:any)=> {
  return {
    url: '/sys/zfClass/findDelAll',
    method: 'POST',
    params
  }
})

export const deleteList = defRouteApi((params:any)=> {
  return {
    url: '/sys/zfClass/deleteList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const reductionList = defRouteApi((params:any)=> {
  return {
    url: '/sys/zfClass/reductionList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const introduceData = defRouteApi((params:any)=> {
  return {
    url: '/sys/zfClass/introduceData',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findSettModesInAll = defRouteApi((params)=> {
  return {
    url: '/sys/zfClass/findSettModesInAll',
    method: 'GET',
  }
})

