import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
import {defHttp} from "/@/utils/http/axios";

enum Api {
  findAllByflag = '/accpanel/findAllByflag',
  findAllGroupSysUser = '/accpanel/findAllGroupSysUser',
  savePanel = '/accpanel/savePanel',
  delPanel = '/accpanel/del',
  countByFlag = '/accpanel/countByFlag',
  firstShowData = '/accpanel/firstShowData',
  countByPanelName = '/accpanel/countByPanelName',
  findAllByGroupSysUserFlag = '/accpanel/findAllByGroupSysUserFlag',
}

export async function findAllByGroupSysUserFlag() {
  return defHttp.request({
    url: Api.findAllByGroupSysUserFlag,
    method: 'POST',timeout: 100000000000,
  });
}

export const findAllByflag = defRouteApi(async (params) => {
  return {
    url: Api.findAllByflag,
    method: 'POST',timeout: 100000000000,
    params
  };
});
export const savePanel = defRouteApi(async ({params}) => {
  return {
    url: Api.savePanel,
    method: 'POST',timeout: 100000000000,
    params
  };
});
export const delPanel = defRouteApi(async ({params}) => {
  return {
    url: Api.delPanel,
    method: 'DELETE',timeout: 100000000000,
    params
  };
});
export const countByFlag = defRouteApi(async ({iyear,flag}) => {
  return {
    url: Api.countByFlag+'?iyear='+iyear+'&flag='+flag,
    method: 'POST',timeout: 100000000000,
  };
});
export const firstShowData = defRouteApi(async ({iyear,panelFlag,panelType}) => {
  return {
    url: Api.firstShowData+'?iyear='+iyear+'&panelFlag='+panelFlag+'&panelType='+panelType,
    method: 'POST',timeout: 100000000000,
  };
});
export const countByPanelName = defRouteApi(async ({name}) => {
  return {
    url: Api.countByPanelName+'?name='+name,
    method: 'POST',timeout: 100000000000,
  };
});
export const copyPanel = defRouteApi(async (params) => {
  return {
    url: '/accpanel/copyPanel',params,
    method: 'POST',timeout: 100000000000,
  };
});
