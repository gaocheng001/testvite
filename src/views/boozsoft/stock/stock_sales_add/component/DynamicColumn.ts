export function assemblyDynamicColumn(lanmuList:any,columnList:any){
  columnList.forEach(cObj=>{
    if (cObj != null){
      lanmuList.forEach((lObj,index)=>{
        if (cObj.title === lObj.name){
          cObj.title = thisName(index+'',lanmuList)
          cObj.width = thisWidth(index+'',lanmuList)
          cObj.align = thisAlign(index+'',lanmuList)
          cObj.ifShow = thisIsShow(index+'',lanmuList)
          cObj.pkey = thisSort(index+'',lanmuList)
        }
      })
    }
  })
  return columnList.sort((a,b)=>a.pkey - b.pkey);
}
export function filterModifyData(lanMuList: any, copyList) {
  let a = lanMuList.filter(item => {
    try {
      copyList.forEach(item2 => {
        if (item != null && item2 != null && item?.key === item2.key && item?.name == item2?.name) {
          if (item?.nameNew != item2?.nameNew || item?.width != item2?.width || item?.check != item2?.check || item?.align != item2?.align || (null != item?.pkey && item?.pkey != item2?.pkey))
            throw new Error('ok')
        }
      })
      return false
    } catch (e) {
      // @ts-ignore
      if (e?.message != 'ok') {
        return false
      } else {
        return true
      }
    }
  })
  return a;
}

export function combineParameters(staticList: any, dbList: any) {
  let sorts = []
  staticList.forEach(item => {
    dbList.forEach(item2 => {
      if (item.key === item2.key && item.name === item2.name) {
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
        // 存在序号 按照序号
        if (item2.pkey != null && item2.pkey != '' && !isNaN(item2.pkey))sorts.push(item2)
      }
    })
  })
  if (sorts.length > 0){
    sorts.forEach(item => {
      let $index = staticList.findIndex(it=>it?.key == item?.key && item?.name === it?.name)
      staticList = swapItems(staticList, $index, parseInt(item.pkey))
    })
  }
  return staticList.filter(it=>null != it)
}
/*********************** 静态方法 ***********************/
// 动态名称
const thisName = (index,thisData)=>{
  let value = ''
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].nameNew
      if ('' == value)value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].name
    }else{
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].nameNew
      if ('' == value)value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].name
    }
  }else{
    value = thisData[index].nameNew
    if ('' == value)value = thisData[index].name
  }
  return value
}
// 当前宽度
const thisWidth = (index,thisData)=>{
  let value = 0
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].width
    }else{
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].width
    }
  }else{
    value = thisData[index].width
  }
  return  parseInt(value)
}
// 是否显示
const thisIsShow = (index,thisData)=>{
  let value = false
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].check
    }else{
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].check
    }
  }else{
    value = thisData[index].check
  }
  return  value
}
// 对齐方式
const thisAlign = (index,thisData)=>{
  let value = 'center';
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].align
    }else{
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].align
    }
  }else{
    value = thisData[index].align
  }
  return  value
}
// 排序标识
const thisSort = (index,thisData)=>{
  let value = null;
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].pkey
    }else{
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].pkey
    }
  }else{
    value = thisData[index].pkey
  }
  return  value
}

/**
 *
 * @param arr 原
 * @param index1 原来位置
 * @param index2 现在位置
 */
export const swapItems = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  arr.forEach((v,i)=> {
    if(null != v)v['pkey'] = (i)
  }) // 整理后台序号
  return arr;
};
