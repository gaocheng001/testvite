
const R = {
  ok(obj) {
    return {
      status: 200,
      result: obj
    }
  },
  error(obj) {
    return {

      status: 500,
      result: obj
    }
  }
}

let interval=null
export function iframeLogin({ref,path},user){
   function sendMessage(ref,msg) {
    const childPath = path
    // const childPath = "http://www.gongzidev.com:3001/public/index.html"
    ref.contentWindow.postMessage(JSON.stringify(msg), childPath)
  }



  let i=0
  interval=setInterval(()=>{
    sendMessage(ref,R.ok(user))
    i+=1000
    console.log('等待登陆中...,耗时'+i+'ms')
  },1000)


  window.addEventListener('message', function ({origin,data}) {
    window.clearInterval(interval)
    console.log('数据',JSON.parse(data).result)
    console.log('地址',origin)
    // document.getElementById('message').innerHTML = "收到"
    //     + event.origin + "消息：" + event.data;
  }, false);

}
//
