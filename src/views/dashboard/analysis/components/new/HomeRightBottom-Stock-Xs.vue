<template>
  <div class="nc-hrb">
    <div class="nc-hrb-top">
      <a-row type="flex">
        <a-col :span="11">
          <div>
            <span>基础档案</span>
            <DownCircleOutlined/>
          </div>
          <div class="col-b-left">
            <div class="colbl-div">
              <div @click="goWeb('/sz-options')">
                <img src="/img/home/stock/j1.png" class="container-head-img">
                <span>参数设置</span>
              </div>
              <div>
                <img src="/img/home/stock/j2.png" class="container-head-img">
                <span>客户</span></div>
              <div>
                <img src="/img/home/stock/j3.png" class="container-head-img">
                <span>存货</span></div>
              <div><img src="/img/home/stock/j4.png" class="container-head-img"><span>仓库</span></div>
              <div><img src="/img/home/stock/j5.png" class="container-head-img"><span>收发方式</span></div>
              <div><img src="/img/home/stock/j6.png" class="container-head-img"><span>项目</span></div>
            </div>
            <span style="font-weight: bold;color: #666666;margin-left: 1em">基础档案设置与管理</span>
          </div>
        </a-col>
        <a-col :span="11">
          <div>
            <span>业务数据</span>
            <DownCircleOutlined/>
          </div>
          <div class="col-b-right">
            <ul>
              <li class="li-title">销售数据</li>
              <li ><span>299.00</span><span>个销售订单</span></li>
              <li ><span>0.00</span><span>个销货单</span></li>
              <li ><span></span><span>个批量销货单</span></li>
              <li ><span></span><span>个销售发票</span></li>
            </ul>
            <ul>
              <li class="li-title">应收款数据</li>
              <li><span></span><span>应收未收款</span></li>
              <li><span></span><span>应收已收款</span></li>
            </ul>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="nc-hrb-bottom">
      <div class="nc-hrb-b-one">
        <span style="font-weight: bold;margin-top: 3%;">正常销售</span>
        <div @click="goWeb('/xs-order')">
          <img src="/img/home/stock/xs01.png" class="container-head-img">
          <span>销售订单</span>
        </div>
        <CustomizeLineMax/>
        <div @click="goWeb('/xs-arrive')">
          <img src="/img/home/stock/xs02.png" class="container-head-img">
          <span>销货单</span>
        </div>
        <CustomizeLineMax/>
        <div @click="goWeb('/kc-xsDepot')">
          <img src="/img/home/stock/xs03.png" class="container-head-img">
          <span>销售出库单</span>
        </div>
        <CustomizeLineMax/>
        <div @click="goWeb('/kc-box')">
          <img src="/img/home/stock/xs04.png" class="container-head-img">
          <span>拣货装箱</span>
        </div>
        <CustomizeLineMax/>
        <div @click="goWeb('/wl-cgLogistics')">
          <img src="/img/home/stock/xs05.png" class="container-head-img">
          <span>物流送货</span>
        </div>
      </div>
      <div class="nc-hrb-b-two">
        <CustomizeLineMax/>
        <br/>
        <div>
         <img src="/img/home/stock/xs06.png" class="container-head-img">
         <span>收款核销</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {DownCircleOutlined} from '@ant-design/icons-vue';
import {Col as ACol,  Row as ARow,Button} from "ant-design-vue";
import {onMounted, ref} from "vue";
import router from "/@/router";
import CustomizeLineMax
  from "/@/views/dashboard/analysis/components/new/etc-components/CustomizeLineMax.vue";
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
        height: 200px;
        background-color: white;
        margin: 1%;
        flex: 0 0 48%;
        max-width: 48%;

        >div:nth-of-type(1) {
          background-color: #d7d8dc;
          padding: 10px 2%;
          span {
            font-weight: bold;
          }

          span:nth-of-type(1) {
            font-size: 14px;
            color: black;
          }

          span:nth-of-type(2) {
            float: right;
            font-size: 16px;
            cursor: pointer;
            margin: 2px;
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
        .col-b-left{
          .container-head-img{
            width: 55px;
            height: 50px;
            -webkit-user-drag: none;
            margin-bottom: 5px;
          }
          .colbl-div{
            width: 96%;
            margin: 2%;
            display: inline-flex;
            justify-content: space-between;
            >div{
              border: 1px solid #d7d8dc;
              padding: 1% 3%;
              display: inline-block;
              text-align: center;
              font-weight: bold;
            }
            >div:hover{
              border: 1px solid blue;
              background-color: #d7d8dc;
            }
          }
        }
        .col-b-right {
          display: flex;
          justify-content: space-between;
          padding: 10px 10px 5px;
          ul{
            width: 48%;
            li{
              font-weight: bold;
              display: flex;
              border-bottom: 1px solid #d7d8dc;
              justify-content: space-between;
              padding: 0 5%;
              color: #8f8f92;
              text-align: right;
              >span:nth-of-type(1){
                  color: black;
              }
            }
           .li-title{
              font-size: 14px;
              margin-bottom: 10px;
              padding: 0;
            }
          }
        }
      }
    }
  }
  .nc-hrb-bottom{
    width: 100%;
    height: 350px;
    background-color: white;
    .nc-hrb-b-one{
      width: 100%;
      padding: 3% 5% 0 2%;
      display: inline-flex;
      justify-content: space-between;
      >div{
        text-align: center;
        font-weight: bold;
      }
      >div:hover{
        cursor: pointer;
      }
      .customize-line{
        margin-top: 2%;
        width: 80px;
      }
    }
    .nc-hrb-b-two{
      width: 66%;
      text-align: center;
      >div{
        display: inline-block;
        margin-top: 15px;
        padding-right: 10px;
        font-weight: bold;
      }
      >div:hover{
        cursor: pointer;
      }
      :deep(.customize-line){
        margin-top: 2%;
        transform: rotate(90deg);
        >span:nth-of-type(1){
          right: -14px!important;
        }
      }
    }

    .container-head-img{
      width: 80px;
      height: 80px;

      -webkit-user-drag: none;
      margin-bottom: 5px;
    }
  }
}
</style>
