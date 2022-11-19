export function saveItem(list,body){
  if(body.id=='' || body.id=='0' || body.id==0){
    throw new Error('无效id类型')
  }
  if (body.id!=undefined){
    list.forEach(
      function (item, index){
        if (body.id==item.id){
          list[index]=body
        }
      }
    )
  } else {
    if (list.length>0) {
      // const id=createSnaflke()
      const maxId = Math.max(...list.map(item => parseInt(item.id)))
      body.id = maxId + 1
    } else {
      body.id = 1
    }
    list.push(body)
  }
  console.log(body)
  return body
}
