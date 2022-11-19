<template>

  <div style="z-index: 1000000000;">
    <OpenButtonBar ref='openButtonBarRef' @click='openOptionPage'></OpenButtonBar>
  </div>

  <div v-show="showPromissSiteBar" style="min-width: 228px;width:228px;height:100%">
    <SideBar
      @changeApp="changeApp"
      @changeNcDashBoard="changeNcDashBoard"
      @close="showOpenButton"
    ></SideBar>

  </div>
  <div
    style="position:fixed;height:30px;width:100%;background:#8da6c7;font-weight:900;color:white;bottom:0;z-index:100;"
    class="thisBottom">
    <div style="display: flex;font-size:17px;position:relative">
      <div style="position: absolute;left: calc((100% - 184px) / 2);">
        <div style="width:184px;margin:0 auto;padding-top:2px">
          <span style="font-size: 14px;">业务日期：</span>
          <DatePicker size="small" :value="loginDate" @change="dateChange" :showToday="false" @focus="changeOpenStatus" @blur="changeOpenStatus" :open="showOpen"
                      style="padding:0;width:100px;text-align-last: center;" value-format="YYYY-MM-DD"
                      format="YYYY-MM-DD">
            <template #renderExtraFooter>
             <div style="display: inline-flex;justify-content: space-between;width: 100%;">
               <Button type="primary" size="small" @click="btnCheck('1')">今天</Button>
               <Button type="primary" size="small" @click="btnCheck('2')">昨天</Button>
               <Button type="primary" size="small" @click="btnCheck('3')">上月</Button>
               <Button type="primary" size="small" @click="btnCheck('4')">本月</Button>
               <Button type="primary" size="small" @click="btnCheck('5')">下月</Button>
             </div>
            </template>
          </DatePicker>
        </div>
      </div>
      <!--        <div style="width:100%;font-size: 14px;padding-top:3px;padding-left:5px;color:#c2ccdc">湖北万亚软件技术有限公司</div>-->
      <div style="width:100%;font-size: 14px;padding-top:3px;padding-left:5px;color:#c2ccdc;">
        &emsp;&emsp;
        <Badge :count="4" :number-style="{ backgroundColor: '#52c41a' }">
           <span class="hoverSvg">
              <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <title>icon/announcement</title>
              <desc>Created with Sketch.</desc>
              <g id="icon/announcement" stroke="none" stroke-width="1" fill="none"
                 fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M4.5,7.5 C3.396,7.5 2.5,8.396 2.5,9.5 C2.5,10.604 3.396,11.5 4.5,11.5 L4.5,7.5 Z M10.5,12.5 C15.5,12.5 20.5,15.5 20.5,15.5 L20.5,3.5 C20.5,3.5 15.5,6.5 10.5,6.5 L10.5,12.5 Z M10.5,6.5 L5.5,6.5 C4.948,6.5 4.5,6.948 4.5,7.5 L4.5,11.5 C4.5,12.052 4.948,12.5 5.5,12.5 L10.5,12.5 L10.5,6.5 Z M10.5,18.5 L8.5,18.5 L6.5,12.5 L10.5,12.5 L10.5,18.5 Z"
                  stroke-width="2" id="lineart" stroke="white"></path>
              </g>
            </svg>
           </span>

        </Badge>&emsp;&emsp;
        <MessagePop @throwData="modalData" @register="registerModalPopPage" />
        <Badge :count="4" :number-style="{ backgroundColor: '#52c41a' }">
<span class="hoverSvg" @click="goMessage()">
           <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>icon/text-message</title>
    <desc>Created with Sketch.</desc>
    <g id="icon/text-message" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
       stroke-linecap="round" stroke-linejoin="round">
        <path
          d="M17.5,10.5 L17.5,4.5 C17.5,3.948 17.052,3.5 16.5,3.5 L3.5,3.5 C2.948,3.5 2.5,3.948 2.5,4.5 L2.5,14.5 C2.5,15.052 2.948,15.5 3.5,15.5 L4.5,15.5 L4.5,17.5 L7.5,15.5 L10.5,15.5 M20.5,11.5 L20.5,17.5 C20.5,18.052 20.052,18.5 19.5,18.5 L18.5,18.5 L18.5,20.5 L15.5,18.5 L11.5,18.5 C10.948,18.5 10.5,18.052 10.5,17.5 L10.5,11.5 C10.5,10.948 10.948,10.5 11.5,10.5 L19.5,10.5 C20.052,10.5 20.5,10.948 20.5,11.5 Z"
          id="lineart" stroke-width="2" stroke="white"></path>
    </g>
</svg>

</span>
          <!--            <MessageOutlined style="font-size: 1em"/>-->
        </Badge>
      </div>

      <!--        <div style="min-width:57px;padding-top:1px;text-align:center;color:white;font-size:14px;background:black">财务版</div>-->
      <div style="min-width:15px;padding-top:1px"></div>


      <!--        <div style="min-width:38px;padding-top:1px"><SoundOutlined/></div>-->
      <!--        <div style="min-width:38px;padding-top:1px"><SearchOutlined/></div>-->
      <!--        <div  style="min-width:38px;padding-top:1px"  @click="goTask()">-->
      <!--          <Badge :count="2" :number-style="{ backgroundColor: '#52c41a' }">-->


      <!--&lt;!&ndash;            <HistoryOutlined style="font-size: 1em" />&ndash;&gt;-->
      <!--          </Badge>-->
      <!--        </div>-->


<!--      <div style="min-width:48px;padding-top:4px">
          <span class="hoverSvg" style="color:red">
                    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      &lt;!&ndash; Generator: Sketch 52.5 (67469) - http://www.bohemiancoding.com/sketch &ndash;&gt;
                      <title>icon/help</title>
                      <desc>Created with Sketch.</desc>
                      <g id="icon/help" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
                         stroke-linecap="round" stroke-linejoin="round">
                        <path
                          d="M11.5,14.5 C11.224,14.5 11,14.724 11,15 C11,15.276 11.224,15.5 11.5,15.5 C11.776,15.5 12,15.276 12,15 C12,14.724 11.776,14.5 11.5,14.5 Z M11.5,12.7 L11.5,12.181 C11.5,11.826 11.735,11.518 12.075,11.416 C12.899,11.169 13.5,10.405 13.5,9.5 C13.5,8.419 12.581,7.5 11.5,7.5 C10.396,7.5 9.5,8.396 9.5,9.5 M20.5,11.5 C20.5,16.471 16.471,20.5 11.5,20.5 C6.529,20.5 2.5,16.471 2.5,11.5 C2.5,6.529 6.529,2.5 11.5,2.5 C16.471,2.5 20.5,6.529 20.5,11.5 Z"
                          id="lineart" stroke="#1a7575" stroke-width="2"></path>
                      </g>
                    </svg>
          </span>
      </div>-->
      <!--        <CustomizeInfo style="min-width:90px;" />-->
      <span class="hoverSvg" style="min-width:100px;padding-top:4px;position: relative;" @click="outSystemBefore">
        <LogoutOutlined  style="font-size: 18px"/>
        <span style="font-size: 12px;position: absolute;left: 30px;top: 7px;">退出系统</span>
      </span>
    </div>
  </div>
</template>
<script setup>
import {computed, provide, ref} from 'vue';
import {usePlatformsStoreWidthOut} from '/@/store/modules/platforms';
// import {layoutsStore} from '../../../store/modules/layouts';
import {LogoutOutlined} from '@ant-design/icons-vue';
import SideBar from './sitebar/index.vue'
import MessagePop from './sitebar/messagePop.vue'
import OpenButtonBar from './sitebar/openbutton.vue'
import router from "/@/router";
import {useMessage} from "/@/hooks/web/useMessage";
import {Badge, Button, DatePicker} from 'ant-design-vue';
import {useUserStore} from "/@/store/modules/user";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useModal} from "../../../components/Modal";
import dayjs from 'dayjs';
import {
  useAccountPickerCache
} from "../../../store/modules/boozsoft/components/AccountPicker/cache";

const layoutsStore = usePlatformsStoreWidthOut()


const loginDate = ref(useCompanyOperateStoreWidthOut().getLoginDate)
const {getShowPromissSiteBar, changeApp, changeNcDashBoard} = layoutsStore
const showOption = ref(false)
const showOpen = ref(false)

const dateChange = async (v) => {
  showOpen.value = false
  await useCompanyOperateStoreWidthOut().commitLoginDate(v)
  loginDate.value = useCompanyOperateStoreWidthOut().getLoginDate
}
const btnCheck = (type) => {
  let theD = loginDate.value
  switch (type) {
    case '1':
      theD = dayjs().format('YYYY-MM-DD')
      break
    case '2':
      theD = dayjs().add(-1, 'day').format('YYYY-MM-DD')
      break
    case '3':
      theD = dayjs().add(-1, 'month').format('YYYY-MM-DD')
      break
    case '4':
      theD = dayjs().format('YYYY-MM-DD')
      break
    case '5':
      theD = dayjs().add(1, 'month').format('YYYY-MM-DD')
      break
  }
  dateChange(theD)
}

const changeOpenStatus = () => {
  showOpen.value = !showOpen.value
}

const showPromissSiteBar = computed(() => layoutsStore.getShowPromissSiteBar)
const openButtonBarRef = ref(null)
provide('showOption', showOption)


function showOpenButton() {
  showOption.value = false
  layoutsStore.commitShowPromissSiteBar(false)
}

provide('SystemOption',{
  showOpenButton
})

function openOptionPage(){
  showOption.value=true
  layoutsStore.commitShowPromissSiteBar(true)
}
const goMessage = () => {
  //router.push('/zhongZhang/cashiers/ab-xjll/message-list');
 // router.push('/system/institution-management/im-group')
  //弹窗
  openMoalPopPage(true, {
  });

}
const goTask = () => {
  //router.push('/zhongZhang/cashiers/ab-xjll/task-list');
  router.push('/system/institution-management/im-group')
  //router.push('/one/one/unit-info')

}
const {createConfirm} = useMessage();
let mark = false;
const outSystemBefore = () => {
  if (mark) return false
  mark = true
  createConfirm({
    iconType: 'info',
    title: '退出登录',
    content: '您确定要退出登录吗?退出后将前往登录页面！',
    onOk: async() => {
      mark = false
      useUserStore().logout(true)
      // 清理当前用户操作产生的账套缓存
      useAccountPickerCache().closeAllAccountPickerInfo()
      // 清理 已储存账套列表
      const companyOperateStore = useCompanyOperateStoreWidthOut()
      companyOperateStore.commitAuthorizeList(null);
      companyOperateStore.commitAccountList(null)
      companyOperateStore.commitAssetsAccountList(null);
      companyOperateStore.commitStockAccountList(null)
      companyOperateStore.commitAllAuthorizeAccountList(null);
    }
  });
}

const [registerModalPopPage, { openModal: openMoalPopPage }] = useModal();

const modalShow = () => {
  openMoalPopPage(true, {
    database: dynamicTenantId.value,
  });
}

// 弹选回调
const modalData = async (data) => {
  console.log(data)
}

</script>
<style lang="less" scoped>
// 人为干预 徽标数 大小
:deep(.ant-badge){
  .ant-badge-count{
    height: 10px;
    top: -3px;
    min-width: 10px;
    line-height: 10px;
  }
}
.hoverSvg{
  cursor:pointer;
}
.hoverSvg:hover path{
  stroke:#1a7575 !important;
}
</style>
