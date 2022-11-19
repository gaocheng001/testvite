<template>
  <div class="nc-hrb">
<!--    <div class="nc-hrb-top">
      <a-row type="flex">
        <a-col :span="8" @click="goTo('CG')">
          <span class="col-title">采购业务快捷入口</span>
          <div class="col-div">
            <img src="/img/home/stock/ch03.png" class="container-head-img">
            <CustomizeLine :title="'采购订单生成采购到货单'"/>
            <img src="/img/home/stock/ch02.png" class="container-head-img">
            <CustomizeLine :title="'采购到货单生成入库单'"/>
            <img src="/img/home/stock/ch01.png" class="container-head-img">
          </div>
        </a-col>
        <a-col :span="7" @click="goTo('XS')">
          <span class="col-title">销售业务快捷入口</span>
          <div class="col-div">
            <img src="/img/home/stock/ch03.png" class="container-head-img">
            <CustomizeLine :title="'销货单审核生成出库'"/>
            <img src="/img/home/stock/ch02.png" class="container-head-img">
            <CustomizeLine :title="'拣货装箱生成物流单'"/>
            <img src="/img/home/stock/ch01.png" class="container-head-img">
          </div>
        </a-col>
        <a-col :span="8" @click="goTo('KC')">
          <span class="col-title">库存业务快捷入口</span>
          <div class="col-div">
            <img src="/img/home/stock/ch03.png" class="container-head-img">
            <CustomizeLine :title="'盘点，调拨'"/>
            <img src="/img/home/stock/ch02.png" class="container-head-img">
            <CustomizeLine :title="'形态转换，借入借出'"/>
            <img src="/img/home/stock/ch01.png" class="container-head-img">
          </div>
        </a-col>
      </a-row>
    </div>-->
    <div class="nc-hrb-middle">
      <a-row type="flex">
        <a-col :span="11">
          <div>
            <span>业务单据</span>
            <MoreOutlined/>
            <br>
            <span>Business Document</span>
          </div>
          <div>
            <ul>
              <li class="li-title">采购业务</li>
              <li @click="goWeb('/cg-dingdan')">采购订单</li>
              <li @click="goWeb('/cg-arrive')">采购到货单</li>
              <li @click="goWeb('/cg-bill')">采购发票</li>
              <li @click="goWeb('/cg-jiesuan')">采购结算单</li>
            </ul>
            <ul>
              <li class="li-title">销售业务</li>
              <li @click="goWeb('/xs-order')">销售订单</li>
              <li @click="goWeb('/xs-arrive')">销货单</li>
              <li @click="goWeb('/xs-bReturn')">批量销货单</li>
              <li @click="goWeb('/xs-confirm')">销售出库确认单</li>
            </ul>
            <ul>
              <li class="li-title">仓储及物流</li>
              <li @click="goWeb('/kc-box')">拣货装箱单</li>
              <li @click="goWeb('/kc-transfer')">调拨单</li>
              <li @click="goWeb('/kc-inventory')">盘点单</li>
              <li @click="goWeb('/wl-cgLogistics')">物流送货单</li>
            </ul>
            <ul>
              <li class="li-title">成本核算</li>
              <li @click="goWeb('/cb-accounting')">自动成本核算</li>
              <li @click="goWeb('/cb-depot')">入库调整单</li>
              <li @click="goWeb('/cb-out-depot')">出库调整单</li>
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
              <li @click="goWeb('/kc-xclQuery')">现存量查询</li>
              <li @click="goWeb('/kc-pcxclQuery')">批次现存量查询</li>
              <li @click="goWeb('/kc-ledger')">库存台账</li>
              <li @click="goWeb('/kc-bLedger')">库存批次台账</li>
<!--              <li @click="goWeb('/kc-pcxclQuery')">批量现存量查询</li>-->
<!--              <li @click="goRouter('/zhongZhang/account-book/ab-kemuzhang/abk-rjtable')">科目日记账</li>-->
            </ul>
            <ul>
              <li class="li-title">统计表</li>
              <li @click="goWeb('/zb-gjList')">销售统计表</li>
              <li @click="goWeb('/zb-cggxlist')">采购统计表</li>
              <li @click="goWeb('/zb-despatcher')">数量收发存汇总表</li>
              <li @click="goWeb('/zb-ch-amount')">金额收发存汇总表</li>
            </ul>
            <ul>
              <li class="li-title">综合报表</li>
              <li @click="goWeb('/zb-phbStock')">销售排行榜</li>
              <li @click="goWeb('/zb-ysye')">客户应收余额表</li>
              <li @click="goWeb('/cg-gysyf')">供应商应付余额表</li>
              <li @click="goWeb('/zb-ch-warning')">存货有效期预警表</li>

            </ul>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import {MoreOutlined} from '@ant-design/icons-vue';
import {Col as ACol, Input as AInput, Row as ARow, Select as ASelect} from "ant-design-vue";
import {onMounted, ref} from "vue";
import router from "/@/router";
import CustomizeLine
  from "/@/views/dashboard/analysis/components/new/etc-components/CustomizeLine.vue";
// import imgtest from '/@/assets/images/dashboard/wokb/performance.png'
const imgtest=''
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const accPanelList=ref([])
const props = defineProps(['modelValue', 'pageAccId'])
const emit = defineEmits(['toggle','routing'])
onMounted( async ()=>{
})

const goTo = (c) => {
  emit('toggle',c)
}
const goWeb = (c) => {
  emit('routing',c)
}
</script>
<style lang="less" scoped>
.nc-hrb {
  height: calc(100% - 300px);

  .nc-hrb-top {
    :deep(.ant-row) {
      .ant-col {
        min-width: 18% !important;
        width: 18%;
        height: 100px;
        margin: 1% 6px;
        background-color: white;
        user-select: none;
        text-align: center;
        padding: .2%;
        .col-title{
          font-size: 16px;
          font-weight: bold;
        }
        .col-div{
          margin-top: 2%;
          .container-head-img{
            -webkit-user-drag: none;
            width: 50px;height: 50px;
            display: inline-block;
            vertical-align: -30px !important
          }

        }
      }
      .ant-col:hover{
        cursor: pointer;
        border: 2px solid #146dc1;
        color: #146dc1;
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
