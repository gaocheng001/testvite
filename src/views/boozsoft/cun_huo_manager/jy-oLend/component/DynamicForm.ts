import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findStockColumnList} from "/@/api/record/stock/stock-caigou";

const defaultRows = () => {
  return [
    {
      columnType: '1',
      field: 'ccode',
      label: '入库单号',
      component: 'Input',
      componentProps: null,
      required: true,
      readonly: true,
      serial: 1,
      isShow: true
    }, {
      columnType: '1',
      field: 'ddate',
      label: '入库日期',
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
      field: 'cwhcode',
      label: '仓库',
      component: 'Select',
      componentProps: 'warehouse',
      required: false,
      readonly: false,
      serial: 4,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cdepcode',
      label: '部门',
      component: 'Select',
      componentProps: 'dept',
      required: false,
      readonly: false,
      serial: 5,
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
      serial: 6,
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
      serial: 7,
      isShow: true
    }, {
      columnType: '1',
      field: 'ipertaxrate',
      label: '税率',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 10,
      isShow: true
    }, {
      columnType: '1',
      field: 'transportation',
      label: '运输方式',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 10,
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
      serial: 8,
      isShow: true
    }, {
      columnType: '1',
      field: 'cvencodeAddr',
      label: '供应商地址',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 9,
      isShow: false
    }, {
      columnType: '1',
      field: 'cvencodePhone',
      label: '供应商电话',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 9,
      isShow: false
    }, {
      columnType: '1',
      field: 'cvencodeContact',
      label: '联系人',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 10,
      isShow: false
    }
  ]
}
export const lanMuData = {
  'menuName': '采购到货单',
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
