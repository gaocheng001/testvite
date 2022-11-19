import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
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
    },
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
      field: 'cwhcodeUser',
      label: '仓管员',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: false,
      serial: 8,
      isShow: true
    },
    {
      columnType: '1',
      field: 'sgspperson',
      label: '质检员',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: false,
      serial: 9,
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
      serial: 10,
      isShow: true
    },
  /*  {
      columnType: '1',
      field: 'xsRate',
      label: '销售税率',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: true,
      serial: 10,
      isShow: true
    },*/{
      columnType: '1',
      field: 'deliveryUser',
      label: '送货人',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: true,
      serial: 11,
      isShow: true
    }
  ]
}
export const lanMuData = {
  'menuName': '销售出库单表头栏目',
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
