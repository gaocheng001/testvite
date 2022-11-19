import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getDeptList =  defRouteApi(()=>{
  return {
    url: '/sys/expenditureClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getDeptListById =  defRouteApi(()=>{
  return {
    url: '/sys/expenditureClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const saveDept =  defRouteApi((params)=>{
  return {
    url: '/sys/expenditureClass/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const deleteDept =  defRouteApi((params)=> {
  return  {
    url: '/sys/expenditureClass/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag =  defRouteApi((params)=> {
  return  {
    url: '/sys/expenditureClass/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelDept = defRouteApi((params:any)=> {
  return {
    url: '/sys/expenditureClass/excel',
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
    url: '/sys/expenditureClass/treeDept',
    method: 'GET',
    params
  }
})
export const GetDeptTreeByFlag = defRouteApi(()=>{
  return {
    url: '/sys/expenditureClass/treeDeptByFlag',
    method: 'GET',
  }
})

export const getMaxCode = defRouteApi((code: any)=>{
  return {
    url: '/sys/expenditureClass/getMaxCode?id='+code,
    method: 'GET',
  }
})

export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/deptClass/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})


export const findDelAll = defRouteApi((params:any)=> {
  return {
    url: '/sys/expenditureClass/findDelAll',
    method: 'POST',
    params
  }
})

export const deleteList = defRouteApi((params:any)=> {
  return {
    url: '/sys/expenditureClass/deleteList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const reductionList = defRouteApi((params:any)=> {
  return {
    url: '/sys/expenditureClass/reductionList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const introduceData = defRouteApi((params:any)=> {
  return {
    url: '/sys/expenditureClass/introduceData',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findSettModesInAll = defRouteApi((params)=> {
  return {
    url: '/sys/expenditureClass/findSettModesInAll',
    method: 'GET',
  }
})
