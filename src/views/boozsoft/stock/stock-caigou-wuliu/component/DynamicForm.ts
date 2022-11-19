// @ts-ignore
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
// @ts-ignore
import {findStockColumnList} from "/@/api/record/stock/stock-caigou";

const defaultRows = () => {
  return [
    {
      columnType: '1',
      field: 'ccode',
      label: '送货单号',
      component: 'Input',
      componentProps: null,
      required: true,
      readonly: true,
      serial: 1,
      isShow: true
    }, {
      columnType: '1',
      field: 'ddate',
      label: '送货日期',
      component: 'DatePicker',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 2,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cvencode',
      label: '客户名称',
      component: 'Select',
      componentProps: 'cust',
      required: false,
      readonly: true,
      serial: 3,
      isShow: true
    },
    {
      columnType: '1',
      field: 'deliveryName',
      label: '送货人',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: false,
      serial: 4,
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
      serial: 5,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cpersoncode',
      label: '业务员',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: false,
      serial: 6,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cuserTel',
      label: '联系人&电话',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 7,
      isShow: true
    },
    {
      columnType: '1',
      field: 'caddress',
      label: '送货地址',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 8,
      isShow: true
    },
    {
      columnType: '1',
      field: 'wuliuSup',
      label: '物流公司',
      component: 'Select',
      componentProps: 'supplier',
      required: false,
      readonly: false,
      serial: 9,
      isShow: true
    },{
      columnType: '1',
      field: 'wuliuId',
      label: '物流单号',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 10,
      isShow: true
    },
    {
      columnType: '1',
      field: 'wuliuTel',
      label: '物流联系电话',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 11,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cmemo',
      label: '备注',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 12,
      isShow: true
    },
  ]
}
export const lanMuData = {
  'menuName': '销售送货物流单表头栏目',
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
