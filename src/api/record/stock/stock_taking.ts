import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";


//获取存货分类
export const getStockClassTree = defRouteApi( async (params) => {
    return {
      url:'/stockclass/treeStockClass',
      method: 'GET',
      timeout: 100000000000,
      params
    };
  }
);
//获取客户
export const getAllCustTree = defRouteApi( async (id) => {
    return {
      url:'/stockTaking/getAllCustTree/'+id,
      method: 'GET',
      timeout: 100000000000,
    };
  }
);
//list
export const findAll = defRouteApi(async (params) => {
  return {
    url: '/stockTaking/findAll',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const savePrice = defRouteApi(async (params) => {
  return {
    url: '/stockTaking/save',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const saveMx = defRouteApi(async (params) => {
  return {
    url: '/stockTaking/saveMx',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const delPrice = defRouteApi(async (id) => {
  return {
    url: '/stockTaking/del/'+id,
    timeout: 100000000000,
    method: 'GET',
  };
});
export const delCust = defRouteApi(async (id) => {
  return {
    url: '/stockTaking/delCust/'+id,
    timeout: 100000000000,
    method: 'GET',
  };
});

export const addCusts = defRouteApi(async (params) => {
  return {
    url: '/stockTaking/addCusts',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});



export const findSettModesAll = defRouteApi((params)=> {
  return {
    url: '/stockTaking/findAllTaking',
    method: 'POST',
    params
  }
})

export const findSettModesByFlag = defRouteApi(()=> {
  return {
    url: '/stockTaking/findAllTaking',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveSettModes = defRouteApi((params)=> {
  return {
    url: '/stockTaking',
    method: 'POST',
    params
  }
})
export const editSettModes = defRouteApi((params)=> {
  return {
    url: '/stockTaking/edit',
    method: 'POST',
    params
  }
})

export const deleteSettModes = defRouteApi((params)=> {
  return {
    url: '/stockTaking',
    method: 'DELETE',
    params
  }
})

export const findBySettModes = defRouteApi((settModesCode:any)=> {
  return {
    url: '/stockTaking/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByBsName = defRouteApi((settModesCode:any)=> {
  return {
    url: '/stockTaking/findByBsName?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelVoucherType = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findDeptList = defRouteApi((params:any)=> {
  return {
    url: '/sys/department/all',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findUserList = defRouteApi(()=> {
  return {
    url: '/sys/psn/getAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  }
})
export const findSearchAll = defRouteApi( async (search)=>{
  return  {
    url: '/cangku/findSearchAll?search='+search,
    method: 'POST',timeout: 10000000,
  }
})

export const findAllStockClass = defRouteApi(async () => {
  return {
    url: '/stockTaking/findAllStockClass',
    timeout: 100000000000,
    method: 'GET',
  };
});

export const findAllStock = defRouteApi(async () => {
  return {
    url: '/stockTaking/findAllStock',
    timeout: 100000000000,
    method: 'GET',
  };
});

export const checkAdd = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/checkAdd',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const clearPd = defRouteApi( async (ccode)=>{
  return  {
    url: '/stockTaking/clearPd?ccode='+ccode,
    method: 'GET',
    timeout: 10000000,
  }
})
export const autoPd = defRouteApi( async (ccode)=>{
  return  {
    url: '/stockTaking/autoPd?ccode='+ccode,
    method: 'GET',
    timeout: 10000000,
  }
})
export const audit = defRouteApi( async ({ccode,user})=>{
  return  {
    url: '/stockTaking/audit?ccode='+ccode+'&userNmae='+user,
    method: 'GET',
    timeout: 10000000,
  }
})
export const auditBack = defRouteApi( async (ccode)=>{
  return  {
    url: '/stockTaking/auditBack?ccode='+ccode,
    method: 'GET',
    timeout: 10000000,
  }
})
export const auditCheck = defRouteApi( async ({ccode,rkBcheck,ckBcheck,type})=>{
  return  {
    url: '/stockTaking/auditCheck/'+ccode+'/'+rkBcheck+'/'+ckBcheck+'/'+type,
    method: 'GET',
    timeout: 10000000,
  }
})
export const findBillByCondition = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/findBillByCondition',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findBillByConditions = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/findBillByConditions',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findYkBillByCondition = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/findYkBillByCondition',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findYkBillByConditions = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/findYkBillByConditions',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const delLine = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/delLine',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const getFwList = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/getFwList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findByTakingsAndCwhcodeAndCinvode = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/findByTakingsAndCwhcodeAndCinvode',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByTakingChCodes = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/findByTakingChCodes',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findByXyOutDataSourrce = defRouteApi(async (params) => {
  return {
    url: '/stock/stockTransfers/findByXyOutDataSourrce',
    timeout: 100000000000,
    method: 'POST',params
  };
});

export const getUnitList = defRouteApi( async ()=>{
  return  {
    url: '/stockTaking/getUnitList',
    method: 'GET',
    timeout: 10000000,
  }
})

export const getUnitsList = defRouteApi( async (mcode)=>{
  return  {
    url: '/stockTaking/getUnitsList/'+mcode,
    method: 'GET',
    timeout: 10000000,
  }
})
export const improtExcel = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/improtExcel',
    method: 'POST',
    timeout: 10000000,
    params
  }
})

export const improtExcel2 = defRouteApi((params:any)=> {
  return {
    url: '/stockTaking/improtExcel2',
    method: 'POST',
    timeout: 10000000,
    params
  }
})
export const getCkPriceList = defRouteApi((params:any)=> {
  return {
    url: '/stockCostAcc/getCkPriceList',
    method: 'POST',
    timeout: 10000000,
    params
  }
})
export const findByXyCcode = defRouteApi( async ({ccode,year,type})=>{
  return  {
    url: '/stockTaking/findByXyCcode/'+ccode+'/'+year+'/'+type,
    method: 'GET',
    timeout: 10000000,
  }
})
export const getDataInfo = defRouteApi( async (ccode)=>{
  return  {
    url: '/stock/stockTransfers/findStockWareByCcode?ccode='+ccode,
    method: 'POST',
    timeout: 10000000,
  }
})
