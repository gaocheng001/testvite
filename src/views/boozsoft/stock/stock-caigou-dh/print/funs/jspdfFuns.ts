export function createPrintParams({width,height}){
  if( width > height){
    return ['l', 'mm',[width, height], false]
  }else{
    return ['p', 'mm',[width, height], false]
  }
}
