import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getDeptList =  defRouteApi(()=>{
  return {
    url: '/sys/jobfile/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getTypeList =  defRouteApi(()=>{
  return {
    url: '/sys/jobfile/getTypeList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getDeptListById =  defRouteApi(()=>{
  return {
    url: '/sys/jobfile/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getJobFileList =  defRouteApi(()=>{
  return {
    url: '/sys/jobfile/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveDept =  defRouteApi((params)=>{
  return {
    url: '/sys/jobfile/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const saveJobType =  defRouteApi((params)=>{
  return {
    url: '/sys/jobfile/saveJobType',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteDept =  defRouteApi((params)=> {
  return  {
    url: '/sys/jobfile/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag =  defRouteApi((params)=> {
  return  {
    url: '/sys/jobfile/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelDept = defRouteApi((params:any)=> {
  return {
    url: '/sys/jobfile/excel',
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
    url: '/sys/jobfile/treeDept',
    method: 'GET',
    params
  }
})
export const GetDeptTreeByFlag = defRouteApi(()=>{
  return {
    url: '/sys/jobfile/treeDeptByFlag',
    method: 'GET',
  }
})
export const getMaxCode = defRouteApi((code: any)=>{
  return {
    url: '/sys/jobfile/getMaxCode?id='+code,
    method: 'GET',
  }
})
export const delTypeById = defRouteApi((id: any)=>{
  return {
    url: '/sys/jobfile/delTypeById?id='+id,
    method: 'GET',
  }
})
export const excelVoucherType = defRouteApi((params:any)=>{
  return {
    url: '/sys/jobfile/excel',
    method: 'POST',
    params

  }
})
