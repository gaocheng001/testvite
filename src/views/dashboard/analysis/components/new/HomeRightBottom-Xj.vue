<template>
  <div class="nc-hrb">
    <div class="nc-hrb-top">
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
            <span>业务处理</span>
            <MoreOutlined/>
            <br>
            <span>Transition Processing</span>
          </div>
          <div>
            <ul>
              <li class="li-title">处理</li>
              <li >出纳签字</li>
              <li>银行对账勾对</li>
            </ul>
            <ul>
              <li class="li-title">新增</li>
              <li>银行对账单</li>
              <li>承兑汇票</li>
            </ul>
            <ul>
              <li class="li-title">模板</li>
              <li>银行对账单模板</li>
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
              <li class="li-title">日记账</li>
              <li @click="goRouter('/xianJinYinHang/xian_jin_ri_ji/xian_jin_ri_ji_zhang')">现金日记账</li>
              <li @click="goRouter('/xianJinYinHang/xian_jin_ri_ji/yin_hang_ri_ji_zhang')">银行日记账</li>
            </ul>
            <ul>
              <li class="li-title">余额表</li>
              <li>现金银行余额表</li>
              <li>银行余额调节表</li>
            </ul>
            <ul>
              <li class="li-title">预警</li>
              <li>承兑汇票到期预警</li>
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
  accPanelList.value=await useRouteApi(firstShowData,{schemaName:props.pageAccId})({iyear: props.accYear+'-'+useCompanyOperateStoreWidthOut().getLoginDate.split('-')[1],panelFlag:panelFlag.value,panelType:'cn'})
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
