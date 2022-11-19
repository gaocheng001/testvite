  <template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrt-one">
        <img src="/img/nc/15.png" draggable="false"/>
      </div>
      <div class="nc-hrt-two">
        <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
      </div >
      <div class="nc-hrt-three">
<!--        <span>业务日期：</span>
        <a-date-picker  v-model:value="props.modelValue.loginDate" value-format="YYYY-MM-DD" format="YYYY-MM-DD"/>-->
      </div >
    </div>
    <div class="nc-hr-middle">
      <div class="nc-hrm-head">
        <span class="nc-hrmh-span">当前应用</span>
        <div style="float: right; margin-right: 20px">
          <a-button>
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </a-button>
          <a-popover placement="bottom">
            <template #content>

            </template>
            <a-button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </a-button>
          </a-popover>
          <a-popover placement="bottom">
            <template #content>

            </template>
            <a-button>
              <PicLeftOutlined :style="{ fontSize: '14px' }"/>
            </a-button>
          </a-popover>
        </div>
        <div style="float: right; position: relative;margin-right: 10px">
          <a-input-search
            placeholder=""
            style="width: 200px; border-radius: 4px"
            @search="onSearch"
          />
        </div>
      </div>
      <div class="nc-hrm-body" :style="{maxHeight: windowHeight+'px'}">
        <a-row type="flex">
          <a-col :span="8" v-for="(item,index) in platforms"  @click="platforms.platformId==0?null:layoutsStore.switchPlatform({ id: item.platformId })">
            <div>
              <div :style="{'background-color':colorlists[Math.floor(Math.random()*10)]}">
                <img v-bind:src="imgValue(index)">
              </div>
            </div>
            <div>
              <span>{{item.title}}</span><span>财税达软件</span><br/>
              <span>{{item.legend}}</span>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {SyncOutlined, SettingFilled, PicLeftOutlined} from '@ant-design/icons-vue';
import {Input as AInput ,Select as ASelect,Popover as APopover,Button as AButton,
  Row as ARow,DatePicker as ADatePicker,
  Col as ACol,Steps} from "ant-design-vue";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {ref} from "vue";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
const Step = Steps.Step
const AInputSearch  = AInput.Search
const ASelectOption = ASelect.Option
const props=defineProps(['modelValue'])
const layoutsStore = usePlatformsStoreWidthOut();
const windowHeight = (window.innerHeight - (280))
const colorlists = [
  'rgb(229, 0, 19)',
  'rgb(206,194,28)',
  'rgb(0,161,233)',
  'rgb(109,185,45)',
  'rgb(166,0,130)',
  'rgb(237,108,0)',
  'rgb(240, 28, 131)',
  'rgb(84, 21, 226)',
  'rgb( 0,128,0)',
  'rgb( 255,69,0)',
  'rgb( 255,165,0)',
  'rgb( 178,34,34)',
  'rgb( 255,0,255)',
  'rgb(65,105,225)',
  'blueviolet'
]
let platforms = ref([
  {
    title: '总账',
    legend: '凭证处理与账表查询',
    platformId: 1001,
  },
  {
    title: '现金银行',
    legend: '现金银行、承兑汇票与银行对账',
    platformId: 1006,
  },{
    title: '开发票',
    legend: '发票申请与自动开票',
    platformId: 1001,
  },{
    title: '发票验真',
    legend: '图片识别与发票真伪验',
    platformId: 1001,
  },{
    title: '资金认领',
    legend: '业务人员确认收入来源',
    platformId: 1001,
  },{
    title: '费用报销',
    legend: '在线网上报销系统，费控审批',
    platformId: 1001,
  },{
    title: '固定资产',
    legend: '固定资产数据管理，计提折旧',
    platformId: 20001,
  },{
    title: '无形资产',
    legend: '',
    platformId: 1001,
  },
  {
    title: '电子票据',
    legend: '',
    platformId: 1001,
  },
  {
    title: '薪酬管理',
    legend: '',
    platformId: 1001,
  }, {
    title: '客户',
    legend: '',
    platformId: 20007,
  },{
    title: '应收款',
    legend: '',
    platformId: 1001,
  },{
    title: '供应商',
    legend: '',
    platformId: 20007,
  },{
    title: '应付款',
    legend: '',
    platformId: 0,
  },{
    title: '基础档案主数据',
    legend: '',
    platformId: 0,
  },
])
const imgValue = (index) => {
  return  '/nc/img/nc/'+(index>8?(''+(index+1)):('0'+(index+1)))+ '.png';
}
const dynamicAdReload = (e) => {
  useAccountPickerCache().set(e)
}
let copyList =[]
const onSearch = (value) => {
  if (copyList.length == 0)
    copyList = platforms.value
  if (null == value || ''==value){
    platforms.value = copyList
  }else {
    platforms.value =  copyList.filter(item=>(item.title.indexOf(value) != -1 || item.legend.indexOf(value) != -1))
  }
}
</script>
<style lang="less" scoped>
.nc-hr{
  .nc-hr-top{
    font-weight: bold;
    color: #545454;
    height: 80px;
    width: 100%;
    background-color: #f1f1f1;
    display: inline-flex;
    justify-content: space-between;
    .nc-hrt-one{
      padding: 1%;
      width: 5%;
    }
    .nc-hrt-two{
      padding: 1.6% 0% 0;
      width: 55%;
      text-align: left;
      > div{
        width: 100%;
        :deep(.ant-input-affix-wrapper){
          border: 1px solid #d2cfcf;
        }
      }
    }
    .nc-hrt-three{
      padding: 1.6% 3% 0;
      width: 40%;
      text-align: right;
      :deep(.ant-calendar-picker){
        //border-radius: 5px;
        width: 120px;
        .ant-calendar-picker-input{
          border: 1px solid #d2cfcf;
          border-radius: 5px;
        }
      }
    }
  }
  .nc-hr-middle{
    min-height: 500px;
    background-color: #f1f1f1;
    padding: 5px;
    .nc-hrm-head{
      height: 40px;
      line-height: 40px;
      .nc-hrmh-span{
        font-size: 20px;
        color: #5f375c;
        margin-left: 1em;
      }
      .ant-btn{
        margin: 0 1px;
        border-color: #d2cfcf;
      }
      .ant-btn:hover{
        background-color: #0096c7;
        color: white;
      }
      .ant-input-search{
        border: 1px solid #d2cfcf;
      }
    }
    .nc-hrm-body{
      overflow-y: auto;
      :deep(.ant-row) {
        .ant-col {
          flex: 0 0 32%;
          max-width: 32%;
          height: 80px;
          background-color: white;
          margin: .5%;
          border-radius: 4px;
          border: 1px solid #807f7f;
          div {
            height: 100%;
            display: inline-block;
          }

          div:nth-of-type(1) {
            width: 80px;
            padding: 6px;
            >div{
              width: 65px;
              height: 65px;
              padding: 5px;
              .container-head-img {
                width: 56px;
                height: 52px;
                -webkit-user-drag: none;
              }
            }

          }

          div:nth-of-type(2) {
            width: calc(100% - 80px);
            color: #545454;
            font-weight: bold;
            float: right;
            font-size: 16px;
            .span-blue {
              color: blue;
            }
            span:nth-of-type(1){
              margin: 1% 2%;
              font-size: 18px;
              color: #2b4bcb;
              padding: 5px;
              display: inline-block;
            }
            span:nth-of-type(2){
              color: #5f375c;
              margin: 2%;
              display: inline-block;
              float: right;
              text-align: center;
              width: 90px;
              border: 1px solid #00a1e9;
              border-radius: 15px;
            }
            span:nth-of-type(3){
              margin-left: 3%;
              color: #8c8c8c;
            }
          }
        }
        .ant-col:hover{
          cursor: pointer;
          border: 2px solid #5f375c;
        }
      }
    }

  }
}
</style>
