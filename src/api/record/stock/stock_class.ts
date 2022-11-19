// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const stockSaveApi = defRouteApi(async ({params}) => {
  return {
    url: '/stockclass/save' ,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const GetStockClassTree = defRouteApi(async () => {
  return {
    url: '/stockclass/treeStockClass',timeout: 100000000000,
    method: 'GET',
  };
});
export const treeStockClass = defRouteApi(async (params) => {
  return {
    url: '/stockclass/treeStockClass',timeout: 100000000000,
    method: 'POST',params
  };
});
export const findAllStockClassBend1 = defRouteApi(async () => {
  return {
    url: '/stockclass/findAllStockClassBend1',timeout: 100000000000,
    method: 'GET',
  };
});

export const findAllStockClass = defRouteApi(async (params) => {
  return {
    url: '/stockclass/findAllStockClass',timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const delStockClass = defRouteApi(async (id) => {
  return {
    url: '/stockclass/del?id=' + id ,timeout: 100000000000,
    method: 'POST',
  };
});

export const verifyStockClass = defRouteApi(async (stockClass) => {
  return {
    url: '/stockclass/verifyStockClass?stockClass=' + stockClass,timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  };
});

export const verifyStockClassName = defRouteApi(async ({ parentId, stockClassName }) => {
  return {
    url: '/stockclass/verifyStockClassName?parentId=' + parentId + '&stockClassName=' + stockClassName,timeout: 100000000000,
    method: 'POST',
  };
});


export const importStockClass = defRouteApi(async (params:any) => {
  return {
    url: '/stockclass/importStockClass',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const findByUniqueStockclass = defRouteApi(async (uniqueStockclass) => {
  return {
    url: '/stockclass/findByUniqueStockclass?uniqueStockclass=' + uniqueStockclass,timeout: 100000000000,
    method: 'POST',
  };
});
export const editStockCalssFlag = defRouteApi(async (params:any) => {
  return {
    url: '/stockclass/editStockCalssFlag',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
