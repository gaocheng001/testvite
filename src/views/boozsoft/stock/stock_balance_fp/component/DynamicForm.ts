// @ts-ignore
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
// @ts-ignore
import {findStockColumnList} from "/@/api/record/stock/stock-caigou";

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
      readonly: false,
      serial: 2,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cvencode',
      label: '供应商',
      component: 'Select',
      componentProps: 'supplier',
      required: true,
      readonly: true,
      serial: 3,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cvencodeJs',
      label: '结算供应商',
      component: 'Select',
      componentProps: 'supplier',
      required: true,
      readonly: true,
      serial: 4,
      isShow: true
    },
    {
      columnType: '1',
      field: 'invoiceStyle',
      label: '发票类型',
      component: 'Select',
      componentProps: null,
      required: true,
      readonly: true,
      serial: 5,
      isShow: true
    },
    {
      columnType: '1',
      field: 'billCode',
      label: '发票代码',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 6,
      isShow: true
    }
    ,
    {
      columnType: '1',
      field: 'billNumber',
      label: '发票号码',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 7,
      isShow: true
    },{
      columnType: '1',
      field: 'billDate',
      label: '发票日期',
      component: 'DatePicker',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 8,
      isShow: true
    },
    {
      columnType: '1',
      field: 'rate',
      label: '采购税率%',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 9,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cwhcode',
      label: '仓库',
      component: 'Select',
      componentProps: 'warehouse',
      required: false,
      readonly: false,
      serial: 10,
      isShow: false
    },
    {
      columnType: '1',
      field: 'cdepcode',
      label: '业务部门',
      component: 'Select',
      componentProps: 'dept',
      required: false,
      readonly: false,
      serial: 11,
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
      serial: 12,
      isShow: true
    },
   {
      columnType: '1',
      field: 'cvencodeAddr',
      label: '供应商地址',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 13,
      isShow: false
    }, {
      columnType: '1',
      field: 'cvencodePhone',
      label: '供应商电话',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 14,
      isShow: false
    }, {
      columnType: '1',
      field: 'cvencodeContact',
      label: '联系人',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 15,
      isShow: false
    },
    {
      columnType: '1',
      field: 'cmemo',
      label: '备注',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 16,
      isShow: true
    },
  ]
}
export const lanMuData = {
  'menuName': '采购发票表头栏目',
  objects: '',
}
export async function GenerateDynamicColumn(schemaName) {
  let list = defaultRows()
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
