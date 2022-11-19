import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getDeptList =  defRouteApi(()=>{
  return {
    url: '/sys/FaProperty/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getDeptListById =  defRouteApi(()=>{
  return {
    url: '/sys/FaProperty/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const saveDept =  defRouteApi((params)=>{
  return {
    url: '/sys/FaProperty',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const deleteDept =  defRouteApi((params)=> {
  return  {
    url: '/sys/FaProperty',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag =  defRouteApi((params)=> {
  return  {
    url: '/sys/FaProperty/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelDept = defRouteApi((params:any)=> {
  return {
    url: '/sys/FaProperty/excel',
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
    url: '/sys/FaProperty/treeDept',
    method: 'GET',
    params
  }
})


export const GetDeptTreeByFlag = defRouteApi(async () => ({
  url: '/sys/FaProperty/treeDeptByFlag',
  method: 'GET',
}));


export const GetFaPropertyAll = defRouteApi(()=>{
  return {
    url: '/sys/FaProperty/findAll',
    method: 'GET',
  }
})

export const SaveFaProperty = defRouteApi((params)=>{
  return {
    url: '/sys/FaProperty/save',
    method: 'POST',
    params
  }
})

export const DeleteFaPropertyBy = defRouteApi((params)=>{
  return {
    url: '/sys/FaProperty/deleteBy',
    method: 'POST',
    params
  }
})
export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/FaProperty/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

