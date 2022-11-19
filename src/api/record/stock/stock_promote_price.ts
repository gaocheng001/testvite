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
      url:'/stockPromotePrice/getAllCustTree/'+id,
      method: 'GET',
      timeout: 100000000000,
    };
  }
);
//list
export const findAll = defRouteApi(async (params) => {
  return {
    url: '/stockPromotePrice/findAll',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const savePrice = defRouteApi(async (params) => {
  return {
    url: '/stockPromotePrice/save',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const delPrice = defRouteApi(async (id) => {
  return {
    url: '/stockPromotePrice/del/'+id,
    timeout: 100000000000,
    method: 'GET',
  };
});
export const delCust = defRouteApi(async (id) => {
  return {
    url: '/stockPromotePrice/delCust/'+id,
    timeout: 100000000000,
    method: 'GET',
  };
});

export const addCusts = defRouteApi(async (params) => {
  return {
    url: '/stockPromotePrice/addCusts',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});



export const findSettModesAll = defRouteApi(()=> {
  return {
    url: '/stockPromotePrice/findAllActivity',
    method: 'GET',
  }
})

export const findSettModesByFlag = defRouteApi(()=> {
  return {
    url: '/stockPromotePrice/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveSettModes = defRouteApi((params)=> {
  return {
    url: '/stockPromotePrice',
    method: 'POST',
    params
  }
})

export const deleteSettModes = defRouteApi((params)=> {
  return {
    url: '/stockPromotePrice',
    method: 'DELETE',
    params
  }
})

export const findBySettModes = defRouteApi((settModesCode:any)=> {
  return {
    url: '/stockPromotePrice/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByBsName = defRouteApi((settModesCode:any)=> {
  return {
    url: '/stockPromotePrice/findByBsName?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/stockPromotePrice/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelVoucherType = defRouteApi((params:any)=> {
  return {
    url: '/stockPromotePrice/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const improtExcel = defRouteApi(async (params) => {
  return {
    url: '/stockPromotePrice/improtExcel',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const findPromotionPrice = defRouteApi(async (params) => {
  return {
    url: '/stockPromotePrice/findPromotionPrice',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
