import {toHump} from "../../mock/_utils/_humpAndLine";
export const accvoucher_total=[].map(item=>{
    let a={}
  Object.keys(item).forEach(key=>{
    a[toHump(key)]=item[key]
  })
  return a
})
