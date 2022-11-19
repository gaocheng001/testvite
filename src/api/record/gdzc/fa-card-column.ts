import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getDeptList =  defRouteApi(()=>{
  return {
    url: '/sys/faCardColumn/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getDeptListById =  defRouteApi(()=>{
  return {
    url: '/sys/faCardColumn/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const saveDept =  defRouteApi((params)=>{
  return {
    url: '/sys/faCardColumn',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const deleteDept =  defRouteApi((params)=> {
  return  {
    url: '/sys/faCardColumn',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag =  defRouteApi((params)=> {
  return  {
    url: '/sys/faCardColumn/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelDept = defRouteApi((params:any)=> {
  return {
    url: '/sys/faCardColumn/excel',
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
    url: '/sys/faCardColumn/treeDept',
    method: 'GET',
    params
  }
})


export const GetDeptTreeByFlag = defRouteApi(async () => ({
  url: '/sys/faCardColumn/treeDeptByFlag',
  method: 'GET',
}));


export const GetfaCardColumnAll = defRouteApi(()=>{
  return {
    url: '/sys/faCardColumn/findAll',
    method: 'GET',
  }
})

export const SavefaCardColumn = defRouteApi((params)=>{
  return {
    url: '/sys/faCardColumn/save',
    method: 'POST',
    params
  }
})

export const DeletefaCardColumnBy = defRouteApi((params)=>{
  return {
    url: '/sys/faCardColumn/deleteBy',
    method: 'POST',
    params
  }
})

