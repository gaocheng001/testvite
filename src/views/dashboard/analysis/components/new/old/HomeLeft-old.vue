<template>
  <div>
    <div class="nc-hl-top" v-if="usePlatformsStore().getCurrentPlatformId === 1001 || usePlatformsStore().getCurrentPlatformId === 20006">
      <span> 公司代码：</span>
      <a-input
        placeholder=""
        v-model:value="pageParameter.thisCodeValue"
        @keyup.enter="pageSearch2"
        @focus="dynamicallyMonitorChanges('close')"
        @blur="dynamicallyMonitorChanges('set')"
        style="width: 80px;border-radius: 4px;border-color:#000;">
        <template #suffix>
          <SearchOutlined @click="openSelection"/>
        </template>
      </a-input>
      <AccountInfo
        @modify="closeModify"
        @register="registerInfo"
      />
    </div>
    <div class="nc-hl-bottom" :style="usePlatformsStore().getCurrentPlatformId !== 1001?{marginTop: '15%',height: '100%'}:''">
      <span>&ensp;🐵&ensp;操作员信息</span>
      <div>
        <ul>
          <li>部门</li>
          <li class="increase-bold">财务部</li>
          <li>岗位</li>
          <li class="increase-bold">主管会计</li>
          <li>业务日期</li>
          <li class="increase-bold">{{props.modelValue.loginDate || '2021-01-01'}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {usePlatformsStore} from "/@/store/modules/platforms";
import {SearchOutlined} from '@ant-design/icons-vue';
import AccountInfo from "/@/views/boozsoft/global/popup/AccountInfo.vue";
import {message, Input as AInput} from "ant-design-vue";
import {reactive, onMounted, unref} from "vue";
import {useModal} from "/@/components/Modal";
const props=defineProps(['modelValue'])
const pageParameter = reactive({
  thisCodeValue: '',
  defaultCodeValue: '',
  dynamicManipulateDbName: '',
  tempCodeValue: ''
})
onMounted(async ()=> usePlatformsStore().getCurrentPlatformId === 1001?await pageInit():null)
const pageInit = async () => {
  return new Promise((resolve)=>{
    let i=0
    const inte=setInterval(()=>{
      i++
      let adInfoObj = props.modelValue.thisAdInfo
      if (Object.keys(adInfoObj).length !== 0){
        pageParameter.defaultCodeValue = adInfoObj.coCode
        pageParameter.thisCodeValue = adInfoObj.coCode
        pageParameter.tempCodeValue = adInfoObj.coCode
        pageParameter.dynamicManipulateDbName = adInfoObj.accId + '-'+props.modelValue.loginDate.substring(0,4)
        resolve(true)
        window.clearInterval(inte)
      }else if(i==20){
        resolve(false)
        window.clearInterval(inte)
      }
    })
  },200)
}

const dynamicallyMonitorChanges = (type)=>{
  if (type == 'set'){
    if ((pageParameter.thisCodeValue == '' || pageParameter.thisCodeValue != '' ) && false){
      pageParameter.thisCodeValue =pageParameter.defaultCodeValue
    }else if (pageParameter.defaultCodeValue != '' && pageParameter.thisCodeValue == ''){
      pageParameter.thisCodeValue =pageParameter.tempCodeValue
    }
  }else {
    pageParameter.tempCodeValue = pageParameter.thisCodeValue
    pageParameter.thisCodeValue = ''
  }
}

const [registerInfo, { openModal: openInfoPageM }] = useModal()

const openSelection = () => {
  openInfoPageM(true, {
    data: {accAuthList: props.modelValue.authorizedAdList}
  })
}

const closeModify = (code)=>{
  if (pageParameter.thisCodeValue != code) {
    pageParameter.thisCodeValue = code
    pageSearch2()
  }
}

const pageSearch2 = () => {
  if (pageParameter.thisCodeValue == pageParameter.tempCodeValue) return false
  let accObj = props.modelValue.authorizedAdList.filter(item=>item.coCode == pageParameter.thisCodeValue)
  if (accObj.length == 0){
    message.warn('代码不存在停止切换！')
    pageParameter.thisCodeValue = pageParameter.tempCodeValue
  }else if(accObj.length > 0){
    let iyear = props.modelValue.loginDate.substring(0,4)
    let authObj = props.modelValue.authorizedInfoList.filter(item=>accObj[0].accId == item.accId && item.iyear == iyear)
    if (authObj.length == 0){
      message.warn('无该代码'+iyear+'年度数据权限！')
      pageParameter.thisCodeValue = pageParameter.defaultCodeValue
    }else {
      pageParameter.dynamicManipulateDbName = accObj[0].accId+'-'+iyear
      // pageParameter.tempCodeValue = accObj[0].accNameCn
      props.modelValue.thisAdInfo =  accObj[0]
      //刷新页面
      /*let data = {}
      data.accId=accObj[0].accId
      data.baseName=accObj[0].accNameCn
      data.year=iyear
      data.coCode=pageParameter.thisCodeValue
      emit('reloadTable',unref(data))*/
    }
  }
}
</script>
<style lang="less" scoped>
.nc-hl-top {
  height: 100px;
  padding: 10% 18%;
}

.nc-hl-bottom {
  height: cala(100% - 100px);
  span{
    margin: 2px 0;
    font-weight: bold;
    color: black;
  }
  div{
    text-align: center;
    ul{
      li{
        margin: 0 2px;
        padding: 10px 0;
        color: #545454;
        font-weight: bold;
        border-bottom: 2px solid #dedcdc;
      }
      li:nth-of-type(1){
        border-top: 2px solid #dedcdc;
      }
      .increase-bold{
        font-size: 16px;
        color: black;
      }
    }
  }
}
</style>
