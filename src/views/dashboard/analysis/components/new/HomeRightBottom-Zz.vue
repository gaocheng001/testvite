<template>
  <div class="nc-hrb">
    <div class="nc-hrb-top">
<!--      <div style="margin-top: 10px;">
        显示样式
        <a-select v-model:value="panelFlag" @change="panelFlagChange" placeholder="" style="width: 130px;border-radius: 4px;text-align: left" default-value="1">
          <a-select-option key="1" value="1">系统方案</a-select-option>
          <a-select-option key="2" value="2">个人方案</a-select-option>
        </a-select>
      </div>-->
      <a-row type="flex">
        <a-col :span="4.5" v-for="item in accPanelList ">
          <div><img :src="imgtest"></div>
          <div>
            <span style="white-space:nowrap; text-overflow:ellipsis;overflow:hidden;display:block;margin-top: 10px;text-align: center;">{{item.panelName}}</span>
            <span v-if="item.money<0" style="color: red;float: right;font-size: 12px;">{{moneyformat(item.money)}}{{item.bzUnit}}&nbsp;&nbsp;</span>
            <span v-if="item.money>0" style="color: rgb(0,150,199);float: right;font-size: 12px;">{{moneyformat(item.money)}}{{item.bzUnit}}&nbsp;&nbsp;</span>
            <span v-if="item.money==0" style="color: rgb(0,150,199);float: right;font-size: 12px;">0元&nbsp;&nbsp;</span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="nc-hrb-middle">
      <a-row type="flex">
        <a-col :span="11">
          <div>
            <span>凭证</span>
            <MoreOutlined/>
            <br>
            <span>Financial Voucher</span>
          </div>
          <div>
            <ul>
              <li class="li-title">查看</li>
              <li @click="goRouter('/zhongZhang/vouchers/manage-voucher/list-voucher')">凭证列表</li>
              <li>序时账</li>
            </ul>
            <ul>
              <li class="li-title" @click="goRouter('/zhongZhang/vouchers/handle-voucher/tinazhi-voucher')">新增</li>
              <li>凭证</li>
              <li>现金流量</li>
              <li>发票</li>
            </ul>
            <ul>
              <li class="li-title">转账核销</li>
              <li>期间损益结转</li>
              <li>汇兑损益结转</li>
              <li>客户往来两清</li>
              <li>供应商往来两清</li>
            </ul>
          </div>
        </a-col>
        <a-col :span="11">
          <div>
            <span>账簿及报表</span>
            <MoreOutlined/>
              <br>
            <span>Report</span>&ensp;<span>Forms</span>
          </div>
          <div>
            <ul>
              <li class="li-title">常用账簿</li>
              <li @click="goRouter('/zhongZhang/account-book/ab-kemuzhang/abk-yetable')">科目余额表</li>
              <li @click="goRouter('/zhongZhang/vouchers/handle-voucher/tinazhi-voucher')">科目明细账</li>
              <li @click="goRouter('/zhongZhang/account-book/ab-kemuzhang/abk-mxtable')">科目总账</li>
              <li @click="goRouter('/zhongZhang/account-book/ab-kemuzhang/abk-rjtable')">科目日记账</li>
            </ul>
            <ul>
              <li class="li-title">收入成本核算</li>
              <li>收入趋势表</li>
              <li>主营成本变化分析</li>
              <li>财务费用</li>
            </ul>
            <ul>
              <li class="li-title">税务报表</li>
              <li>资产负债表</li>
              <li>利润表</li>
              <li>现金流量表</li>
            </ul>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import {MoreOutlined} from '@ant-design/icons-vue';
// import imgtest from '/@/assets/images/dashboard/wokb/performance.png'
const imgtest=''
import {
  Select as ASelect,
  Input as AInput,
  Row as ARow,
  Col as ACol
} from "ant-design-vue";
import HomeRightBottomTaskAndMsg from "/@/views/dashboard/analysis/components/new/HomeRightBottomTaskAndMsg.vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {onMounted, ref, inject, watch} from "vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {firstShowData} from "/@/api/record/accpanel/data";
import router from "/@/router";
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const accPanelList=ref([])


const panelFlag=inject('panelFlag')
const props = defineProps(['modelValue', 'pageAccId','accYear'])
onMounted( async ()=>{
  findAll()
})
async function findAll(){
  accPanelList.value=await useRouteApi(firstShowData,{schemaName:props.pageAccId})({iyear: props.accYear+'-'+useCompanyOperateStoreWidthOut().getLoginDate.split('-')[1],panelFlag:panelFlag.value,panelType:'zz'})
}
// 金额格式化
function moneyformat(data: any) {
  let str = ""
  if(data){
    // 千分位保留2位小数
    var source = String(data.toFixed(2)).split("."); //按小数点分成2部分
    source[0] = source[0].replace( new RegExp('(\\d)(?=(\\d{3})+$)' , 'ig'), "$1,");//只将整数部分进行都好分割
    str = source.join("." );//再将小数部分合并进来
  }
  return str;
}
async function goRouter(path) {
  router.push(path/*{
    path: path,
   /!* query: {},*!/
  }*/);
}
watch(
  () => panelFlag.value,
  (newValue, oldValue) => {
    findAll()
  }
)
</script>
<style lang="less" scoped>
.nc-hrb {
  height: calc(100% - 300px);

  .nc-hrb-top {
    :deep(.ant-row) {
      .ant-col {
        min-width: 18% !important;
        width: 18%;
        height: 80px;
        background-color: white;
        margin: 1%;
        border-radius: 4px 4px 4px 20px;

        div {
          height: 100%;
          display: inline-block;
        }

        div:nth-of-type(1) {
          width: 80px;
          background-color: #dbdfe8;
          padding: 20px;
          border-radius: 0 0 0 20px;

          .container-head-img {
            width: 40px;
            height: 40px;
            -webkit-user-drag: none;
          }
        }

        div:nth-of-type(2) {
          width: calc(100% - 80px);
          color: #545454;
          font-weight: bold;
          float: right;
          .span-blue {
            color: blue;
          }
          span:nth-of-type(1){
            padding: 5px;
            display: inline-block;
          }
          span:nth-of-type(3) {
            width: 68%;
            display: inline-flex;
            justify-content: flex-end;
          }
        }
      }
    }
  }

  .nc-hrb-middle {
    :deep(.ant-row) {
      .ant-col {
        height: 200px;
        background-color: white;
        margin: 1%;
        border-radius: 4px;
        padding: 5px;
        border-left: 3px solid slateblue;
        flex: 0 0 48%;
        max-width: 48%;

        div:nth-of-type(1) {
          span {
            font-weight: bold;
          }

          span:nth-of-type(1) {
            font-size: 16px;
            color: #009688;
          }

          span:nth-of-type(2) {
            float: right;
            font-size: 16px;
            cursor: pointer;
          }

          span:nth-of-type(2):hover {
            background-color: #128ecb;
            color: white;
          }

          span:nth-of-type(3),span:nth-of-type(4) {
            color: white;
            background-color: #009688;
            padding: 2px;
          }
        }

        div:nth-of-type(2) {
          display: flex;
          justify-content: space-between;
          padding: 10px 10px 5px;
          ul{
            width: 30%;
            li{
              font-weight: bold;
              color: #64aba4;
            }
           .li-title{
              font-size: 16px;
              color: black;
              border-bottom: 1px solid #afb0b0;
              margin-bottom: 10px;
            }
            li:hover:not(.li-title){
              cursor: pointer;
              color: #00bb00;
            }
          }
        }
      }
    }
  }
}
</style>
