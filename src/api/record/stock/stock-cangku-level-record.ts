// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";


export const findAllByRecordBend = defRouteApi(async ({cangkuId,parentId}) => {
  return {
    url: '/cangku_level_record/findAllByRecordBend?cangkuId='+cangkuId+'&parentId='+parentId,
    timeout: 10000000,
    method: 'POST',
  };
});
export const findAllByCangkuIdAndCangkuLevelIdAndCangkuLevelOrder = defRouteApi(async ({cangkuId,cangkuLevelId,levelOrder}) => {
  return {
    url: '/cangku_level_record/findAllByCangkuIdAndCangkuLevelIdAndCangkuLevelOrder?cangkuId='+cangkuId+'&cangkuLevelId='+cangkuLevelId+'&levelOrder='+levelOrder,
    timeout: 10000000,
    method: 'POST',
  };
});

export const findAllByCangkuIdAndCangkuLevelOrderAndParentId = defRouteApi(async ({cangkuId,levelOrder,parentId}) => {
  return {
    url: '/cangku_level_record/findAllByCangkuIdAndCangkuLevelOrderAndParentId?cangkuId='+cangkuId+'&levelOrder='+levelOrder+'&parentId='+parentId,
    timeout: 10000000,
    method: 'POST',
  };
});

export const findAllByParentId = defRouteApi(async (parentId) => {
  return {
    url: '/cangku_level_record/findAllByParentIdOrderBySysNum?parentId='+parentId,
    timeout: 10000000,
    method: 'POST',
  };
});


export const findAllByCangkuIdAndCangkuLevelOrder = defRouteApi(async ({cangkuId,levelOrder}) => {
  return {
    url: '/cangku_level_record/findAllByCangkuIdAndCangkuLevelOrder?cangkuId='+cangkuId+'&levelOrder='+levelOrder,
    timeout: 10000000,
    method: 'POST',
  };
});

export const findByStockRecordId = defRouteApi(async (id) => {
  return {
    url: '/cangku_level_record/findByStockRecordId?id='+id,
    timeout: 10000000,
    method: 'POST',
  };
});
export const editRecordByflag = defRouteApi(async (params) => {
  return {
    url: '/cangku_level_record/editRecordByflag',
    timeout: 10000000,
    method: 'POST',params
  };
});
export const editBydefaultflag = defRouteApi(async ({flag,id}) => {
  return {
    url: '/cangku_level_record/editBydefaultflag?flag='+flag+'&id='+id,
    timeout: 10000000,
    method: 'POST',
  };
});
export const editByExpalin = defRouteApi(async ({explain,id}) => {
  return {
    url: '/cangku_level_record/editByExpalin?explain='+explain+'&id='+id,
    timeout: 10000000,
    method: 'POST',
  };
});

export const saveRecord = defRouteApi(async (params) => {
  return {
    url: '/cangku_level_record/saveRecord',
    timeout: 10000000,
    method: 'POST',params
  };
});
export const findCangkuJoinName = defRouteApi(async (params) => {
  return {
    url: '/cangku_level_record/findCangkuJoinName',
    timeout: 10000000,
    method: 'POST',params
  };
});
