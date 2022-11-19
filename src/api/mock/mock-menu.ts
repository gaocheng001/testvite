import {defRouteApi} from '/@/utils/boozsoft/datasource/datasourceUtil';
import {defHttp} from "/@/utils/http/axios";
import {GetUserInfoByUserIdModel} from "/@/api/sys/model/userModel";

enum Api {
  savePingZheng = "/pingzheng/save",
  savePingZhengTemp = "/pingzheng/saveTempData",
  queryDefaultPingZhengDate = "/pingzheng/queryDefaultPingZhengDate",
  defaultInoid = "/pingzheng/defaultInoid",
  queryByYearMonthInoIdApi2 = "/pingzheng/queryByYearMonthInoIdApi2",
  saveTempPingZhengApi = "/pingzheng/saveTempPingZheng",
  delPingZhengByUniqueCodeApi = "/pingzheng/delPingZhengByUniqueCode",
  insertPingZheng = "/pingzheng/insert"

}


export const delPingZhengByUniqueCodeApi = defRouteApi(async (params) => {
    return {
      url:
      Api.delPingZhengByUniqueCodeApi,
      method: 'POST',
      params
    };
  }
);

export const savePingZheng = defRouteApi(async (params) => {
    return {
      url:
      Api.savePingZheng,
      method: 'POST',
      params
    };
  }
);

export async  function savePingZhengApi(apiData){
  return await savePingZheng({json: JSON.stringify(apiData)})
}





export const insertPingZheng = defRouteApi(async (params) => {
    return {
      url:
      Api.insertPingZheng,
      method: 'POST',
      params
    };
  }
);
export const saveTempPingZhengApi = defRouteApi(async (params) => {
    return {
      url:
      Api.saveTempPingZhengApi,
      method: 'POST',
      params
    };
  }
);


export const queryDefaultPingZhengDate = defRouteApi(async (params) => {
    return {
      url:Api.queryDefaultPingZhengDate,
      method: 'POST',
      params
    };
  }
);
export const defaultInoidApi = defRouteApi(async (params) => {
    return {
      url:
      Api.defaultInoid,
      method: 'POST',
      params
    };
  }
);
export const queryByYearMonthInoIdApi2 = defRouteApi(async (params) => {
    return {
      url: Api.queryByYearMonthInoIdApi2,
      method: 'POST',
      params
    };
  }
);

export const lastItem = defRouteApi(async (params) => {
    return {
      url: '/pingzheng/lastItem',
      method: 'POST',
      params
    };
  }
);
export const previousItem = defRouteApi(async (params) => {
    return {
      url: '/pingzheng/previousItem',
      method: 'POST',
      params
    };
  }
);
export const lastPage = defRouteApi(async (params) => {
    return {
      url: '/pingzheng/lastPage',
      method: 'POST',
      params
    };
  }
);

export const oneMonth = defRouteApi(async (params) => {
    return {
      url: '/pingzheng/oneMonth',
      method: 'POST',
      params
    };
  }
);

export const savePingZhengTemp = defRouteApi(async (params) => {
    return {
      url: '/pingzheng/saveTempData',
      method: 'POST',
      params
    };
  }
);



export function putMenu(params) {
  return defHttp.request<GetUserInfoByUserIdModel>({
    url: '/mock/putMenu',
    method: 'POST',
    params
  })
}


export const delTempData = defRouteApi(async (params) => {
    return {
      url: '/pingzheng/delTempData',
      method: 'POST',
      params
    };
  }
);
