import {defHttp} from '/@/utils/http/axios';

import {getMenuListByIdParamsResultModel, saveMenusByRoleIdParms} from './model/menuModel';

const API_PREFIX = '/sys/menu';

function usePrefix(uri) {
  return API_PREFIX + uri;
}

const Api = {
  GetAllPlatform: usePrefix('/getAllPlatform'),
  GetMenuListById: usePrefix('/getMenuListById'),
  GetMenuTree2: usePrefix('/tree2'),
  GetMenuTree2ByPlatform: usePrefix('/tree2/byPlatform'),
  GetPlatforms: usePrefix('/platfroms'),
  MenuIdsByRoleId: usePrefix('/menuIdsByRoleId'),
  MenuTreeAll:  usePrefix('/route/treeAll'),
  GetMenuTreeByPlatformId: usePrefix('/getMenuTreeByPlatformId'),
  CommitLayout: usePrefix('/commitLayout'),
  SaveMenusByRoleId: usePrefix('/saveMenusByRoleId')
};

/**
 * @description: Get user menu based on id
 */

export const commitLayout = (params: any) =>
  defHttp.request<getMenuListByIdParamsResultModel>({
    url: Api.CommitLayout,
    method: 'GET',
    params
  });

export const menuIdsByRoleId = async (params: any) =>
  await defHttp.request<getMenuListByIdParamsResultModel>({
    url: Api.MenuIdsByRoleId,
    method: 'GET',
    params
  });

export const getPlatforms = async () =>
  await defHttp.request<getMenuListByIdParamsResultModel>({
    url: Api.GetPlatforms,
    method: 'GET'
  });


export const GetMenuTree = async () =>
  await defHttp.request<getMenuListByIdParamsResultModel>({
    url: Api.GetMenuTree,
    method: 'GET'
  });

export const GetMenuTree2 = async () =>
  await defHttp.request<getMenuListByIdParamsResultModel>({
    url: Api.GetMenuTree2,
    method: 'GET'
  });

export const saveMenusByRoleId = async (params: saveMenusByRoleIdParms) => {
  await defHttp.request<getMenuListByIdParamsResultModel>({
    url: Api.SaveMenusByRoleId,
    method: 'POST',
    params
  });
};

export const syncMenuAndRoleMenuApi = async (params: saveMenusByRoleIdParms) => {
  await defHttp.request<getMenuListByIdParamsResultModel>({
    timeout: 50000000,
    url: API_PREFIX + '/syncMenuAndRoleMenu',
    method: 'POST',
    params
  });
};
export const getMenuTreeByPlatformId = (params: any) =>
  defHttp.request<getMenuListByIdParamsResultModel>({
    url: Api.GetMenuTreeByPlatformId,
    method: 'GET',
    params
  });

export const getAllPlatform = () =>
  defHttp.get({url: Api.GetAllPlatform});

