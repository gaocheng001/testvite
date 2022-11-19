<template>
  <div>
    <div v-if="false"
         style="position:fixed;width:100%;background:green;padding:10px;height:100px;bottom:0;border:solid 1px black;z-index: 10000000000000">
      <button @click="closeThis()">关闭并不在显示</button>
      <button @click="showThis=false">关闭</button>
      1003
      <textarea v-text="TabList1003"></textarea>
      1001
      <textarea v-text="TabList1001"></textarea>
      default
      <textarea v-text="TabListDefalut"></textarea>
      <div>
        id1001
      <textarea v-text="id1001"></textarea>
        <button @click="ref1001set" >设置1003</button>


        id1003
        <textarea v-text="id1003"></textarea>
        <button @click="ref1003set" >设置1003</button>
      </div>

    </div>
    <div v-else>
      <div  @click="showThis=true"
           style="position:fixed;width:10px;background:green;padding:10px;height:10px;right:0;bottom:0;border:solid 1px black;z-index: 10000000000000">
        <button>打开</button>
      </div>
    </div>
  </div>
  <!--  <div v-show="showDevTool" class=" fixed w-2xl h-2xl bg-red-400 left-44 top-4" style="z-index: 200000000;">-->
  <!--      <div>mock转sql<input><button>确定</button></div>-->
  <!--      <div>菜单与角色菜单中间表同步到数据库</div>-->
  <!--      <div>关闭mock</div>-->
  <!--      <div>关闭模拟用户</div>-->
  <!--      <div>获取所有用户</div>-->
  <!--      <div>选择用户登陆</div>-->
  <!--  </div>-->
</template>
<script setup>
import {ref, computed,watch} from 'vue';
import {useMultipleTabStore} from "/@/store/modules/multipleTab";
import {usePlatformsStore} from "/@/store/modules/platforms";

const showThis = ref(window.localStorage.getItem("helloDev") == null ? true : false)

function ref1001set(){
ref1001.value.setId(5)
}
function ref1003set(){
ref1003.value.setId(5)

}
function closeThis() {
  window.localStorage.setItem("helloDev", "1")
  showThis.value = false
}
const ref1001=ref()
const ref1003=ref()
const id1003=ref({})
const id1001=ref({})

const TabList1003=ref([])
const TabList1001=ref([])
const TabListDefalut=ref([])
function startIdDebugger(){
  const storeList=computed(()=>window.platformData.storeList.value)
  console.log(storeList)
  function tw1001(){
    const platformId = "1001"
    const arr=storeList.value.filter(item => item.id == platformId)
    console.log(arr)
    if(arr.length>0){
      const store = arr[0].store
      const tabStore = useMultipleTabStore(store)
      ref1001.value=tabStore
      watch(tabStore.getId,(e)=>id1001.value=e,{immediate:true})
    }
  }
  function tw1003(){
    const platformId = "1003"
    const arr=storeList.value.filter(item => item.id == platformId)
    console.log(arr)
    if(arr.length>0){
      const store = arr[0].store
      const tabStore = useMultipleTabStore(store)
      ref1003.value=tabStore
      watch(tabStore.getId,(e)=>{
        console.log(e)
        id1003.value=e
      },{immediate:true})
    }
  }

  watch(window.platformData.storeList.value,()=>{
    tw1001()
    tw1003()
  },{immediate:true})

}
// startIdDebugger()
function startTabDebugger(){
  const storeList=computed(()=>window.platformData.storeList.value)
  console.log(storeList)
  function tw1001(){
    const platformId = "1001"
    const arr=storeList.value.filter(item => item.id == platformId)
    console.log(arr)
    if(arr.length>0){
      const store = arr[0].store
      const tabStore = useMultipleTabStore(store)
      watch(tabStore.getTabList,(e)=>TabList1001.value=e)
      window.t1001 = TabList1001
    }
  }
  function tw1003(){
    const platformId = "1003"
    const arr=storeList.value.filter(item => item.id == platformId)
    console.log(arr)
    if(arr.length>0){
      const store = arr[0].store
      const tabStore = useMultipleTabStore(store)
      watch(tabStore.getTabList,(e)=>TabList1003.value=e)
      window.t1003 = TabList1003
    }
  }
  function twDefault(){
      const tabStore = useMultipleTabStore()
      watch(tabStore.getTabList,(e)=>TabListDefalut.value=e)
      window.tDefault = TabListDefalut
  }

  watch(window.platformData.storeList.value,()=>{
    tw1001()
    tw1003()
    twDefault()
  },{immediate:true})

}
// startTabDebugger()

window.hello = function () {
  // showDevTool.value=true
}
// var funDownload = function (content, filename) {
//   // 创建隐藏的可下载链接
//   var eleLink = document.createElement('a');
//   eleLink.download = filename;
//   eleLink.style.display = 'none';
//   // 字符内容转变成blob地址
//   var blob = new Blob([content]);
//   eleLink.href = URL.createObjectURL(blob);
//   // 触发点击
//   document.body.appendChild(eleLink);
//   eleLink.click();
//   // 然后移除
//   document.body.removeChild(eleLink);
// };
// funDownload('adsad','a.sql')


</script>
