import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  findAllIperiodIyear = '/sys/subjectinitialBalance/findAllIperiodIyear',
  findByAccountInfo = '/sys/subjectinitialBalance/findByAccountInfo',
  findAllSubjectInitialBalance = '/sys/subjectinitialBalance/findAllSubjectInitialBalance',
  findAllSubjectInitialBalanceNewFuZhu = '/sys/subjectinitialBalance/findAllSubjectInitialBalance2',
  findAllSubjectInitialBalanceFuZhu = '/sys/subjectinitialBalance/findAllSubjectInitialBalanceFuZhu',
  findAllSubjectInitialBalanceFuZhuList = '/sys/subjectinitialBalance/findAllSubjectInitialBalanceFuZhuList',
  findAllSubjectInitialBalanceFuZhuListMingXi = '/sys/subjectinitialBalance/findAllSubjectInitialBalanceFuZhuListMingXi',
  findKeyLabelAll = '/sys/subjectinitialBalance/findAllSubjectInitialBalanceFuZhuListMingXi',
  saveSubjectInitialBalance = '/sys/subjectinitialBalance/saveSubjectInitialBalance',
  saveSubjectInitialBalanceFuZhu = '/sys/subjectinitialBalance/saveSubjectInitialBalanceFuZhu',
  modifySubjectInitialBalanceFuZhu = '/sys/subjectinitialBalance/modifySubjectInitialBalanceFuZhu',
  findByFunctionModule = '/sys/subjectinitialBalance/findByFunctionModule',
  saveTaskInfo = '/sys/subjectinitialBalance/saveTaskInfo',
  dowlonadMB = '/sys/subjectinitialBalance/dowlonadMB',
  delFunctionModule = '/sys/subjectinitialBalance/delFunctionModule',
  delInitalBalance = '/sys/subjectinitialBalance/delInitalBalance',
  delInitalBalanceFuZhu = '/sys/subjectinitialBalance/delInitalBalanceFuZhu',
  findAllByBendAndIyearOrderByCcode = '/sys/subjectinitialBalance/findAllByBendAndIyearOrderByCcode',
  findByIperiodFlag = '/sys/subjectinitialBalance/findByIperiodFlag',
  findByAccvoucherIbook = '/sys/subjectinitialBalance/findByAccvoucherIbook',
  findBySubjectInitalBalabceIbook = '/sys/subjectinitialBalance/findBySubjectInitalBalabceIbook',
  ssph = '/sys/subjectinitialBalance/ssph',
  qcjz = '/sys/subjectinitialBalance/qcjz',
  qcjzsum = '/sys/subjectinitialBalance/qcjzsum',
  pzjzibook = '/sys/subjectinitialBalance/pzjzibook',
  emptyAll = '/sys/subjectinitialBalance/emptyAll',
  importInitalBalance = '/subjectinitialBalance/importInitalBalance',
  importInitalBalanceFz = '/subjectinitialBalance/importInitalBalanceFz',
}

export function findAllIperiodIyear(database: any) {
  return defHttp.request({
    url: Api.findAllIperiodIyear + '?database=' + database,
    timeout: 100000000000,
    method: 'POST',
  });
}

export const findByAccountInfo = defRouteApi(async () => {
  return {
    url: Api.findByAccountInfo,
    timeout: 100000000000,
    method: 'GET',
  };
});

export const findAllSubjectInitialBalance = defRouteApi(async ({ iyear, lastCode,databasenum,ccode,cclass,bend }) => {
  return {
    url: Api.findAllSubjectInitialBalance + '?iyear=' + iyear + '&lastCode=' + lastCode+'&databasenum='+databasenum+'&ccode='+ccode+'&cclass='+cclass+'&bend='+bend,
    timeout: 100000000000,
    method: 'POST',
  };
});
export const findAllSubjectInitialBalanceNewFuZhu = defRouteApi(async (params) => {
  return {
    url: Api.findAllSubjectInitialBalanceNewFuZhu,
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findAllSubjectInitialBalanceFuZhu = defRouteApi(async ({ iyear, lastCode,databasenum }) => {
  return {
    url: Api.findAllSubjectInitialBalanceFuZhu + '?iyear=' + iyear + '&lastCode=' + lastCode+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const findAllSubjectInitialBalanceFuZhuList = defRouteApi(async ({ iyear, ccode,databasenum }) => {
  return {
    url: Api.findAllSubjectInitialBalanceFuZhuList + '?iyear=' + iyear + '&ccode=' + ccode + '&databasenum=' + databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const findAllSubjectInitialBalanceFuZhuListMingXi = defRouteApi(async ({ iyear, ccode,databasenum }) => {
  return {
    url: Api.findAllSubjectInitialBalanceFuZhuListMingXi + '?iyear=' + iyear + '&ccode=' + ccode + '&databasenum=' + databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const saveSubjectInitialBalance = defRouteApi(async ({ params, accId, userName,databasenum,saveType }) => {
  return {
    url: Api.saveSubjectInitialBalance + '?accId=' + accId + '&userName=' + userName+'&databasenum='+databasenum+'&saveType='+saveType,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const saveSubjectInitialBalanceFuZhu = defRouteApi(async ({ params, accId, userName,databasenum }) => {
  return {
    url: Api.saveSubjectInitialBalanceFuZhu + '?accId=' + accId + '&userName=' + userName+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});
export const modifySubjectInitialBalanceFuZhu = defRouteApi(async ({ params, accId, userName,databasenum }) => {
  return {
    url: Api.modifySubjectInitialBalanceFuZhu + '?accId=' + accId + '&userName=' + userName+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});
export const findByFunctionModule = defRouteApi(async ({iyear}) => {
  return {
    url: Api.findByFunctionModule + '?iyear=' + iyear,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const saveTaskInfo = defRouteApi(async ({ id, iyear,functionModule,username,databasenum,method }) => {
  return {
    url: Api.saveTaskInfo + '?id=' + id + '&iyear=' + iyear+'&functionModule='+functionModule+'&username='+username+'&databasenum='+databasenum+'&method='+method,
    timeout: 100000000000,
    method: 'POST',
  };
});
export const editTaskTime = defRouteApi(async ({ id }) => {
  return {
    url: '/sys/subjectinitialBalance/editTaskTime?id=' + id ,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const dowlonadMB = defRouteApi(async () => {
  return {
    url: Api.dowlonadMB,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const delFunctionModule = defRouteApi(async ({id,databasenum}) => {
  return {
    url: Api.delFunctionModule + '?id=' + id+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const delInitalBalance = defRouteApi(async ({ str, iyear }) => {
  return {
    url: Api.delInitalBalance + '?str=' + str + '&iyear=' + iyear,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const delInitalBalanceFuZhu = defRouteApi(async ({ str, iyear, databasenum ,ccode }) => {
  return {
    url: Api.delInitalBalanceFuZhu + '?str=' + str + '&iyear=' + iyear + '&databasenum=' + databasenum + '&ccode=' + ccode,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const findAllByBendAndIyearOrderByCcode = defRouteApi(async ({ bend, iyear }) => {
  return {
    url: Api.findAllByBendAndIyearOrderByCcode + '?bend=' + bend + '&iyear=' + iyear,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const findByIperiodFlag = defRouteApi(async ({iyear,databasenum}) => {
  return {
    url: Api.findByIperiodFlag + '?iyear=' + iyear+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const findByAccvoucherIbook = defRouteApi(async ({iyear,databasenum}) => {
  return {
    url: Api.findByAccvoucherIbook + '?iyear=' + iyear+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const findBySubjectInitalBalabceIbook = defRouteApi(async ({iyear,databasenum}) => {
  return {
    url: Api.findBySubjectInitalBalabceIbook + '?iyear=' + iyear+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const ssph = defRouteApi(async ({iyear,standardSelected,databasenum}) => {
  return {
    url: Api.ssph + '?iyear=' + iyear+'&standardSelected='+standardSelected+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const qcjz = defRouteApi(async ({ iyear, ibook,databasenum }) => {
  return {
    url: Api.qcjz + '?iyear=' + iyear + '&ibook=' + ibook+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const qcjzsum = defRouteApi(async ({iyear,databasenum}) => {
  return {
    url: Api.qcjzsum + '?iyear=' + iyear+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const pzjzibook = defRouteApi(async ({iyear,databasenum}) => {
  return {
    url: Api.pzjzibook + '?iyear=' + iyear+'&databasenum='+databasenum,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const emptyAll = defRouteApi(async (id) => {
  return {
    url: Api.emptyAll + '?id=' + id,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const importInitalBalance = defRouteApi(async ({params,databasenum,iyear,mark}) => {
  return {
    url: Api.importInitalBalance+'?databasenum='+databasenum+'&iyear='+iyear+'&mark='+mark,
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const importInitalBalanceFz = defRouteApi(async ({params,databasenum,iyear,mark,titlesJson}) => {
  return {
    url: Api.importInitalBalanceFz+'?databasenum='+databasenum+'&iyear='+iyear+'&mark='+mark+'&titlesJson='+titlesJson,
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

/************************************ 集团的 **********************************/
export function sys_findByFunctionModule(iyear: any) {
  return defHttp.request({
    url: Api.findByFunctionModule + '?iyear=' + iyear,
    timeout: 100000000000,
    method: 'POST',
  });
}
export function sys_delFunctionModule(id: any) {
  return defHttp.request({
    url: Api.delFunctionModule + '?id=' + id,
    timeout: 100000000000,
    method: 'POST',
  });
}
