import { defHttp } from '/@/utils/http/axios';
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

enum Api {
  copyCode = '/sys/acckemu/copyCode',
  GroupCopyCode = '/sys/acckemu/GroupCopyCode',
  delCodekemu = '/sys/acckemu/delCodekemu',
  findByCcode = '/sys/acckemu/findByCcode',
  sysimportCoke = '/sys/acckemu/importCoke',
  sysCountryImportCoke = '/sys/acckemu/sysCountryImportCoke',
  saveCodekemu = '/sys/acckemu/saveCodekemu',
  findByCodeNum = '/sys/acckemu/findByCodeNum',
  findByCodeName = '/sys/acckemu/findByCodeName',
  findByCodeName2 = '/sys/acckemu/findByCodeName2',
  findAllByUnitMea = '/sys/acckemu/findAllByUnitMea',
  findAllByCurrency = '/sys/acckemu/findAllByCurrency',
  findByLowerMaxCodeNum = '/sys/acckemu/findByLowerMaxCodeNum',
  findAllByGorupCurrency = '/sys/acckemu/findAllByGorupCurrency',
  delCodekemuLikeSuperCode = '/sys/acckemu/delCodekemuLikeSuperCode',
  findByIyearAndBendCode = '/sys/acckemu/findByIyearAndBendCode',
  findByUniqueAccStandardAndTemplateIdAndCcode = '/sys/acckemu/findByUniqueAccStandardAndTemplateIdAndCcode',
  findBySuperCodeName = '/sys/acckemu/findBySuperCodeName',

  saveGroupCodeTask = '/sys/acckemu/saveGroupCodeTask',

  companyfindAll = '/sys/acckemu/company/companyfindAll',
  company_treeCode = '/sys/acckemu/company/company_treeCode',
  company_copyCode = '/sys/acckemu/company/company_copyCode',
  company_importCoke = '/sys/acckemu/company/company_importCoke',
  company_saveCodekemu = '/sys/acckemu/company/company_saveCodekemu',
  company_delCodekemu = '/sys/acckemu/company/company_delCodekemu',
  company_countfindAll = '/sys/acckemu/company/company_countfindAll',
  company_findByCodeNum = '/sys/acckemu/company/company_findByCodeNum',
  company_findAllByIyear = '/sys/acckemu/company/company_findAllByIyear',
  company_findByCodeName = '/sys/acckemu/company/company_findByCodeName',
  company_findBySuperCodeName = '/sys/acckemu/company/company_findBySuperCodeName',
  groupStandardAndTemplate = '/sys/acckemu/company/groupStandardAndTemplate',
  company_delFindByCodekemu = '/sys/acckemu/company/company_delFindByCodekemu',
  company_findByIyearAndBendCode = '/sys/acckemu/company/company_findByIyearAndBendCode',
  findKuaiJiKeMu = '/sys/acckemu/company/findKuaiJiKeMu',
  company_findByLowerMaxCodeNum = '/sys/acckemu/company/company_findByLowerMaxCodeNum',
  company_findByCcode = '/sys/acckemu/company/company_findByCcode',
  company_findByIyearAndCcode = '/sys/acckemu/company/company_findByIyearAndCcode',
  company_findByPzCcodeStr = '/sys/acckemu/company/company_findByPzCcodeStr',
  company_countByLikeCcode = '/sys/acckemu/company/company_countByLikeCcode',
  company_findByQcCcodeStr = '/sys/acckemu/company/company_findByQcCcodeStr',
  company_findByXjCcodeStr = '/sys/acckemu/company/company_findByXjCcodeStr',
  company_findByxjllJieCodeStr = '/sys/acckemu/company/company_findByxjllJieCodeStr',
  company_findByxjllDaiCodeStr = '/sys/acckemu/company/company_findByxjllDaiCodeStr',
  company_delAll = '/sys/acckemu/company/company_delAll',
  company_fakeDelAll = '/sys/acckemu/company/company_fakeDelAll',
  company_findAllCodeOrderByAsc = '/sys/acckemu/company/company_findAllCodeOrderByAsc',
  company_findCodeByYear = '/sys/acckemu/company/company_findCodeByYear',
  company_findAllCodePxjzOrCyfxOrderByAsc = '/sys/acckemu/company/company_findAllCodePxjzOrCyfxOrderByAsc',
  company_editCodePxjzOrCyfx = '/sys/acckemu/company/company_editCodePxjzOrCyfx',
  company_editflag = '/sys/acckemu/company/company_editflag',
  company_findByFirstCcodeLength = '/sys/acckemu/company/company_findByFirstCcodeLength',
  company_proItemImport = '/sys/acckemu/company/company_proItemImport',
  company_findByNotLastCodeTree = '/sys/acckemu/company/company_findByNotLastCodeTree',
  company_findByLastCode = '/sys/acckemu/company/company_findByLastCode',
}

export const company_executeAccvoucher = defRouteApi( async (params) => {
    return {
      url:'/sys/acckemu/company/company_executeAccvoucher',
      method: 'POST',timeout: 100000000000,params
    };
  }
);

export const company_findByCodeAccVoucher = defRouteApi( async ({iyear}) => {
    return {
      url:'/sys/acckemu/company/company_findByCodeAccVoucher?iyear='+iyear,
      method: 'POST',timeout: 100000000000,
    };
  }
);

export const company_findByNoLastCode = defRouteApi( async (params) => {
    return {
      url:'/sys/acckemu/company/company_findByNoLastCode',
      method: 'POST',timeout: 100000000000,params
    };
  }
);

export const company_findByLastCode = defRouteApi( async (params) => {
    return {
      url:'/sys/acckemu/company/company_findByLastCode',
      method: 'POST',timeout: 100000000000,params
    };
  }
);
export const company_findByAllCode = defRouteApi( async (params) => {
    return {
      url:'/sys/acckemu/company/company_findByAllCode',
      method: 'POST',timeout: 100000000000,params
    };
  }
);
export const company_findByYearsAllCode = defRouteApi( async (params) => {
    return {
      url:'/sys/acckemu/company/company_findByYearsAllCode',
      method: 'POST',timeout: 100000000000,params
    };
  }
);

export const company_findByNotLastCodeTree = defRouteApi( async (params) => {
    return {
      url:'/sys/acckemu/company/company_findByNotLastCodeTree',
      method: 'POST',timeout: 100000000000,params
    };
  }
);
export const company_findByAllCodeTree = defRouteApi( async (params) => {
    return {
      url:'/sys/acckemu/company/company_findByAllCodeTree',
      method: 'POST',timeout: 100000000000,params
    };
  }
);
export const company_findByAllCodeTree2 = defRouteApi( async (params) => {
    return {
      url:'/sys/acckemu/company/company_findByAllCodeTree2',
      method: 'POST',timeout: 100000000000,params
    };
  }
);
export const company_findByIyearOrderByCcodeTree = defRouteApi( async (params) => {
    return {
      url:'/sys/acckemu/company/company_findByIyearOrderByCcodeTree',
      method: 'POST',timeout: 100000000000,params
    };
  }
);

export function delCodeByTemplate(templateId) {
  return defHttp.request({
    url:'/sys/acckemu/company/delCodeByTemplate?templateId='+templateId,
    method: 'POST',timeout: 100000000000,
  });
}

export function findBySuperCodeName(uniqueAccStandard, templateId, ccode,superCcod,iyear) {
  return defHttp.request({
    url:
      Api.findBySuperCodeName +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId +
      '&ccode=' +
      ccode+'&superCcod='+superCcod+'&iyear='+iyear,
    method: 'POST',timeout: 100000000000,
  });
}

export function findByCcode(ccode: any,templateID) {
  return defHttp.request({
    url:
      Api.findByCcode +
      '?ccode=' +
      ccode+'&templateID='+templateID,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByOrgCcode(ccode, orgUnique,iyear) {
  return defHttp.request({
    url:
      '/sys/acckemu/findByOrgCcode?ccode=' +
      ccode+'&orgUnique='+orgUnique+'&iyear='+iyear,
    method: 'POST',timeout: 100000000000,
  });
}

export function delAllCountryKeMu(uniqueAccStandard: any, templateId: any) {
  return defHttp.request({
    url: '/sys/country_code/delAllCountryKeMu?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId,
    method: 'POST',timeout: 100000000000,
  });
}
export function copyCode(uniqueAccStandard: any, templateId: any,newtemplateid:any) {
  return defHttp.request({
    url:
      Api.copyCode +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId+'&newtemplateid='+newtemplateid,
    method: 'POST',timeout: 100000000000,
  });
}
export function GroupCopyCode(uniqueAccStandard: any, templateId: any,lastcode:any,nolastcode:any) {
  return defHttp.request({
    url:
      Api.GroupCopyCode +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId+'&lastcode='+lastcode+'&nolastcode='+nolastcode,
    method: 'POST',timeout: 100000000000,
  });
}
export function saveCodekemu(params: any, username: any) {
  return defHttp.request({
    url: Api.saveCodekemu + '?username=' + username,
    method: 'POST',
    params,timeout: 100000000000,
  });
}

export function saveOrgCodekemu(params: any) {
  return defHttp.request({
    url: '/sys/acckemu/saveOrgCodekemu',
    method: 'POST',
    params,timeout: 100000000000,
  });
}
export function findByAccountCodeKemuTask(orgUnique: any,functionModule) {
  return defHttp.request({
    url: '/sys/acckemu/findByAccountCodeKemuTask?orgUnique='+orgUnique+'&functionModule='+functionModule,
    method: 'POST',
    timeout: 100000000000,
  });
}

export function delCodekemu(id: any, uniqueAccStandard: any, templateId: any) {
  return defHttp.request({
    url:
      Api.delCodekemu +
      '?id=' +
      id +
      '&uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId,
    method: 'POST',timeout: 100000000000,
  });
}
export function delOrgCodekemu(id: any, iyear: any, orgUnique: any) {
  return defHttp.request({
    url: '/sys/acckemu/delOrgCodekemu?id=' +
      id +
      '&iyear=' +
      iyear +
      '&orgUnique=' +
      orgUnique,
    method: 'POST',timeout: 100000000000,
  });
}
export function editOrgCodeKemuFlag(params) {
  return defHttp.request({
    url: '/sys/acckemu/editOrgCodeKemuFlag',
    method: 'POST',timeout: 100000000000,params
  });
}

export function findByOrgAccountCodeKemu(orgUnique,iyear,ccode) {
  return defHttp.request({
    url: '/sys/acckemu/findByOrgAccountCodeKemu?orgUnique='+orgUnique+'&iyear='+iyear+'&ccode='+ccode,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByOrgAccountCodeKemuSuperCodeAccvoucher(orgUnique,iyear,ccode) {
  return defHttp.request({
    url: '/sys/acckemu/findByOrgAccountCodeKemuSuperCodeAccvoucher?orgUnique='+orgUnique+'&iyear='+iyear+'&ccode='+ccode,
    method: 'POST',timeout: 100000000000,
  });
}


export function delCodekemuLikeSuperCode(id: any, uniqueAccStandard: any, templateId: any) {
  return defHttp.request({
    url:
      Api.delCodekemuLikeSuperCode +
      '?id=' +
      id +
      '&uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId,
    method: 'POST',timeout: 100000000000,
  });
}
export function delOrgCodekemuLikeSuperCode(id: any, uniqueAccStandard: any, templateId: any) {
  return defHttp.request({
    url: '/sys/acckemu/delOrgCodekemuLikeSuperCode?id=' +
      id +
      '&uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId,
    method: 'POST',timeout: 100000000000,
  });
}

export function findByOrgCodeNum(orgUnique: any, iyear: any, ccode: any) {
  return defHttp.request({
    url:
      '/sys/acckemu/findByOrgCodeNum?orgUnique=' +
      orgUnique +
      '&iyear=' +
      iyear +
      '&ccode=' +
      ccode,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByOrgCodeName(orgUnique: any, iyear: any, ccodeName: any) {
  return defHttp.request({
    url:
      '/sys/acckemu/findByOrgCodeName?orgUnique=' +
      orgUnique +
      '&iyear=' +
      iyear +
      '&ccodeName=' +
      ccodeName,
    method: 'POST',timeout: 100000000000,
  });
}

export function findByCodeNum(uniqueAccStandard: any, templateId: any, ccode: any) {
  return defHttp.request({
    url:
      Api.findByCodeNum +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId +
      '&ccode=' +
      ccode,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByCodeName(uniqueAccStandard: any, templateId: any, ccodename: any) {
  return defHttp.request({
    url:
      Api.findByCodeName +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId +
      '&ccodename=' +
      ccodename,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByCodeName2(uniqueAccStandard: any, templateId: any, ccodename: any, superCcod: any) {
  return defHttp.request({
    url:
      Api.findByCodeName2 +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId +
      '&ccodename=' +
      ccodename+
    '&superCcod=' +
      superCcod,
    method: 'POST',timeout: 100000000000,
  });
}

// export function findAllByUnitMea() {
//   return defHttp.request({
//     url: Api.findAllByUnitMea,
//     method: 'GET',timeout: 100000000000,
//   });
// }

export const findAllByUnitMea = defRouteApi( async () => {
    return {
      url:
      Api.findAllByUnitMea ,
      method: 'GET',timeout: 100000000000,
    };
  }
);

export function sysfindAllByUnitMea() {
  return defHttp.request({
    url: Api.findAllByUnitMea,
    method: 'GET',timeout: 100000000000,
  });
}


export function findAllByGorupCurrency() {
  return defHttp.request({
    url: Api.findAllByGorupCurrency,
    method: 'GET',timeout: 100000000000,
  });
}

export const findAllByCurrency = defRouteApi( async () => {
    return {
      url:
        Api.findAllByCurrency ,
      method: 'GET',timeout: 100000000000,
    };
  }
);

export function findByLowerMaxCodeNum(
  templateId: any,
  superiorCcode: any,
  code_length: any
) {
  return defHttp.request({
    url:
      Api.findByLowerMaxCodeNum +
      '?templateId=' +
      templateId +
      '&superiorCcode=' +
      superiorCcode +
      '&code_length=' +
      code_length,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByOrgLowerMaxCodeNum(
  orgUnique: any,
  superiorCcode: any,
  code_length: any,
  iyear: any,
) {
  return defHttp.request({
    url:
      '/sys/acckemu/findByOrgLowerMaxCodeNum?orgUnique=' +
      orgUnique +
      '&superiorCcode=' +
      superiorCcode +
      '&code_length=' +
      code_length+'&iyear='+iyear,
    method: 'POST',timeout: 100000000000,
  });
}

export function findByOrgKemuCodeToCode(
  orgUnique: any,
  iyear: any,
  parentCode: any,
  ccode: any,
) {
  return defHttp.request({
    url:
      '/sys/acckemu/findByOrgKemuCodeToCode?orgUnique=' +
      orgUnique +'&iyear='+iyear+'&parentCode='+parentCode+'&ccode='+ccode,
    method: 'POST',timeout: 100000000000,
  });
}

export function findByUniqueAccStandardAndTemplateIdAndCcode(
  uniqueAccStandard: any,
  templateId: any,
  ccode: any
) {
  return defHttp.request({
    url:
      Api.findByUniqueAccStandardAndTemplateIdAndCcode +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId +
      '&ccode=' +
      ccode,
    method: 'POST',timeout: 100000000000,
  });
}
export function saveGroupCodeTask(id: any, username: any, accstyle: any, templateid: any) {
  return defHttp.request({
    url:
      Api.saveGroupCodeTask +
      '?id=' +
      id +
      '&username=' +
      username +
      '&accstyle=' +
      accstyle +
      '&templateid=' +
      templateid,
    method: 'POST',timeout: 100000000000,
  });
}

export  async function sysimportCoke(params:any){
  return defHttp.request({
    url: Api.sysimportCoke,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export  async function sysimportOrgCoke(params:any){
  return defHttp.request({
    url: '/sys/acckemu/importOrgCoke',
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

export  async function sysCountryImportCoke(params:any){
  return defHttp.request({
    url: Api.sysCountryImportCoke,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export  async function findByIyearAndBendCode(uniqueAccStandard, templateId,bend){
  return defHttp.request({
    url: Api.findByIyearAndBendCode + '?uniqueAccStandard=' + uniqueAccStandard + '&templateId=' + templateId+'&bend='+bend,
    timeout: 100000000000,
    method: 'POST',
  })
}
export  async function findOrgCodeByIyearAndOrgUnique(iyear, orgUnique){
  return defHttp.request({
    url: '/sys/acckemu/findOrgCodeByIyearAndOrgUnique?iyear=' + iyear + '&orgUnique=' + orgUnique,
    timeout: 100000000000,
    method: 'POST',
  })
}


/* ********************************* 获取账套数据 ******************************** */

export const company_findByCcode = defRouteApi(
  async ({ccode,iyear}) => {
    return {
      url:
        Api.company_findByCcode +
        '?ccode=' +
        ccode+'&iyear='+iyear,
      method: 'POST',
      timeout: 100000000000,
    };
  }
);

export const company_findByIyearAndCcode = defRouteApi(
  async ({iyear,ccode}) => {
    return {
      url:
        Api.company_findByIyearAndCcode +
        '?iyear=' +
        iyear+'&ccode='+ccode,
      method: 'POST',
      timeout: 100000000000,
    };
  }
);


export const company_findByLowerMaxCodeNum = defRouteApi(
  async ({ superiorCcode, code_length }) => {
    return {
      url:
        Api.company_findByLowerMaxCodeNum +
        '?superiorCcode=' +
        superiorCcode +
        '&code_length=' +
        code_length,
      method: 'POST',timeout: 100000000000,
    };
  }
);

export const company_findByCodeNum = defRouteApi(
  async ({ uniqueAccStandard, templateId, ccode,iyear }) => {
    return {
      url:
        Api.company_findByCodeNum +
        '?uniqueAccStandard=' +
        uniqueAccStandard +
        '&templateId=' +
        templateId +
        '&ccode=' +
        ccode+'&iyear='+iyear,
      method: 'POST',timeout: 100000000000,
    };
  }
);

export const company_findByCodeName = defRouteApi(
  async ({ uniqueAccStandard, templateId, ccodename,iyear }) => {
    return {
      url:
        Api.company_findByCodeName +
        '?uniqueAccStandard=' +
        uniqueAccStandard +
        '&templateId=' +
        templateId +
        '&ccodename=' +
        ccodename+'&iyear='+iyear,
      method: 'POST',timeout: 100000000000,
    };
  }
);
export const company_findBySuperCodeName = defRouteApi(
  async ({ uniqueAccStandard, templateId, ccode,superCcod,iyear }) => {
    return {
      url:
        Api.company_findBySuperCodeName +
        '?uniqueAccStandard=' +
        uniqueAccStandard +
        '&templateId=' +
        templateId +
        '&ccode=' +
        ccode+'&superCcod='+superCcod+'&iyear='+iyear,
      method: 'POST',timeout: 100000000000,
    };
  }
);

export const company_saveCodekemu = defRouteApi(async ({params,iyear}) => {
  return {
    url: Api.company_saveCodekemu+'?iyear='+iyear,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    timeout: 100000000000,
    params,
  };
});
export const company_saveAll = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/company_saveAll',
    method: 'POST',
    timeout: 100000000000,
    params,
  };
});
export const company_AccountKeMuReplaceOrgKeMu = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/company_AccountKeMuReplaceOrgKeMu',
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    timeout: 100000000000,
    params,
  };
});

export const company_delCodekemu = defRouteApi(async ({ id, iyear,userName,independent }) => {
  return {
    url: Api.company_delCodekemu + '?id=' + id + '&iyear=' + iyear+'&userName='+userName+'&independent='+independent,
    method: 'POST',
    timeout: 100000000000,
  };
});

export const company_delFindByCodekemu = defRouteApi(async ({ ccode, iyear,databasenum }) => {
  return {
    url: Api.company_delFindByCodekemu + '?ccode=' + ccode + '&iyear=' + iyear+'&databasenum='+databasenum,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_findByIyearAndBendCode = defRouteApi(async ({ iyear, bend,databasenum }) => {
  return {
    url: Api.company_findByIyearAndBendCode + '?iyear=' + iyear + '&bend=' + bend+'&databasenum='+databasenum,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const findKuaiJiKeMu = defRouteApi(async ({ iyear, bend }) => {
  return {
    url: Api.findKuaiJiKeMu + '?iyear=' + iyear + '&bend=' + bend,
    method: 'POST',
    timeout: 100000000000,
  };
});

export const company_copyCode = defRouteApi(async ({ iyear, lastcode,nolastcode }) => {
  return {
    url: Api.company_copyCode + '?iyear=' + iyear + '&lastcode=' + lastcode+'&nolastcode='+nolastcode,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_findAllByIyear = defRouteApi(async ({iyear,databasenum}) => {
  return {
    url: Api.company_findAllByIyear + '?iyear=' + iyear+'&databasenum='+databasenum ,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const groupStandardAndTemplate = defRouteApi(async ({databaseNum,iyear}) => {
  return {
    url: Api.groupStandardAndTemplate+'?databaseNum='+databaseNum+'&iyear='+iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});

export const companyfindAll = defRouteApi((params) => {
  return {
    url: Api.companyfindAll,
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const company_treeCode = defRouteApi(async ({iyear}) => {
  return {
    url:
      Api.company_treeCode +
      '?iyear=' +
      iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const findByIyearOrderByCcode = defRouteApi(async ({iyear}) => {
  return {
    url:'/sys/acckemu/company/findByIyearOrderByCcode?iyear='+iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});


export const company_importCoke = defRouteApi(async ({params,databasenum,iyear,uniqueAccStandard,templateId,jici,codeTemplateId}) => {
  return {
    url: Api.company_importCoke+'?databasenum='+databasenum+'&iyear='+iyear+'&uniqueAccStandard='+uniqueAccStandard+'&templateId='+templateId+'&jici='+jici+'&codeTemplateId='+codeTemplateId,
    method: 'POST',
    timeout: 100000000000,
    params
  };
});
export const company_countfindAll = defRouteApi(async ({databasenum,iyear}) => {
  return {
    url: Api.company_countfindAll+'?databasenum='+databasenum+'&iyear='+iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_findByPzCcodeStr = defRouteApi(async ({iyear}) => {
  return {
    url: Api.company_findByPzCcodeStr+'?iyear='+iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_countByLikeCcode = defRouteApi(async (ccode) => {
  return {
    url: Api.company_countByLikeCcode+'?ccode='+ccode,
    method: 'POST',
    timeout: 100000000000,
  };
});

export const company_findByQcCcodeStr = defRouteApi(async ({iyear}) => {
  return {
    url: Api.company_findByQcCcodeStr+'?iyear='+iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_findByXjCcodeStr = defRouteApi(async ({iyear}) => {
  return {
    url: Api.company_findByXjCcodeStr+'?iyear='+iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_findByxjllJieCodeStr = defRouteApi(async ({iyear}) => {
  return {
    url: Api.company_findByxjllJieCodeStr+'?iyear='+iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_findByxjllDaiCodeStr = defRouteApi(async ({iyear}) => {
  return {
    url: Api.company_findByxjllDaiCodeStr+'?iyear='+iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_delAll = defRouteApi(async (params) => {
  return {
    url: Api.company_delAll,
    method: 'POST',
    timeout: 100000000000,params
  };
});
export const company_fakeDelAll = defRouteApi(async (params) => {
  return {
    url: Api.company_fakeDelAll,
    method: 'POST',
    timeout: 100000000000,params
  };
});

export const company_findAllCodeOrderByAsc = defRouteApi(async () => {
  return {
    url: Api.company_findAllCodeOrderByAsc,
    method: 'GET',
    timeout: 100000000000,
  };
});

export const company_findCodeByYear = defRouteApi(async ({iyear}) => {
  return {
    url: Api.company_findCodeByYear+'?iyear='+iyear,
    method: 'GET',
    timeout: 100000000000,
  };
});

export const company_editCodePxjzOrCyfx = defRouteApi(async (params) => {
  return {
    url: Api.company_editCodePxjzOrCyfx,
    method: 'POST',
    timeout: 100000000000,params
  };
});
export const company_findAllCodePxjzOrCyfxOrderByAsc = defRouteApi(async (params) => {
  return {
    url: Api.company_findAllCodePxjzOrCyfxOrderByAsc,
    method: 'POST',
    timeout: 100000000000,params
  };
});

export const company_editflag = defRouteApi(async (params) => {
  return {
    url: Api.company_editflag,
    method: 'POST',
    timeout: 100000000000,params
  };
});
export const company_findByFirstCcodeLength = defRouteApi(async() => {
  return {
    url: Api.company_findByFirstCcodeLength,
    method: 'GET',
    timeout: 100000000000,
  };
});
export const company_proItemImport = defRouteApi(async ({params,proItem}) => {
  return {
    url: Api.company_proItemImport+'?proItem='+proItem,
    method: 'POST',
    timeout: 100000000000,
    params
  };
});
export const company_findByBenNianCode = defRouteApi(async () => {
  return {
    url: '/sys/acckemu/company/company_findByBenNianCode',
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_findBySuperCode = defRouteApi(async (superCode) => {
  return {
    url: '/sys/acckemu/company/company_findBySuperCode?superCode='+superCode,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_findByUpYearCodeAndThisYearCode = defRouteApi(async ({iyear,styleStr}) => {
  return {
    url: '/sys/acckemu/company/company_findByUpYearCodeAndThisYearCode?iyear='+iyear+'&styleStr='+styleStr,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_setNewYearQc = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/company_setNewYearQc',
    method: 'POST',
    timeout: 100000000000,params
  };
});

export const company_executeSQL = defRouteApi(async (sql) => {
  return {
    url: '/sys/acckemu/company/company_executeSQL?sql='+sql,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_auditCodeKemuSave = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/company_auditCodeKemuSave',
    method: 'POST',
    timeout: 100000000000,params
  };
});
export const company_findByAuthorizationKeMu = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/company_findByAuthorizationKeMu',
    method: 'POST',
    timeout: 100000000000,params
  };
});
export const company_findByAuthorizationAndIyearKeMu = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/company_findByAuthorizationAndIyearKeMu',
    method: 'POST',
    timeout: 100000000000,params
  };
});
export const company_findByAuthorizationKeMuTree = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/company_findByAuthorizationKeMuTree',
    method: 'POST',
    timeout: 100000000000,params
  };
});
export const company_findByAuthorizationAndIyearKeMuTree = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/company_findByAuthorizationAndIyearKeMuTree',
    method: 'POST',
    timeout: 100000000000,params
  };
});
export const company_treeCodeAndFlag1 = defRouteApi(async ({iyear}) => {
  return {
    url: '/sys/acckemu/company/company_treeCodeAndFlag1?iyear='+iyear,
    method: 'POST',
    timeout: 100000000000,
  };
});
export const company_simpleSave = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/company_simpleSave',
    method: 'POST',
    timeout: 100000000000,params
  };
});
export const company_findByCcodeAndIyearOrderByDbillDate = defRouteApi(async (params) => {
  return {
    url: '/sys/acckemu/company/findByCcodeAndIyearOrderByDbillDate',
    method: 'POST',
    timeout: 100000000000,params
  };
});
