import {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams
} from './model/systemModel'
import { defHttp } from '/@/utils/http/axios'
import { DemoOptionsGetResultModel } from '/@/api/demo/model/optionsModel'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  AccountList = '/system/getAccountList',
  // DeptList = '/system/getDeptList',
  setRoleStatus = '/system/setRoleStatus',
  DeptList='/sys/department/treeDept',
  MenuList = '/system/getMenuList',
  RolePageList = '/sys/getRoleListByPage',
  GetAllRoleList = '/sys/getAllRoleList',
}

export const getAccountList = (params: AccountParams) => {
  return defHttp.request<DemoOptionsGetResultModel>({
    url: Api.AccountList,
    params,
    method: 'GET'
  })
}
export const getDeptList = defRouteApi((params?: DeptListItem)=>{
  return {
    url: Api.DeptList,
    params,
    method: 'GET'
  }
})

export const getMenuList = (params?: MenuParams) => {
  return defHttp.request<DemoOptionsGetResultModel>({
    url: Api.MenuList,
    params,
    method: 'GET'
  })
}

export const getRoleListByPage = (params?: RolePageParams) => {
  return defHttp.request<DemoOptionsGetResultModel>({
    url: Api.RolePageList,
    params,
    method: 'GET'
  })
}

export const getAllRoleList = (params?: RoleParams) => {
  return defHttp.request<DemoOptionsGetResultModel>({
    url: Api.GetAllRoleList,
    params,
    method: 'GET'
  })
}
export const setRoleStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.setRoleStatus, params: { id, status } });
