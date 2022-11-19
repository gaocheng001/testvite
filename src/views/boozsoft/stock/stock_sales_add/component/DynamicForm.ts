import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findStockColumnList} from "/@/api/record/stock/stock-caigou";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {DateTool} from "/@/api/task-api/tools/universal-tools";

const defaultRows = () => {
  return [
    {
      columnType: '1',
      field: 'ccode',
      label: '单据编号',
      component: 'Input',
      componentProps: null,
      required: true,
      readonly: true,
      serial: 1,
      isShow: true
    }, {
      columnType: '1',
      field: 'ddate',
      label: '单据日期',
      component: 'DatePicker',
      componentProps: null,
      required: true,
      readonly: true,
      serial: 2,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cvencode',
      label: '销售客户',
      component: 'Select',
      componentProps: 'cust',
      required: true,
      readonly: true,
      serial: 3,
      isShow: true
    },,
    {
      columnType: '1',
      field: 'cvencodeJs',
      label: '结算客户',
      component: 'Select',
      componentProps: 'cust',
      required: true,
      readonly: true,
      serial: 4,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cwhcode',
      label: '仓库',
      component: 'Select',
      componentProps: 'warehouse',
      required: true,
      readonly: true,
      serial: 5,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cdepcode',
      label: '业务部门',
      component: 'Select',
      componentProps: 'dept',
      required: false,
      readonly: false,
      serial: 6,
      isShow: false
    },
    {
      columnType: '1',
      field: 'cpersoncode',
      label: '业务员',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: false,
      serial: 7,
      isShow: true
    },{
      columnType: '1',
      field: 'invoiceStyle',
      label: '票据类型',
      component: 'Select',
      componentProps: 'invoice',
      required: true,
      readonly: true,
      serial: 8,
      isShow: true
    },
    {
      columnType: '1',
      field: 'xsRate',
      label: '销售税率',
      component: 'InputNumber',
      componentProps: null,
      required: true,
      readonly: true,
      serial: 9,
      isShow: true
    },{
      columnType: '1',
      field: 'sgspperson',
      label: '质检员',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: false,
      serial: 10,
      isShow: false
    },{
      columnType: '1',
      field: 'deliveryUser',
      label: '送货人',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: false,
      serial: 11,
      isShow: true
    },{
      columnType: '1',
      field: 'methodPay',
      label: '收款方式',
      component: 'Select',
      componentProps: 'method',
      required: false,
      readonly: false,
      serial: 12,
      isShow: true
    },{
      columnType: '1',
      field: 'payDate',
      label: '协议收款日期',
      component: 'DatePicker',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 13,
      isShow: true
    },{
      columnType: '1',
      field: 'theDeposit',
      label: '定金',
      component: 'InputNumber',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 14,
      isShow: true
    },{
      columnType: '1',
      field: 'cmemo',
      label: '备注',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 15,
      isShow: true
    }
  ]
}
export const lanMuData = {
  'menuName': '销货单表头栏目',
  objects: '',
}

export async function GenerateDynamicColumn(schemaName,title,defaultList) {
  // 默认使用销货单架子 可自定义
  if (null != title)lanMuData.menuName = title+'表头栏目'
  let list = defaultList || defaultRows()
  let res = await useRouteApi(findStockColumnList, {schemaName: schemaName})(lanMuData)
  if (res.length != 0) { // 新账套
    let arr1 = res.filter(it => it.columnType == '1')
    if (arr1.length > 0) { // 修改默认
      list = list.map(it1 => {
        let vrr = arr1.filter(it => it.field == it1.field)
        if (vrr.length > 0) {
          it1['label'] = vrr[0]['label']
          it1['required'] = vrr[0]['required'] =='true'?true:false
          it1['isShow'] = vrr[0]['isShow'] == 'true'?true:false
          it1['serial'] = vrr[0]['serial']
        }
        return it1
      })
    }
    let arr2 = res.filter(it => it.columnType == '2').map(it=>{
      it['required'] = it['required'] =='true'?true:false
      it['isShow'] = it['isShow'] == 'true'?true:false
      return it
    })
    if (arr2.length > 0) list.push(...arr2)
    // 排序
    list.sort((a, b)=>a.serial - b.serial)
  }
  return list
}
export  function changeCust(v,custList,model) {
  let nextV = v
  let dept = ''
  let user = ''
  let method = ''
  let number = 0
  let e = custList.filter(it => it.id == v)[0]
  if (!hasBlank(e.uniqueCodeCcus)) nextV = e.uniqueCodeCcus
  dept = e.custDept || ''
  user = e.custPsn || ''
  user = e.custPsn || ''
  method = e.payType || 'QT'
  number = e.payNumber || 0
  model['cvencodeJs'] = nextV;
  model['cdepcode'] = dept;
  model['cpersoncode'] = user;
  model['methodPay'] = method;
  if ('' != method) {
    if (method == 'XQSK') {
      model['payDate'] = DateTool().offsetToStr(new Date(model['ddate']), (1000 * 60 * 60 * 24 * number))
    }
    if (method == 'YJ') {
      let a = DateTool().offsetToStr(new Date(model['ddate']), (1000 * 60 * 60 * 24 * 30 * number))
      model['payDate'] = a?.substring(0, 8) + '01'
    }
  }
  let priceLevel = custList.filter(it => it.id == nextV)[0]?.priceLevel
  model['cvencodeGrade'] = hasBlank(priceLevel) ? 'memberprice' : manualTypeConversionAttributes(priceLevel);
  return model
}

export const manualTypeConversionAttributes = (nameOrAttributes) => {
  let r = ''
  switch (nameOrAttributes) {
    case 'regularPrice':
    case '零售价':
      r = 'regularPrice'
      break;
    case 'minPrice':
    case '最低价':
      r = 'minPrice'
      break;
    case 'maxPrice':
    case '最高价':
      r = 'maxPrice'
      break;
    case 'invscost1':
    case '一级客户价':
      r = 'invscost1'
      break;
    case 'invscost2':
    case '二级客户价':
      r = 'invscost2'
      break;
    case 'invscost3':
    case '三级客户价':
      r = 'invscost3'
      break;
    case 'invscost4':
    case '四级客户价':
      r = 'invscost4'
      break;
    case 'invscost5':
    case '五级客户价':
      r = 'invscost5'
      break;
    case 'invscost6':
    case '六级客户价':
      r = 'invscost6'
      break;
    case 'invscost7':
    case '七级客户价':
      r = 'invscost7'
      break;
    case 'invscost8':
    case '八级客户价':
      r = 'invscost8'
      break;
    default:
      r = 'memberprice'
      break
  }
  return r
}
