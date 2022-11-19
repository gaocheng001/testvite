import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export async function commitDatasource({params}) {
  return defHttp.request({
    url: '/sys/datasource/commitDatasource',
    method: 'GET',
    params
  })
}
export async function commitSchema(schemaName) {
    return defHttp.request({
        url: '/sys/datasource/commitSchema',
        method: 'GET',
        params:{
            schemaName
        }
      })
  }