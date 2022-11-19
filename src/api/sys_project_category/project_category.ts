import { defHttp } from '/@/utils/http/axios'
import {
  LoginResultModel
} from '/@/api/sys/model/userModel'

enum Api {
  FindAll = '/sys/project/category/findAll',
}

/**
 * @description: user login api
 */
export async function cateFindAll() {
  return defHttp.request<LoginResultModel>(
    {
      url: Api.FindAll,
      method: 'GET'
    }
  )
}

export async function columnFindCate(projectCateCode:any) {
  return defHttp.request<LoginResultModel>(
    {
      url: '/sys/project/category/findColumnByCate?projectCateCode=' + projectCateCode,
      method: 'GET',
    }
  )
}

export async function findByDatabaseUniqueCode() {
  return defHttp.request<LoginResultModel>(
    {
      url: '/sys/project/category/findByDatabaseUniqueCode',
      method: 'GET',
    }
  )
}

export async function findProCateByCode(projectCateCode:any) {
  return defHttp.request<LoginResultModel>(
    {
      url: '/sys/project/category/findByCode?projectCateCode=' + projectCateCode,
      method: 'GET',
    }
  )
}

export async function cateFindStateFlag() {
  return defHttp.request<LoginResultModel>(
    {
      url: '/sys/project/category/findBySuccessStateAndFlag',
      method: 'GET'
    }
  )
}

export async function findProCateByName(projectCateName:any) {
  return defHttp.request<LoginResultModel>(
    {
      url: '/sys/project/category/findByName?projectCateName=' + projectCateName,
      method: 'GET',
    }
  )
}