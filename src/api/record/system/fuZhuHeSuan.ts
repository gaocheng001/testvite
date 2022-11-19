import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
/*export const findSettModesAll=defRouteApi( ()=>{
  return {
    url: '/settModes/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})*/

export const findKeyLabelAll = defRouteApi(async (params) => {
  return {
    url: '/fuZhuHeSuan2/findKeyLabelAll',
    timeout:100000000000,
    method: 'POST',
    params
  };
});
export const findKeyLabelOtherAll = defRouteApi(async (params) => {
  return {
    url: '/fuZhuHeSuan2/findKeyLabelOtherAll',
    timeout:100000000000,
    method: 'POST',
    params
  };
});
