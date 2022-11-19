import { defHttp } from '/@/utils/http/axios'

const defaultList = [
  {systemFieldName:'制单日期',systemFieldNum: 'formDate',customerFieldName:'',fieldType: 'DATE'},
  {systemFieldName:'凭证类型',systemFieldNum: 'csign',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'凭证号',systemFieldNum: 'inoId',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'附单据数',systemFieldNum: 'idoc',customerFieldName:'',fieldType: 'NUMBER'},
  {systemFieldName:'凭证摘要',systemFieldNum: 'cdigest',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'科目编码',systemFieldNum: 'ccode',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'科目名称',systemFieldNum: 'ccodeName',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'借方金额',systemFieldNum: 'md',customerFieldName:'',fieldType: 'MONEY'},
  {systemFieldName:'贷方金额',systemFieldNum: 'mc',customerFieldName:'',fieldType: 'MONEY'},
  {systemFieldName:'制单人',systemFieldNum: 'cbill',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'审核人',systemFieldNum: 'ccheck',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'主管签字人',systemFieldNum: 'cdirector',customerFieldName:'',fieldType: 'DATE'},
  {systemFieldName:'记账人',systemFieldNum: 'cbook',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'凭证状态',systemFieldNum: 'ifrag',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'出纳签字人',systemFieldNum: 'cashier',customerFieldName:'',fieldType: 'TEXT'},
/*  {systemFieldName:'审核日期',systemFieldNum: 'checkDate',customerFieldName:'',fieldType: 'DATE'},*/
/*  {systemFieldName:'年度',systemFieldNum: 'year',customerFieldName:'',fieldType: 'TEXT'},   */
  {systemFieldName:'结算方式编码',systemFieldNum: 'settlementMethod',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'票据号',systemFieldNum: 'pjId',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'票据日期',systemFieldNum: 'pjDate',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'结算单位名称',systemFieldNum: 'pjUnitName',customerFieldName:'',fieldType: 'TEXT'},
 /* {systemFieldName:'现金流量项目编码',systemFieldNum: 'cashProject',customerFieldName:'',fieldType: 'TEXT'},*/
  {systemFieldName:'部门编码',systemFieldNum: 'cdeptId',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'个人编码',systemFieldNum: 'cpersonId',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'客户编码',systemFieldNum: 'ccusId',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'供应商编码',systemFieldNum: 'csupId',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'项目大类编码',systemFieldNum: 'projectClassId',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'项目编码',systemFieldNum: 'projectId',customerFieldName:'',fieldType: 'TEXT'},
]

const standard = [
  // {systemFieldName:'计算单位',systemFieldNum: 'unitMeasurement',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'借方数量',systemFieldNum: 'ndS',customerFieldName:'',fieldType: 'NUMBER'},
  {systemFieldName:'贷方数量',systemFieldNum: 'ncS',customerFieldName:'',fieldType: 'NUMBER'},
  // {systemFieldName:'外币币种',systemFieldNum: 'foreignCurrency',customerFieldName:'',fieldType: 'TEXT'},
  {systemFieldName:'单价',systemFieldNum: 'unitPrice',customerFieldName:'',fieldType: 'MONEY'},
  {systemFieldName:'汇率',systemFieldNum: 'mdF',customerFieldName:'',fieldType: 'MONEY'},
  {systemFieldName:'原币借方金额',systemFieldNum: 'nfratMd',customerFieldName:'',fieldType: 'MONEY'},
  {systemFieldName:'原币贷方金额',systemFieldNum: 'nfratMc',customerFieldName:'',fieldType: 'MONEY'},
 /* {systemFieldName:'外币金额',systemFieldNum: 'foreignAmount',customerFieldName:'',fieldType: 'MONEY'},*/
  //{systemFieldName:'贷方汇率',systemFieldNum: 'mcF',customerFieldName:'',fieldType: 'MONEY'},
]
enum Api {
  AccvoucherTemplateSaveApi = '/sys/accvoucher_template/save',
  AccvoucherTemplateNewSaveApi = '/sys/accvoucher_template/new/save',
  AccvoucherTemplateNewUpdateApi = '/sys/accvoucher_template/new/update',
  findAllAccvoucherTemplate = '/sys/accvoucher_template/new/findAll',
  AccvoucherTemplateNewDeleteApi = '/sys/accvoucher_template/new',
  findAllAccvoucherFieldsUrl = '/sys/accvoucher_template/new/field',
  findAllAccassFieldsUrl = '/sys/accvoucher_template/new/field_accass',
}

export function findAllAccvoucherTemplate() {
  return defHttp.request({
    url: Api.findAllAccvoucherTemplate,
    method: 'POST'
  })
}

export function AccvoucherTemplateSaveApi(params:any) {
  let flag = params.id == ''
  if (flag) params.id = null
  return defHttp.request({
    url: flag? Api.AccvoucherTemplateNewSaveApi:Api.AccvoucherTemplateNewUpdateApi,
    method: 'POST',
    params
  })
}

export function findAllAccassFieldsApi(params:any) {
  return defHttp.request({
    url:  Api.findAllAccassFieldsUrl,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findAllAccvoucherFieldsApi(params:any) {
  return defHttp.request({
    url:  Api.findAllAccvoucherFieldsUrl,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
 /* let map =  params.data
  let type =  params.type
  let list = []
    defaultList.forEach((item,index) =>{
      let titleName = ''
      if (null != map[item.systemFieldNum] && map[item.systemFieldNum] != ''){ // 存在替换
        titleName = map[item.systemFieldNum]
      }else {//默认
        titleName = item.systemFieldName
      }
      list.push(titleName)
    })
   if(map.templateType === '1'){ //标准
     standard.forEach((item,index)=>{
       let titleName = ''
       if (null != map[item.systemFieldNum] && map[item.systemFieldNum] != ''){ // 存在替换
         titleName = map[item.systemFieldNum]
       }else {//默认
         titleName = item.systemFieldName
         if (type == '1' &&  item.systemFieldName.lastIndexOf("编码") != -1){ // 名称
           titleName =  titleName.replace('编码','名称')
         }
       }
       list.push(titleName)
    })
  }
  return list*/
}

export function voucherFieldsApi(params:any) {
  let map =  params
  let list = []
  defaultList.forEach((item,index) =>{
    list.push(item)
  })
  if(map.templateType === '1'){ //标准
    standard.forEach((item,index)=>{
      list.push(item)
    })
  }
  return list
}

export function accvoucherTemplateNewDeleteApi(params:any) {
  return defHttp.request({
    url:  Api.AccvoucherTemplateNewDeleteApi,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
